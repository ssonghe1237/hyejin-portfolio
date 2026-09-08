package com.hyejin.portfolio.domain.about.controller;

import com.hyejin.portfolio.domain.about.service.ProfileImageStorageService;
import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * packageName    : com.hyejin.portfolio.domain.about.controller
 * fileName       : AdminAboutProfileImageController
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 프로필 이미지 저장 Controller
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-21        Song               최초 생성
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/about/profile-image")
public class AdminAboutProfileImageController {
    private final ProfileImageStorageService profileImageStorageService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponseDto> upload(
            @RequestParam("file") MultipartFile file
    ) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(profileImageStorageService.store(file));
    }
}
