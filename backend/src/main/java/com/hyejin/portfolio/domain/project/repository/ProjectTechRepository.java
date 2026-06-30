package com.hyejin.portfolio.domain.project.repository;

import com.hyejin.portfolio.domain.project.entity.ProjectTechEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.repository
 * fileName       : ProjectTechRepository
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 기술스택 Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */
public interface ProjectTechRepository extends JpaRepository<ProjectTechEntity, Long> {

    // 프로젝트 기술 스택 목록 조회
    List<ProjectTechEntity> findByProject_ProjectIdOrderByDisplayOrderAsc(Long projectId);

    // 프로젝트 ID 기준 기술스택 전체 삭제
    // : 관리자 수정 화면에서 기존 기술스택을 재구성할 때 사용
    void deleteByProject_ProjectId(Long projectId);


}
