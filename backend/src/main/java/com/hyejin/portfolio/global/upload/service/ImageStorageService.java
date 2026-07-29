package com.hyejin.portfolio.global.upload.service;

import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

/**
 * packageName    : com.hyejin.portfolio.global.upload.service
 * fileName       : ImageStorageService
 * author         : Song
 * date           : 2026-07-28
 * description    : 이미지 저장 Service 인터페이스
 *                  - Multipart 이미지 파일 저장
 *                  - 저장 후 접근 가능한 imageUrl 반환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 */
public interface ImageStorageService {

    public ImageUploadResponseDto store(MultipartFile file);
}
