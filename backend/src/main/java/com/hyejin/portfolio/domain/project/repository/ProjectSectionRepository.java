package com.hyejin.portfolio.domain.project.repository;

import com.hyejin.portfolio.domain.project.entity.ProjectSectionEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.project.repository
 * fileName       : ProjectSectionRepository
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 상세 섹션 Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */
public interface ProjectSectionRepository extends JpaRepository<ProjectSectionEntity, Long> {

    // 프로젝트 id 기준 상세 섹션 리스트 조회
    List<ProjectSectionEntity> findByProject_ProjectIdOrderByDisplayOrderAsc(Long projectProjectId);

    // 프로젝트 id & 프로젝트 유형 기준 섹션 목록 조회
    List<ProjectSectionEntity> findByProject_ProjectIdAndSectionType(
            Long projectProjectId,
            ProjectSectionType sectionType
    );

    // 프로젝트 id와 섹션 유형 기준 첫번째 섹션 조회
    // : WORKFLOW, OVERVIEW처럼 하나만 사용할 가능성이 높은 섹션에 활용
    // 참고) Optional => NullPointException을 방지하기 위해 사용
    Optional<ProjectSectionEntity> findFirstByProject_ProjectIdAndSectionType(
            Long projectProjectId,
            ProjectSectionType sectionType
    );

    // 프로젝트 ID 기준 섹션 전체 삭제
    void deleteByProject_ProjectId(Long projectProjectId);

}
