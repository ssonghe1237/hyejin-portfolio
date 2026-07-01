package com.hyejin.portfolio.domain.project.repository;

import com.hyejin.portfolio.domain.project.entity.ProjectLinkEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectLinkType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.project.repository
 * fileName       : ProjectLinkRepository
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 링크 Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */
public interface ProjectLinkRepository extends JpaRepository<ProjectLinkEntity, Long> {

    // 프로젝트 id 기준 링크 리스트 조회
    List<ProjectLinkEntity> findByProject_ProjectIdOrderByDisplayOrderAsc(Long projectProjectId);

    // 프로젝트 id & 링크 유형 리스트 조회
    List<ProjectLinkEntity> findByProject_ProjectIdAndLinkType(
            Long projectProjectId,
            ProjectLinkType linkType
    );

    // 프로젝트 id & 링크 유형 리스트 조회 중 첫 번째 링크 조회
    // : GitHub, 배포 url 처럼 보통 하나만 필요한 링크를 조회할 때 사용
    Optional<ProjectLinkEntity> findFirstByProject_ProjectIdAndLinkType(
            Long projectProjectId,
            ProjectLinkType linkType
    );

    // 프로젝트 id 기준 링크 전체 삭제
    void deleteByProject_ProjectId(Long projectProjectId);

}
