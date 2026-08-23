package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.upload.config.SkillLogoUploadProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/** About에 참조되지 않는 grace-expired Skill Logo를 정리하는 Service. @author Song */
@Slf4j @Service @RequiredArgsConstructor
public class SkillLogoOrphanCleanupServiceImpl implements SkillLogoOrphanCleanupService {
    private final SkillLogoStorageService storageService;
    private final AboutRepository aboutRepository;
    private final SkillLogoUploadProperties properties;
    @Override public void cleanupOrphanLogos() {
        if (properties.getOrphanRetentionHours() <= 0) throw new IllegalStateException("기술 로고 보관 시간은 1시간 이상이어야 합니다.");
        List<String> candidates = storageService.findLogoUrlsModifiedBefore(
                Instant.now().minus(Duration.ofHours(properties.getOrphanRetentionHours())));
        Set<String> referenced = new HashSet<>();
        aboutRepository.findBySingletonKey(AboutEntity.SINGLETON_KEY).ifPresent(about ->
                about.getSkillCategories().forEach(category -> category.getSkills().forEach(skill -> {
                    String url = skill.getLogoUrl();
                    if (url != null && url.startsWith(properties.getUrlPrefix() + "/")) referenced.add(url);
                })));
        int deleted = 0, failed = 0;
        for (String candidate : candidates) {
            if (referenced.contains(candidate)) continue;
            try { if (storageService.delete(candidate)) deleted++; }
            catch (RuntimeException exception) { failed++; log.error("기술 고아 로고 삭제 실패. logoUrl={}", candidate, exception); }
        }
        log.info("기술 고아 로고 정리 완료. candidateCount={}, referencedCount={}, deletedCount={}, failedCount={}", candidates.size(), referenced.size(), deleted, failed);
    }
}
