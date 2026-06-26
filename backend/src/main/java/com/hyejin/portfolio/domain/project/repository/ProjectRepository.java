package com.hyejin.portfolio.domain.project.repository;

import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.project.repository
 * fileName       : ProjectRepository
 * author         : Song
 * date           : 2026-06-26
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-26        Song       최초 생성
 */

public interface ProjectRepository extends JpaRepository<ProjectEntity, Long> {

    // 사용자 상세 페이지용 공개 프로젝트 조회
    // : slug와 공개 여부를 기준으로 프로젝트를 조회
    Optional<ProjectEntity> findBySlugAndPublishedTrue(String slug);

    // 관리자용 slug 기준 프로젝트 조회
    // : 공개 여부와 관계 업이 조회
    Optional<ProjectEntity> findBySlug(String slug);

    // work 메인 프로젝트 유형별 공개 프로젝트 목록 조회
    // projectType : TEAM/ PERSONAL
    List<ProjectEntity> findByProjectTypeAndPublishedTrueOrderByDisplayOrderAscStartDateDesc(
            ProjectType projectType
    );

    // 관리자 목록용 전체 프로젝트 조회
    // 최신순으로 조회
    List<ProjectEntity> findAllByOrderByCreatedAtDesc();

    // slug 중복 확인
    // 관리자 프로젝트 등록 시 사용
    boolean existsBySlug(String slug);



}
