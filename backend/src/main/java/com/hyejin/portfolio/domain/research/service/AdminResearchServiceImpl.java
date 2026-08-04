package com.hyejin.portfolio.domain.research.service;

import com.hyejin.portfolio.domain.research.dto.*;
import com.hyejin.portfolio.domain.research.entity.ResearchEntity;
import com.hyejin.portfolio.domain.research.repository.ResearchRepository;
import com.hyejin.portfolio.global.security.html.RichTextHtmlSanitizer;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.research.service
 * fileName       : AdminResearchServiceImpl
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 게시글 관리 Service
 *                  - Research 게시글 등록
 *                  - Research slug 중복 검증
 *                  - Tiptap 본문 HTML 정제 및 저장
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminResearchServiceImpl implements AdminResearchService {

    private final ResearchRepository researchRepository;
    private final RichTextHtmlSanitizer richTextHtmlSanitizer;

    // =====================================================================================
    // 등록
    // =====================================================================================

    // 관리자 Research 게시글 등록
    @Override
    @Transactional
    public AdminResearchDetailResponseDto createResearch(
            AdminResearchCreateRequestDto request
    ) {
        // 등록 요청 검증
        validateCreateRequest(request);

        // Research 실제 텍스트 존재 여부
        String sanitizedContentHtml =
                sanitizeAndValidateContentHtml(
                        request.contentHtml()
                );

        ResearchEntity research = researchRepository.save(
                ResearchEntity.builder()
                        .title(request.title().trim())
                        .slug(request.slug().trim())
                        .summary(request.summary().trim())
                        .contentHtml(sanitizedContentHtml)
                        .category(request.category().trim())
                        .displayOrder(request.displayOrder())
                        .published(request.published())
                        .build()
        );

        // @PrePersist에서 생성일, 수정일, 최초 공개일이 설정 된 최종 상태를 응답에 포함시키기 위해 즉시 DB에 반영
        researchRepository.flush();

        return AdminResearchDetailResponseDto.from(
                research
        );
    }

    // 등록 요청 검증
    private void validateCreateRequest(
            AdminResearchCreateRequestDto request
    ) {
        String slug = request.slug().trim();

        if (researchRepository.existsBySlug(slug)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 사용 중인 Research slug입니다."
            );
        }
    }

    // Research 실제 텍스트 존재 여부
    private String sanitizeAndValidateContentHtml(
            @NotBlank(message = "Research 본문은 필수입니다.") String contentHtml
    ) {
        String sanitizedContentHtml =
                richTextHtmlSanitizer.sanitize(contentHtml);

        // @NotBlank는 <p></p>, <p><br></p> 처럼 html 구조만 존재하는 값도 유효한 문자열로 판단할 수 있음
        // 따라선 html 정제 후 실제 표시할 텍스트가 있는지 별도 확인
        if (!richTextHtmlSanitizer.hasVisibleContent(
                sanitizedContentHtml
        )) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Research 본문에는 실제 내용이 포함되어  있어야 합니다."
            );
        }

        return sanitizedContentHtml;
    }

    // =====================================================================================
    // 조회
    // =====================================================================================

    // 관리자 Research 전체 목록 조회
    @Override
    public List<AdminResearchListResponseDto> getResearchList() {
        return researchRepository
                .findAllByOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(AdminResearchListResponseDto::from)
                .toList();
    }

    // 관리자 Research 상세 조회
    @Override
    public AdminResearchDetailResponseDto getResearchDetail(
            Long researchId
    ) {
        ResearchEntity research = findResearch(
                researchId
        );

        return AdminResearchDetailResponseDto.from(research);
    }

    // =====================================================================================
    // 수정
    // =====================================================================================

    // 관리자 Research 게시글 수정
    @Override
    @Transactional
    public AdminResearchDetailResponseDto updateResearch(
            Long researchId,
            AdminResearchUpdateRequestDto request
    ) {
        ResearchEntity research = findResearch(researchId);

        validateUpdateRequest(
                researchId,
                request
        );

        String sanitizedContentHtml =
                sanitizeAndValidateContentHtml(
                        request.contentHtml()
                );

        research.updateBasicInfo(
                request.title().trim(),
                request.slug().trim(),
                request.summary().trim(),
                sanitizedContentHtml,
                request.category().trim(),
                request.displayOrder()
        );

        if (Boolean.TRUE.equals(request.published())) {
            research.publish();
        } else {
            research.unpublished();
        }

        // @PreUpdate에서 updateAt을 갱신하고, 공개 상태 변경에 따른 publishedAt을 포함한 최종 상태를 상세 응답에 반영하기 위해 즉시 db 반영
        researchRepository.flush();

        return AdminResearchDetailResponseDto.from(
                research
        );
    }

    // 관리자 Research 공개 상태 변경
    @Override
    @Transactional
    public AdminResearchDetailResponseDto updateResearchPublication(
            Long researchId,
            AdminResearchPublicationUpdateRequestDto request
    ) {
        ResearchEntity research = findResearch(
                researchId
        );

        if (request == null
                || request.published() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Research 공개 여부는 필수입니다."
            );
        }

        boolean nextPublished = request.published();

        /*
         * 이미 동일한 공개 상태라면 불필요한 UPDATE를 실행하지 않는다.
         * 이 경우 updatedAt도 변경하지 않는다.
         */
        if (research.isPublished() == nextPublished) {
            return AdminResearchDetailResponseDto.from(
                    research
            );
        }

        if (nextPublished) {
            research.publish();
        } else {
            research.unpublished();
        }

        /*
         * 공개 상태가 실제로 변경된 경우 @PreUpdate가 실행되어
         * updatedAt이 갱신된다.
         *
         * 최초 공개일 publishedAt은 ResearchEntity.publish()에서
         * 값이 없을 때만 생성한다.
         */
        researchRepository.flush();

        return AdminResearchDetailResponseDto.from(
                research
        );
    }

    // =====================================================================================
    // 삭제
    // =====================================================================================

    @Override
    @Transactional
    public void deleteResearch(
            Long researchId
    ) {
        ResearchEntity research = findResearch(
                researchId
        );

        researchRepository.delete(
                research
        );

        /*
         * 삭제 결과를 현재 트랜잭션 안에서 즉시 DB에 반영하여
         * 제약 조건 등의 오류를 API 응답 전에 확인한다.
         */
        researchRepository.flush();
    }

    // 관리자 Research 수정 요청 검증
    private void validateUpdateRequest(
            Long researchId,
            AdminResearchUpdateRequestDto request
    ) {
        String slug = request.slug().trim();

        if (researchRepository.existsBySlugAndResearchIdNot(
                slug, researchId
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 사용 중인 Research Slug입니다."
            );
        }
    }

    // Research ID 기준 게시글 조회
    private ResearchEntity findResearch(
            Long researchId
    ) {
        return researchRepository.findById(researchId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Research 게시글을 찾을 수 없습니다."
                ));
    }


}
