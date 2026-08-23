package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

public interface ProfileImageStorageService {
    ImageUploadResponseDto store(MultipartFile file);
    void validateManagedImageUrl(String imageUrl);
    boolean delete(String imageUrl);
    List<String> findImageUrlsModifiedBefore(Instant cutoff);
}
