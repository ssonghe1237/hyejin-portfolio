package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.config.ProfileUploadProperties;
import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.Path;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LocalProfileImageStorageServiceTest {
    @TempDir Path tempDirectory;
    private LocalProfileImageStorageService service;

    @BeforeEach
    void setUp() {
        ProfileUploadProperties properties = new ProfileUploadProperties();
        properties.setImageDirectory(tempDirectory.toString());
        properties.setImageUrlPrefix("/uploads/profile");
        properties.setMaxImageSize(10 * 1024 * 1024);
        service = new LocalProfileImageStorageService(properties);
    }

    @Test
    void storesProfileImageAndValidatesManagedUrl() {
        MockMultipartFile file = new MockMultipartFile("file", "profile.png", "image/png", new byte[]{1, 2, 3});
        ImageUploadResponseDto response = service.store(file);

        assertThat(response.imageUrl()).startsWith("/uploads/profile/").endsWith(".png");
        service.validateManagedImageUrl(response.imageUrl());
    }

    @Test
    void rejectsUnsupportedExtension() {
        MockMultipartFile file = new MockMultipartFile("file", "profile.gif", "image/png", new byte[]{1});
        assertThatThrownBy(() -> service.store(file)).isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("지원하지 않는 이미지 확장자");
    }

    @Test
    void rejectsProjectImageUrlAsManagedProfileImage() {
        assertThatThrownBy(() -> service.validateManagedImageUrl("/uploads/projects/2026/08/image.png"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("관리되는 프로필 이미지 URL이 아닙니다");
    }
}
