package com.hyejin.portfolio.global.upload.service;

import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.global.upload.service
 * fileName       : ImageStorageService
 * author         : Song
 * date           : 2026-07-28
 * description    : 이미지 파일 저장소 Service
 *                  - 이미지 파일 저장
 *                  - 관리 이미지 URL 검증
 *                  - 실제 이미지 파일 삭제
 *                  - 기준 시각 이전 이미지 파일 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 * 2026-07-29        Song       관리 이미지 URL 검증 및 파일 삭제 기능 추가
 * 2026-07-30        Song       오래된 이미지 파일 조회 기능 추가
 */
public interface ImageStorageService {

    // 이미지 파일 저장 후 브라우저 접근용 URL 반환
    public ImageUploadResponseDto store(MultipartFile file);

    // 애플리케이션이 관리하는 이미지 URL인지 확인하고, 실제 파일 존재 여부 검증
    public void validateManagedImageUrl(String imageUrl);

    // 이미지 URL에 대응하는 실제 저장 파일 삭제
    public boolean delete(String imageUrl);

    /**
     * 기준 시각보다 마지막 수정 시각이 오래된
     * 관리 이미지 파일의 URL 목록을 조회합니다.
     *
     * DB 참조 여부는 확인하지 않으며,
     * 실제 파일 저장소 탐색만 담당합니다.
     *
     * @param cutoff 기준 시각
     * @return 기준 시각 이전 이미지 URL 목록
     */
    public List<String> findImageUrlsModifiedBefore(
        // Instant = 날짜와 시간 (2026-07-30T13:07:23Z)
        Instant cutoff
    );
}
