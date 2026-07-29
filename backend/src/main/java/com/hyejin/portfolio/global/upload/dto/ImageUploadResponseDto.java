package com.hyejin.portfolio.global.upload.dto;

/**
 * packageName    : com.hyejin.portfolio.global.upload.dto
 * fileName       : ImageUploadResponseDto
 * author         : Song
 * date           : 2026-07-28
 * description    : 이미지 업로드 응답 dto
 *                  - 업로드 후 브라우저에서 접근 가능한 imageURL 반환
 *                  - 원본 파일명과 서브 저장 파일명 반환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 */
public record ImageUploadResponseDto(
        String imageUrl,            // 브라우저에 업로드된 이미지에 접근(조회)할 수 있는 경로
        String originalFileName,    // 클라이언트가 업로드한 실제 원본 파일명
        String storedFileName       // 서버에 중복 방지 및 보안을 위해 저장된 파일명
) {

}
