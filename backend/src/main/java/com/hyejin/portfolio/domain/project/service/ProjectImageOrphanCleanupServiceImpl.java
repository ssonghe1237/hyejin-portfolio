package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.repository.ProjectImageRepository;
import com.hyejin.portfolio.global.upload.config.UploadProperties;
import com.hyejin.portfolio.global.upload.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : ProjectImageOrphanCleanupServiceImpl
 * author         : Song
 * date           : 2026-07-30
 * description    : 프로젝트 고아 이미지 정리 Service 구현체
 *                  - 설정된 보관 시간 기준으로 오래된 파일 조회
 *                  - project_images 참조 URL 일괄 조회
 *                  - DB에서 참조하지 않는 실제 이미지 파일 삭제
 *                  - 개별 파일 삭제 실패 시 나머지 파일 정리 계속 진행
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-30        Song       최초 생성
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProjectImageOrphanCleanupServiceImpl
        implements ProjectImageOrphanCleanupService {

    private final ImageStorageService imageStorageService;
    private final ProjectImageRepository projectImageRepository;
    private final UploadProperties uploadProperties;

    /**
     * 설정된 보관 시간을 초과한 이미지 중
     * project_images에서 참조하지 않는 파일을 삭제합니다.
     *
     * 처리 순서:
     * 1. 고아 이미지 보관 시간 검증
     * 2. 정리 기준 시각 계산
     * 3. 기준 시각보다 오래된 파일 URL 조회
     * 4. DB에서 참조 중인 URL 일괄 조회
     * 5. DB 미참조 파일만 실제 삭제
     * 6. 삭제 결과 로그 기록
     */
    @Override
    public void cleanupOrphanImages() {
        long retentionHours =
                uploadProperties.getOrphanRetentionHours();

        if (retentionHours <= 0) {
            throw new IllegalStateException(
                    "고아 이미지 보관 시간은 1시간 이상이어야 합니다."
            );
        }

        Instant cutoff =
                Instant.now().minus(
                        Duration.ofHours(retentionHours)
                );

        List<String> candidateImageUrls =
                imageStorageService
                        .findImageUrlsModifiedBefore(cutoff);

        if (candidateImageUrls.isEmpty()) {
            log.info(
                    "고아 이미지 정리 완료: 오래된 이미지 후보가 없습니다. cutoff={}",
                    cutoff
            );

            return;
        }

        List<String> referencedImageUrls =
                projectImageRepository
                        .findReferencedImageUrls(
                                candidateImageUrls
                        );

        Set<String> referencedImageUrlSet =
                new HashSet<>(
                        referencedImageUrls
                );

        int referencedCount = 0;
        int orphanCount = 0;
        int deletedCount = 0;
        int missingCount = 0;
        int failedCount = 0;

        for (String imageUrl : candidateImageUrls) {
            if (referencedImageUrlSet.contains(imageUrl)) {
                referencedCount++;
                continue;
            }

            orphanCount++;

            try {
                boolean deleted =
                        imageStorageService.delete(
                                imageUrl
                        );

                if (deleted) {
                    deletedCount++;

                    log.info(
                            "고아 이미지 파일 삭제 완료. imageUrl={}",
                            imageUrl
                    );
                } else {
                    /*
                     * 조회 이후 다른 작업에서 파일이 먼저 삭제된 경우다.
                     * 최종 상태가 파일 없음이므로 실패로 처리하지 않는다.
                     */
                    missingCount++;

                    log.info(
                            "고아 이미지 파일이 이미 존재하지 않습니다. imageUrl={}",
                            imageUrl
                    );
                }
            } catch (RuntimeException exception) {
                /*
                 * 파일 하나의 삭제 실패로 전체 스케줄 작업을 중단하지 않는다.
                 */
                failedCount++;

                log.error(
                        "고아 이미지 파일 삭제 실패. imageUrl={}",
                        imageUrl,
                        exception
                );
            }
        }

        log.info(
                """
                고아 이미지 정리 완료:
                cutoff={},
                candidateCount={},
                referencedCount={},
                orphanCount={},
                deletedCount={},
                missingCount={},
                failedCount={}
                """,
                cutoff,
                candidateImageUrls.size(),
                referencedCount,
                orphanCount,
                deletedCount,
                missingCount,
                failedCount
        );
    }
}