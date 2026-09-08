package com.hyejin.portfolio.domain.about.controller;

import com.hyejin.portfolio.domain.about.service.SkillLogoStorageService;
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
 * fileName       : AdminAboutSkillLogoController
 * author         : Song
 * date           : 2026-08-23
 * description    : 관리자 About 기술 로고 업로드 Controller
 *                  - 멀티파트 기술 로고 이미지 업로드 요청 처리
 *                  - 기술 로고 저장 Service 호출 및 업로드 결과 반환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-23        Song               최초 생성
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/about/skill-logo")
public class AdminAboutSkillLogoController {
    private final SkillLogoStorageService storageService;
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponseDto> upload(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.status(HttpStatus.CREATED).body(storageService.store(file));
    }
}
