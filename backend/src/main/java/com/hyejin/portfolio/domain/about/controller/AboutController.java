package com.hyejin.portfolio.domain.about.controller;

import com.hyejin.portfolio.domain.about.dto.AboutCompetencyResponseDto;
import com.hyejin.portfolio.domain.about.dto.AboutResponseDto;
import com.hyejin.portfolio.domain.about.service.AboutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.controller
 * fileName       : AboutController
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 About 조회 Controller
 *                  - 공개 About 콘텐츠 조회 API 제공
 *                  - About 기본 정보와 전체 섹션 응답
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/about")
public class AboutController {

    private final AboutService aboutService;

    // 사용자 공개 About 조회
    @GetMapping
    public AboutResponseDto getAbout() {
        return aboutService.getAbout();
    }

    // 사용자 공개 핵심 역량 목록 조회
    @GetMapping("/competencies")
    public List<AboutCompetencyResponseDto> getCompetencies() {
        return aboutService.getCompetencies();
    }
}
