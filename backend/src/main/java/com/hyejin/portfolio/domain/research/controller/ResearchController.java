package com.hyejin.portfolio.domain.research.controller;

import com.hyejin.portfolio.domain.research.dto.ResearchDetailResponseDto;
import com.hyejin.portfolio.domain.research.dto.ResearchListResponseDto;
import com.hyejin.portfolio.domain.research.service.ResearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.research.controller
 * fileName       : ResearchController
 * author         : Song
 * date           : 2026-08-03
 * description    : 사용자 Research 조회 Controller
 *                  - 공개 Research 게시글 목록 조회 API 제공
 *                  - slug 기준 공개 Research 상세 조회 API 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 * 2026-08-04        Song       최근 수정 Research 5개 조회 API 추가
 */

@RestController
@RequestMapping("/api/research")
@RequiredArgsConstructor
public class ResearchController {

    private final ResearchService researchService;

    // 사용자 공개 Research 목록 조회
    @GetMapping
    public List<ResearchListResponseDto> getResearchList() {
        return researchService.getResearchList();
    }

    // Work 페이지 최근 수정 공개 Research 최대 5개 조회
    @GetMapping("/highlights/recent")
    public List<ResearchListResponseDto> getRecentResearchList(){
        return researchService.getRecentResearchList();
    }

    // 사용자 공개 Research slug 기준 상세 조회
    @GetMapping("/{slug}")
    public ResearchDetailResponseDto getResearchDetail(
            @PathVariable String slug
    ) {
        return researchService.getResearchDetail(
                slug
        );
    }
}