package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.upload.config.ProfileUploadProperties;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileImageOrphanCleanupServiceImpl implements ProfileImageOrphanCleanupService {
    private final ProfileImageStorageService storageService;
    private final AboutRepository aboutRepository;
    private final ProfileUploadProperties properties;

    @Override
    public void cleanupOrphanImages() {
        long retentionHours = properties.getOrphanRetentionHours();
        if (retentionHours <= 0) throw new IllegalStateException("프로필 고아 이미지 보관 시간은 1시간 이상이어야 합니다.");

        Instant cutoff = Instant.now().minus(Duration.ofHours(retentionHours));
        List<String> candidates = storageService.findImageUrlsModifiedBefore(cutoff);
        String referencedUrl = aboutRepository.findBySingletonKey(AboutEntity.SINGLETON_KEY)
                .map(AboutEntity::getProfileImageUrl)
                .orElse(null);

        int deletedCount = 0;
        int failedCount = 0;
        for (String candidate : candidates) {
            if (candidate.equals(referencedUrl)) continue;
            try {
                if (storageService.delete(candidate)) deletedCount++;
            } catch (RuntimeException exception) {
                failedCount++;
                log.error("프로필 고아 이미지 삭제 실패. imageUrl={}", candidate, exception);
            }
        }
        log.info("프로필 고아 이미지 정리 완료. candidateCount={}, deletedCount={}, failedCount={}", candidates.size(), deletedCount, failedCount);
    }
}
