package com.hyejin.portfolio.domain.project.scheduler;

import com.hyejin.portfolio.domain.project.service.ProjectImageOrphanCleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;

/**
 * packageName    : com.hyejin.portfolio.domain.project.scheduler
 * fileName       : ProjectImageOrphanCleanupScheduler
 * author         : Song
 * date           : 2026-07-30
 * description    : 프로젝트 고아 이미지 정리 Scheduler
 *                  - 설정된 cron 주기에 따라 고아 이미지 정리 실행
 *                  - 정리 기능 비활성화 설정 지원
 *                  - 전체 작업 실패 시 오류 로그 기록
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-30        Song       최초 생성
 */
@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(
        prefix = "app.upload",
        name = "orphan-cleanup-enabled",
        havingValue = "true",
        matchIfMissing = true
)
public class ProjectImageOrphanCleanupScheduler {

    private final ProjectImageOrphanCleanupService
            projectImageOrphanCleanupService;

    /**
     * 설정된 실행 주기에 따라 프로젝트 고아 이미지를 정리합니다.
     *
     * 파일 하나의 삭제 실패는 Service에서 개별 처리하고,
     * 폴더 조회 또는 DB 조회 등의 전체 작업 실패는 여기서 기록합니다.
     */
    @Scheduled(
            cron = "${app.upload.orphan-cleanup-cron}",
            zone = "${app.upload.orphan-cleanup-zone}"
    )
    public void cleanupOrphanImages() {
        long startedAt =
                System.nanoTime();

        log.info(
                "프로젝트 고아 이미지 정리 작업을 시작합니다."
        );

        try {
            projectImageOrphanCleanupService
                    .cleanupOrphanImages();

        } catch (RuntimeException exception) {
            /*
             * 이번 실행이 실패해도 Scheduler 자체가 종료되지 않고
             * 다음 cron 실행 시 다시 시도할 수 있도록 예외를 기록한다.
             */
            log.error(
                    "프로젝트 고아 이미지 정리 작업에 실패했습니다.",
                    exception
            );

        } finally {
            long elapsedNanos =
                    System.nanoTime() - startedAt;

            long elapsedMillis =
                    Duration
                            .ofNanos(elapsedNanos)
                            .toMillis();

            log.info(
                    "프로젝트 고아 이미지 정리 작업을 종료합니다. elapsedMillis={}",
                    elapsedMillis
            );
        }
    }
}