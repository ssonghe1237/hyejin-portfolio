package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.upload.config.ProfileUploadProperties;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ProfileImageOrphanCleanupServiceImplTest {
    @Test
    void preservesReferencedImageAndDeletesUnreferencedImage() {
        ProfileImageStorageService storage = mock(ProfileImageStorageService.class);
        AboutRepository repository = mock(AboutRepository.class);
        ProfileUploadProperties properties = new ProfileUploadProperties();
        properties.setOrphanRetentionHours(24);

        String referenced = "/uploads/profile/2026/08/referenced.png";
        String orphan = "/uploads/profile/2026/08/orphan.png";
        AboutEntity about = AboutEntity.builder().heading("h").summary("s").ctaLabel("c").ctaUrl("/c").published(true).build();
        about.updateProfile(null, null, referenced, null, null, null, null, null, null);

        when(storage.findImageUrlsModifiedBefore(any())).thenReturn(List.of(referenced, orphan));
        when(repository.findBySingletonKey(AboutEntity.SINGLETON_KEY)).thenReturn(Optional.of(about));
        when(storage.delete(orphan)).thenReturn(true);

        new ProfileImageOrphanCleanupServiceImpl(storage, repository, properties).cleanupOrphanImages();

        verify(storage, never()).delete(referenced);
        verify(storage).delete(orphan);
    }
}
