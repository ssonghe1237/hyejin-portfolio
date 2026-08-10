package com.hyejin.portfolio.domain.contact.service;

import com.hyejin.portfolio.domain.contact.dto.AdminContactDetailResponseDto;
import com.hyejin.portfolio.domain.contact.dto.AdminContactUpsertRequestDto;
import com.hyejin.portfolio.domain.contact.entity.ContactEntity;
import com.hyejin.portfolio.domain.contact.repository.ContactRepository;
import com.hyejin.portfolio.domain.contact.storage.ResumeStorageService;
import com.hyejin.portfolio.domain.contact.storage.StoredResumeFile;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.Locale;
import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.service
 * fileName       : AdminContactServiceImpl
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 Contact 콘텐츠 Service
 *                  - 싱글턴 키 기준 Contact 상세 조회
 *                  - Contact 미등록 시 생성 및 기존 데이터 수정
 *                  - GitHub 및 LinkedIn 외부 URL 검증
 *                  - Contact 공개 상태 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminContactServiceImpl implements AdminContactService {

    private final ResumeStorageService resumeStorageService;

    private final ContactRepository contactRepository;


    // =====================================================================================
    // 조회
    // =====================================================================================

    // 관리자 Contact 상세 조회
    @Override
    public Optional<AdminContactDetailResponseDto> getContact() {
        return contactRepository
                .findBySingletonKey(
                        ContactEntity.SINGLETON_KEY
                )
                .map(AdminContactDetailResponseDto::from);
    }

    // =====================================================================================
    // 저장
    // =====================================================================================

    // 관리자 Contact 생성·수정
    @Override
    @Transactional
    public AdminContactDetailResponseDto upsertContact(
            AdminContactUpsertRequestDto request
    ) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contact 저장 요청 정보가 필요합니다."
            );
        }

        String heading =
                request.heading().trim();

        String description =
                request.description().trim();

        String email =
                request.email().trim();

        String githubUrl =
                validateHttpUrl(
                        request.githubUrl(),
                        "GitHub"
                );

        String linkedinUrl =
                normalizeOptionalHttpUrl(
                        request.linkedinUrl(),
                        "LinkedIn"
                );

        String resumeLabel =
                request.resumeLabel().trim();

        ContactEntity contact =
                contactRepository
                        .findBySingletonKey(
                                ContactEntity.SINGLETON_KEY
                        )
                        .orElseGet(() ->
                                ContactEntity.builder()
                                        .heading(heading)
                                        .description(description)
                                        .email(email)
                                        .githubUrl(githubUrl)
                                        .linkedinUrl(linkedinUrl)
                                        .resumeLabel(resumeLabel)
                                        .published(request.published())
                                        .build()
                        );

        contact.updateBasicInfo(
                heading,
                description,
                email,
                githubUrl,
                linkedinUrl,
                resumeLabel
        );

        if (request.published()) {
            contact.publish();
        } else {
            contact.unpublish();
        }

        ContactEntity savedContact =
                contactRepository.saveAndFlush(
                        contact
                );

        return AdminContactDetailResponseDto.from(
                savedContact
        );
    }

    // =====================================================================================
    // 이력서 PDF 관리
    // =====================================================================================

    // 관리자 이력서 PDF 업로드·교체
    @Override
    @Transactional
    public AdminContactDetailResponseDto uploadResume(
            MultipartFile file
    ) {
        ContactEntity contact =
                contactRepository
                        .findBySingletonKey(
                                ContactEntity.SINGLETON_KEY
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "이력서를 업로드하기 전에 Contact 기본 정보를 먼저 저장해 주세요."
                                )
                        );

        String previousResumeFileUrl =
                contact.getResumeFileUrl();

        StoredResumeFile storedResumeFile =
                resumeStorageService.store(
                        file
                );

        /*
         * 파일 시스템은 DB 트랜잭션에 참여하지 않는다.
         *
         * COMMIT 성공:
         * → 기존 PDF 삭제
         *
         * ROLLBACK:
         * → 방금 저장한 새 PDF 삭제
         */
        registerResumeReplacementCleanup(
                storedResumeFile.fileUrl(),
                previousResumeFileUrl
        );

        contact.updateResume(
                storedResumeFile.fileUrl(),
                storedResumeFile.originalFileName()
        );

        ContactEntity savedContact =
                contactRepository.saveAndFlush(
                        contact
                );

        return AdminContactDetailResponseDto.from(
                savedContact
        );
    }

    // 관리자 이력서 PDF 삭제
    @Override
    @Transactional
    public void deleteResume() {
        ContactEntity contact =
                contactRepository
                        .findBySingletonKey(
                                ContactEntity.SINGLETON_KEY
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Contact 콘텐츠를 찾을 수 없습니다."
                                )
                        );

        String resumeFileUrl =
                contact.getResumeFileUrl();

        if (
                resumeFileUrl == null
                        || resumeFileUrl.isBlank()
        ) {
            return;
        }

        resumeStorageService.validateManagedResumeUrl(
                resumeFileUrl
        );

        contact.removeResume();

        contactRepository.saveAndFlush(
                contact
        );

        registerResumeDeleteAfterCommit(
                resumeFileUrl
        );
    }

    // =====================================================================================
    // URL 검증
    // =====================================================================================

    private String normalizeOptionalHttpUrl(
            String rawUrl,
            String fieldName
    ) {
        if (
                rawUrl == null
                        || rawUrl.isBlank()
        ) {
            return null;
        }

        return validateHttpUrl(
                rawUrl,
                fieldName
        );
    }

    private String validateHttpUrl(
            String rawUrl,
            String fieldName
    ) {
        if (
                rawUrl == null
                        || rawUrl.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " 주소는 필수입니다."
            );
        }

        String url =
                rawUrl.trim();

        URI uri;

        try {
            uri = URI.create(
                    url
            );
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " 주소 형식이 올바르지 않습니다."
            );
        }

        String scheme =
                uri.getScheme();

        if (scheme == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " 주소에는 http 또는 https 프로토콜이 필요합니다."
            );
        }

        String normalizedScheme =
                scheme.toLowerCase(
                        Locale.ROOT
                );

        if (
                !normalizedScheme.equals("http")
                        && !normalizedScheme.equals("https")
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " 주소에는 http 또는 https만 사용할 수 있습니다."
            );
        }

        if (
                uri.getHost() == null
                        || uri.getHost().isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    fieldName + " 주소의 호스트 정보가 올바르지 않습니다."
            );
        }

        return url;
    }

    // =====================================================================================
    // 이력서 파일 트랜잭션 후처리
    // =====================================================================================

    private void registerResumeReplacementCleanup(
            String newResumeFileUrl,
            String previousResumeFileUrl
    ) {
        if (
                !TransactionSynchronizationManager
                        .isSynchronizationActive()
        ) {
            return;
        }

        TransactionSynchronizationManager
                .registerSynchronization(
                        new TransactionSynchronization() {

                            @Override
                            public void afterCompletion(
                                    int status
                            ) {
                                if (
                                        status
                                                == STATUS_COMMITTED
                                ) {
                                    /*
                                     * DB가 새 PDF URL로 정상 변경된 경우
                                     * 기존 PDF를 제거한다.
                                     */
                                    deleteResumeFileQuietly(
                                            previousResumeFileUrl
                                    );

                                    return;
                                }

                                /*
                                 * DB 트랜잭션이 롤백됐다면
                                 * 새로 저장한 PDF는 사용되지 않으므로 제거한다.
                                 */
                                deleteResumeFileQuietly(
                                        newResumeFileUrl
                                );
                            }
                        }
                );
    }

    private void registerResumeDeleteAfterCommit(
            String resumeFileUrl
    ) {
        if (
                !TransactionSynchronizationManager
                        .isSynchronizationActive()
        ) {
            return;
        }

        TransactionSynchronizationManager
                .registerSynchronization(
                        new TransactionSynchronization() {

                            @Override
                            public void afterCompletion(
                                    int status
                            ) {
                                if (
                                        status
                                                == STATUS_COMMITTED
                                ) {
                                    deleteResumeFileQuietly(
                                            resumeFileUrl
                                    );
                                }
                            }
                        }
                );
    }

    private void deleteResumeFileQuietly(
            String fileUrl
    ) {
        if (
                fileUrl == null
                        || fileUrl.isBlank()
        ) {
            return;
        }

        try {
            resumeStorageService.delete(
                    fileUrl
            );
        } catch (RuntimeException exception) {
            /*
             * DB COMMIT 이후 실제 파일 삭제 실패로
             * 이미 성공한 비즈니스 트랜잭션을 되돌릴 수 없다.
             *
             * 운영 로그에 남기고 추후 파일 정리 대상으로 처리한다.
             */
            log.error(
                    "이력서 PDF 파일 정리에 실패했습니다. fileUrl={}",
                    fileUrl,
                    exception
            );
        }
    }


}