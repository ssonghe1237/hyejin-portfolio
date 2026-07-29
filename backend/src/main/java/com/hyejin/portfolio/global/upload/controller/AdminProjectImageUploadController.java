package com.hyejin.portfolio.global.upload.controller;

import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import com.hyejin.portfolio.global.upload.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

/**
 * packageName    : com.hyejin.portfolio.global.upload.controller
 * fileName       : AdminProjectImageUploadController
 * author         : Song
 * date           : 2026-07-28
 * description    : 관리자 프로젝트 이미지 업로드 Controller
 *                  - 관리자 프로젝트 이미지 파일 업로드
 *                  - 업로드 후 접근 가능한 imageUrl 반환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 */

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/admin/project-images")
public class AdminProjectImageUploadController {

    private final ImageStorageService imageStorageService;

    @PostMapping(
            value = "/upload",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<ImageUploadResponseDto> uploadProjectImage(
            @RequestParam("file")MultipartFile file
    ){
        ImageUploadResponseDto response = imageStorageService.store(file);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }




}
