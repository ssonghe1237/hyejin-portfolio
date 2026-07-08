package com.hyejin.portfolio.domain.project.repository;

import com.hyejin.portfolio.domain.project.entity.ProjectImageEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

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
 * 2026-07-02        Song       데이터 컬럼 추가(section id)로 조회 기준 보강
 */
public interface ProjectImageRepository extends JpaRepository<ProjectImageEntity, Long> {

    // 프로젝트 ID & 섹션 미연결 & 이미지 유형 기준 첫 번째 이미지 조회
    // : work 카드 썸네일처럼 대표 이미지 1개만 필요할 때 사용
    Optional<ProjectImageEntity> findFirstByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
            Long projectProjectId,
            ProjectImageType imageType
    );

    // 프로젝트 ID & 섹션 미연결 & 이미지 유형 기준 목록 조회
    // : THUMBNAIL, MAIN처럼 특정 섹션에 속하지 않는 이미지를 조회할 때 사용
    List<ProjectImageEntity> findByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
            Long projectId,
            ProjectImageType imageType
    );

    // 프로젝트 섹션 ID 리스트 조회
    // : OVERVIEW, WORKFLOW 등 특정 섹션에 연결된 이미지를 조회할 때 사용
    List<ProjectImageEntity> findBySection_SectionIdOrderByDisplayOrderAsc(
            Long sectionId
    );

    // ===========================================================
    // 수정용 메서드
    // -----------------------------------------------------------
    Optional<ProjectImageEntity>
    findByProjectImageIdAndProject_ProjectId(
            Long projectImageId,
            Long projectId
    );

    List<ProjectImageEntity>
    findAllByProject_ProjectIdAndProjectImageIdIn(
            Long projectId,
            Collection<Long> projectImageIds
    );

    List<ProjectImageEntity>
    findAllByProject_ProjectIdAndSection_SectionIdIn(
            Long projectId,
            Collection<Long> sectionIds
    );
}
