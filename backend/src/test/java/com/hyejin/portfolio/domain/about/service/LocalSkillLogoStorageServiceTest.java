package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.config.SkillLogoUploadProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.server.ResponseStatusException;
import java.nio.file.Path;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class LocalSkillLogoStorageServiceTest {
    @TempDir Path directory;
    private LocalSkillLogoStorageService service;
    @BeforeEach void setUp() {
        SkillLogoUploadProperties properties = new SkillLogoUploadProperties();
        properties.setDirectory(directory.toString()); properties.setUrlPrefix("/uploads/skills"); properties.setMaxSize(10_485_760);
        service = new LocalSkillLogoStorageService(properties);
    }
    @Test void storesPngAndWebp() {
        assertThat(service.store(new MockMultipartFile("file", "java.png", "image/png", new byte[]{1})).imageUrl()).startsWith("/uploads/skills/").endsWith(".png");
        assertThat(service.store(new MockMultipartFile("file", "spring.webp", "image/webp", new byte[]{1})).imageUrl()).endsWith(".webp");
    }
    @Test void rejectsInvalidExtensionAndOtherNamespaces() {
        assertThatThrownBy(() -> service.store(new MockMultipartFile("file", "logo.svg", "image/svg+xml", new byte[]{1}))).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.validateManagedLogoUrl("/uploads/profile/logo.png")).isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.validateManagedLogoUrl("/uploads/projects/logo.png")).isInstanceOf(ResponseStatusException.class);
    }
}
