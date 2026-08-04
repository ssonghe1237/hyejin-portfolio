package com.hyejin.portfolio.domain.research.service;

import com.hyejin.portfolio.domain.research.dto.ResearchDetailResponseDto;
import com.hyejin.portfolio.domain.research.dto.ResearchListResponseDto;
import com.hyejin.portfolio.domain.research.entity.ResearchEntity;
import com.hyejin.portfolio.domain.research.repository.ResearchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.research.service
 * fileName       : ResearchServiceImpl
 * author         : Song
 * date           : 2026-08-03
 * description    : 사용자 Research 조회 Service
 *                  - 공개 상태의 Research 목록 조회
 *                  - slug 기준 공개 Research 상세 조회
 *                  - 비공개 게시글의 사용자 접근 차단
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResearchServiceImpl implements ResearchService {

    private final ResearchRepository researchRepository;

    // =====================================================================================
    // 조회
    // =====================================================================================

    // 사용자 공개 Research 목록 조회
    @Override
    public List<ResearchListResponseDto> getResearchList() {
        return researchRepository
                .findAllByPublishedTrueOrderByDisplayOrderAscCreatedAtDesc()
                .stream()
                .map(ResearchListResponseDto::from)
                .toList();
    }

    // Work 페이지 최근 수정 공개 Research 최대 5개 조회
    @Override
    public List<ResearchListResponseDto> getRecentResearchList() {
        return researchRepository
                .findTop5ByPublishedTrueOrderByUpdatedAtDesc()
                .stream()
                .map(ResearchListResponseDto::from)
                .toList();
    }

    // 사용자 공개 Research 상세 조회
    @Override
    public ResearchDetailResponseDto getResearchDetail(
            String slug
    ) {
        ResearchEntity research = researchRepository
                .findBySlugAndPublishedTrue(
                        slug.trim()
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Research 게시글을 찾을 수 없습니다."
                ));

        return ResearchDetailResponseDto.from(
                research
        );
    }
}