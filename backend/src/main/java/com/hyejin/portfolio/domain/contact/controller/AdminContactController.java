package com.hyejin.portfolio.domain.contact.controller;

import com.hyejin.portfolio.domain.contact.dto.AdminContactDetailResponseDto;
import com.hyejin.portfolio.domain.contact.dto.AdminContactUpsertRequestDto;
import com.hyejin.portfolio.domain.contact.service.AdminContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.controller
 * fileName       : AdminContactController
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 Contact 콘텐츠 Controller
 *                  - 관리자 Contact 상세 조회 API 제공
 *                  - Contact 싱글턴 콘텐츠 생성·수정 API 제공
 *                  - Contact 미등록 초기 상태 204 응답
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@RestController
@RequestMapping("/api/admin/contact")
@RequiredArgsConstructor
public class AdminContactController {

    private final AdminContactService adminContactService;

    // 관리자 Contact 상세 조회
    @GetMapping
    public ResponseEntity<AdminContactDetailResponseDto> getContact() {
        return adminContactService
                .getContact()
                .map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .noContent() // 상태 코드 204 : 오류가 예외 없이 정상 처리로 흘림
                                .build()
                );
    }

    // 관리자 Contact 생성·수정
    @PutMapping
    public AdminContactDetailResponseDto upsertContact(
            @Valid
            @RequestBody
            AdminContactUpsertRequestDto request
    ) {
        return adminContactService.upsertContact(
                request
        );
    }

    // 관리자 이력서 PDF 업로드·교체
    @PostMapping(
            value = "/resume",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public AdminContactDetailResponseDto uploadResume(
            @RequestParam("file")
            MultipartFile file
    ) {
        return adminContactService.uploadResume(
                file
        );
    }

    // 관리자 이력서 PDF 삭제
    @DeleteMapping("/resume")
    public ResponseEntity<Void> deleteResume() {
        adminContactService.deleteResume();

        return ResponseEntity
                .noContent()
                .build();
    }
}