package com.hyejin.portfolio.domain.project.controller;

import com.hyejin.portfolio.domain.project.service.AdminProjectImageCleanupService;
import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import com.hyejin.portfolio.global.upload.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * packageName    : com.hyejin.portfolio.domain.project.controller
 * fileName       : AdminProjectImageController
 * author         : Song
 * date           : 2026-07-28
 * description    : 관리자 프로젝트 이미지 Controller
 *                  - 관리자 프로젝트 이미지 파일 업로드
 *                  - 업로드 후 접근 가능한 imageUrl 반환
 *                  - 프로젝트 미등록 임시 이미지 파일 정리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 * 2026-07-30        Song       프로젝트 도메인으로 이동 및 클래스명 변경
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/project-images")
public class AdminProjectImageController {

    private final ImageStorageService imageStorageService;
    private final AdminProjectImageCleanupService adminProjectImageCleanupService;

    // 관리자 프로젝트 이미지 파일 업로드
    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ImageUploadResponseDto> uploadProjectImage(
            @RequestParam("file") MultipartFile file
    ) {
        ImageUploadResponseDto response =
                imageStorageService.store(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // 프로젝트 DB에서 사용하지 않는 임시 이미지 파일 삭제
    // :@param imageUrl : 이미지 업로드 API가 반환한 관리 이미지 URL
    @DeleteMapping("/temp")
    public ResponseEntity<Void> deleteTemprorayImage (
            @RequestParam("imageUrl") String imageUrl
    ) {
        adminProjectImageCleanupService.deletedTemporaryImage(imageUrl);

        return ResponseEntity
                .noContent()
                .build();
    }
}