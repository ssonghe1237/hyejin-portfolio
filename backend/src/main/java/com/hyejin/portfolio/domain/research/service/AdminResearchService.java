package com.hyejin.portfolio.domain.research.service;

import com.hyejin.portfolio.domain.research.dto.*;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.research.service
 * fileName       : AdminResearchService
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 게시글 관리 Service 인터페이스
 *                  - Research 게시글 등록 기능 정의
 *                  - Research 게시글 수정 기능 정의
 *                  - Research 게시글 공개 상태 변경
 *                  - Research 게시글 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 * 2026-08-03        Song       관리자 목록 및 상세 조회 기능 추가
 * 2026-08-03        Song       관리자 Research 수정 기능 추가
 * 2026-08-03        Song       공개 상태 변경 및 삭제 기능 추가
 */
public interface AdminResearchService {

    // 관리자 Research 전체 목록 조회
    List<AdminResearchListResponseDto> getResearchList();

    // 관리자 Research 상세 조회
    AdminResearchDetailResponseDto getResearchDetail (
      Long researchId
    );

    // 관리자 Research 게시글 등록
    AdminResearchDetailResponseDto createResearch(
            AdminResearchCreateRequestDto request
    );

    // 관리자 Research 게시글 수정
    AdminResearchDetailResponseDto updateResearch(
            Long researchId,
            AdminResearchUpdateRequestDto request
    );

    // 관리자 Research 공개 상태 변경
    AdminResearchDetailResponseDto updateResearchPublication(
            Long researchId,
            AdminResearchPublicationUpdateRequestDto request
    );

    // 관리자 Research 게시글 삭제
    void deleteResearch(
            Long researchId
    );
}