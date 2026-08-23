package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : ProfileImageStorageService
 * author         : Song
 * date           : 2026-08-23
 * description    : 프로필 이미지 저장 Service 인터페이스
 *                  - 프로필 이미지 저장 계약 제공
 *                  - 관리 대상 이미지 검증·삭제 및 수정 시각 기준 조회 계약 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-23        Song               최초 생성
 */

public interface ProfileImageStorageService {
    ImageUploadResponseDto store(MultipartFile file);
    void validateManagedImageUrl(String imageUrl);
    boolean delete(String imageUrl);
    List<String> findImageUrlsModifiedBefore(Instant cutoff);
}
