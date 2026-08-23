package com.hyejin.portfolio.domain.about.scheduler;

import com.hyejin.portfolio.domain.about.service.SkillLogoOrphanCleanupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

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
