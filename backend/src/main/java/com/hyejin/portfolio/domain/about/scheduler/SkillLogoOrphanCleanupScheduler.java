package com.hyejin.portfolio.domain.about.scheduler;

import com.hyejin.portfolio.domain.about.service.SkillLogoOrphanCleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.domain.about.scheduler
 * fileName       : SkillLogoOrphanCleanupScheduler
 * author         : Song
 * date           : 2026-08-23
 * description    : 기술 로고 고아 파일 정리 스케줄러
 *                  - 설정된 실행 주기에 따라 기술 로고 정리 Service 호출
 *                  - 미사용 기술 로고 파일 정리 작업 실행
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-23        Song               최초 생성
 */

@Slf4j @Component @RequiredArgsConstructor
@ConditionalOnProperty(prefix = "app.skill-logo-upload", name = "orphan-cleanup-enabled", havingValue = "true", matchIfMissing = true)
public class SkillLogoOrphanCleanupScheduler {
    private final SkillLogoOrphanCleanupService cleanupService;
    @Scheduled(cron = "${app.skill-logo-upload.orphan-cleanup-cron}", zone = "${app.skill-logo-upload.orphan-cleanup-zone}")
    public void cleanup() {
        try { cleanupService.cleanupOrphanLogos(); }
        catch (RuntimeException exception) { log.error("기술 고아 로고 정리 작업에 실패했습니다.", exception); }
    }
}
