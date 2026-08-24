package com.hyejin.portfolio.domain.about.scheduler;

import com.hyejin.portfolio.domain.about.service.ProfileImageOrphanCleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.domain.about.scheduler
 * fileName       : ProfileImageOrphanCleanupScheduler
 * author         : Song
 * date           : 2026-08-23
 * description    : 프로필 고아 이미지 정리 스케줄러
 *                  - 설정된 실행 주기에 따라 프로필 이미지 정리 Service 호출
 *                  - DB에서 사용되지 않는 오래된 이미지 정리 작업 실행
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-23        Song               최초 생성
 */

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.profile-upload", name = "orphan-cleanup-enabled", havingValue = "true", matchIfMissing = true)
public class ProfileImageOrphanCleanupScheduler {
    private final ProfileImageOrphanCleanupService cleanupService;

    @Scheduled(cron = "${app.profile-upload.orphan-cleanup-cron}", zone = "${app.profile-upload.orphan-cleanup-zone}")
    public void cleanupOrphanImages() {
        try {
            cleanupService.cleanupOrphanImages();
        } catch (RuntimeException exception) {
            log.error("프로필 고아 이미지 정리 작업에 실패했습니다.", exception);
        }
    }
}
