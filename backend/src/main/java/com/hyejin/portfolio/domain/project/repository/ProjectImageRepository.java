package com.hyejin.portfolio.domain.project.repository;

import com.hyejin.portfolio.domain.project.entity.ProjectImageEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.repository
 * fileName       : ProjectImageRepository
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 이미지 Repository
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */
public interface ProjectImageRepository extends JpaRepository<ProjectImageEntity, Long> {

    // 프로젝트 ID 기준 전체 이미지 목록 조회
    List<ProjectImageEntity> findByProject_ProjectIdOrderByDisplayOrderAsc(Long projectId);

    // 프로젝트 ID & 이미지 유형 기준 첫번째 이미지 조회
    // : work 카드 썸네일처럼 대표 이미지 1개만 필요할 때 사용
    List<ProjectImageEntity> findFirstByProject_ProjectIdAndImageTypeOrderByDisplayOrderAsc(
            Long projectProjectId,
            ProjectImageType imageType
    );

    // 프로젝트 id 기준 이미지 전체 삭제
    // : 관리자 수정 화면에서 기존 이미지를 재구성할 때 사용
    void deleteByProject_ProjectId(Long projectProjectId);

}
