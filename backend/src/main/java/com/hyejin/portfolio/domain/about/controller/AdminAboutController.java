package com.hyejin.portfolio.domain.about.controller;

import com.hyejin.portfolio.domain.about.dto.AdminAboutDetailResponseDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutUpsertRequestDto;
import com.hyejin.portfolio.domain.about.service.AdminAboutService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * packageName    : com.hyejin.portfolio.domain.about.controller
 * fileName       : AdminAboutController
 * author         : Song
 * date           : 2026-08-05
 * description    : 관리자 About 콘텐츠 Controller
 *                  - 관리자 About 상세 조회 API 제공
 *                  - About 싱글턴 콘텐츠 생성·수정 API 제공
 *                  - 초기 About 미등록 상태에서 204 응답
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */

@RestController
@RequestMapping("/api/admin/about")
@RequiredArgsConstructor
public class AdminAboutController {

    private final AdminAboutService adminAboutService;

    // 관리자 About 상세 조회
    @GetMapping
    public ResponseEntity<AdminAboutDetailResponseDto> getAbout(){
        // 서비스 계층에서 넘어온 Optional 결과에 따라 Http 상태 코드를 유연하게 분기
        return adminAboutService
                .getAbout()
                .map(ResponseEntity::ok) // 데이터가 존재할 경우 ok(200) + AdminAboutDetailResponseDto
                .orElseGet(() ->         // 데이터가 없을 경우 noContent(204)
                        ResponseEntity
                                .noContent()
                                .build()
                );
    }

    // 관리자 About 생성.수정
    @PutMapping
    public AdminAboutDetailResponseDto upsertAbout (
            @Valid
            @RequestBody
            AdminAboutUpsertRequestDto request
    ) {
        return adminAboutService.upsertAbout(request);
    }

}
