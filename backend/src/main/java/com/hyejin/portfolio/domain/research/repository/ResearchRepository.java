package com.hyejin.portfolio.domain.research.repository;

import com.hyejin.portfolio.domain.research.entity.ResearchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.research.repository
 * fileName       : ResearchRepository
 * author         : Song
 * date           : 2026-08-03
 * description    : Research 게시글 데이터 접근 Repository
 *                  - 관리자 Research 전체 목록 조회
 *                  - 사용자 공개 Research 목록 및 상세 조회
 *                  - Research slug 중복 여부 확인
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */

public interface ResearchRepository extends JpaRepository<ResearchEntity, Long> {

    // 관리자 Research 전체 목록 조회
    // 노출 순서 오름차순, 동일 순서일 경우 생성일 최신순
    List<ResearchEntity> findAllByOrderByDisplayOrderAscCreatedAtDesc();

    // Work 페이지 최근 수정 Research 최대 5개 조회
    List<ResearchEntity> findTop5ByPublishedTrueOrderByUpdatedAtDesc();

    // 사용자 공개 Research 목록 조회
    // 공개 상태의 게시글만 노출 순서 오름차순으로 조회
    List<ResearchEntity> findAllByPublishedTrueOrderByDisplayOrderAscCreatedAtDesc();

    // 사용자 공개 Research 상세 조회
    // 비공개 Research는 slug가 일치하더라도 조회하지 않음
    Optional<ResearchEntity> findBySlugAndPublishedTrue(String slug);

    // Research 등록 시 slug 중복 확인
    boolean existsBySlug(String slug);

    // Research 수정 시 현재 게시글을 제외한 slug 중복 확인
    boolean existsBySlugAndResearchIdNot(String slug, Long researchId);
}