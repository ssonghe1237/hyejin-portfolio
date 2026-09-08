package com.hyejin.portfolio.domain.research.service;

import com.hyejin.portfolio.domain.research.dto.ResearchDetailResponseDto;
import com.hyejin.portfolio.domain.research.dto.ResearchListResponseDto;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.research.service
 * fileName       : ResearchService
 * author         : Song
 * date           : 2026-08-03
 * description    : 사용자 Research 조회 Service 인터페이스
 *                  - 공개 Research 게시글 목록 조회
 *                  - slug 기준 공개 Research 상세 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 * 2026-08-04        Song       최근 수정 Research 5개 조회 기능 추가
 */
public interface ResearchService {

    // 사용자 공개 Research 목록 조회
    List<ResearchListResponseDto> getResearchList();

    // Work 페이지 최근 수정 공개 Research 최대 5개 조회
    List<ResearchListResponseDto> getRecentResearchList();

    // 사용자 공개 Research 상세 조회
    ResearchDetailResponseDto getResearchDetail(
            String slug
    );
}