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
 *                  - 이미지 URL에 대응하는 실제 파일 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 * 2026-07-29        Song       관리 이미지 URL 검증 및 파일 삭제 기능 추가
 */
public interface ImageStorageService {

    // 이미지 파일 저장
    public ImageUploadResponseDto store(MultipartFile file);

    // 애플리케이션이 관리하는 이미지 URL 및 실제 파일 존재 여부 검증
    public void validateManagedImageUrl(String imageUrl);

    // 이미지 URL에 대응하는 실제 저장 파일 삭제
    public boolean delete(String imageUrl);
}
