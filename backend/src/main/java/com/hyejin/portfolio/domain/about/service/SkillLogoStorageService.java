package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;
import java.time.Instant;
import java.util.List;

public interface SkillLogoStorageService {
    ImageUploadResponseDto store(MultipartFile file);
    void validateManagedLogoUrl(String logoUrl);
    boolean delete(String logoUrl);
    List<String> findLogoUrlsModifiedBefore(Instant cutoff);
}
