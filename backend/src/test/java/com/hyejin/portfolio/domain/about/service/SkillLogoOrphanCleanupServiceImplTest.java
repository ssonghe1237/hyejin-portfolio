package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.entity.AboutSkillCategoryEntity;
import com.hyejin.portfolio.domain.about.entity.AboutSkillEntity;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.upload.config.SkillLogoUploadProperties;
import org.junit.jupiter.api.Test;
import java.util.List;
import java.util.Optional;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SkillLogoOrphanCleanupServiceImplTest {
    @Test void preservesReferencedAndDeletesUnreferencedLogo() {
        SkillLogoStorageService storage = mock(SkillLogoStorageService.class);
        AboutRepository repository = mock(AboutRepository.class);
        SkillLogoUploadProperties properties = new SkillLogoUploadProperties();
        properties.setUrlPrefix("/uploads/skills"); properties.setOrphanRetentionHours(24);
        String referenced = "/uploads/skills/2026/08/java.png", orphan = "/uploads/skills/2026/08/orphan.png";
        AboutSkillEntity skill = AboutSkillEntity.builder().name("Java").logoUrl(referenced).displayOrder(1).build();
        AboutSkillCategoryEntity category = AboutSkillCategoryEntity.builder().title("BACKEND").displayOrder(1).skills(List.of(skill)).build();
        AboutEntity about = AboutEntity.builder().heading("h").summary("s").ctaLabel("c").ctaUrl("/c").published(true).build();
        about.replaceSkillCategories(List.of(category));
        when(repository.findBySingletonKey(AboutEntity.SINGLETON_KEY)).thenReturn(Optional.of(about));
        when(storage.findLogoUrlsModifiedBefore(any())).thenReturn(List.of(referenced, orphan));
        when(storage.delete(orphan)).thenReturn(true);
        new SkillLogoOrphanCleanupServiceImpl(storage, repository, properties).cleanupOrphanLogos();
        verify(storage, never()).delete(referenced); verify(storage).delete(orphan);
    }
}
