package com.hyejin.portfolio.domain.project.service;


import com.hyejin.portfolio.domain.project.dto.*;
import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import com.hyejin.portfolio.domain.project.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : AdminProjectServiceImpl
 * author         : Song
 * date           : 2026-07-03
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-03        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProjectServiceImpl implements AdminProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectTechRepository projectTechRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectSectionRepository projectSectionRepository;
    private final ProjectLinkRepository projectLinkRepository;

    // 프로젝트 리스트 전체 조회
    @Override
    public List<AdminProjectListResponseDto> getProjectList() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AdminProjectListResponseDto::from)
                .toList();
    }

    // 프로젝트 ID 기준 프로젝트 상세 정보 조회
    @Override
    public AdminProjectDetailResponseDto getProjectDetail(Long projectId) {
        // slug 기준 프로젝트 상세 조회
        ProjectEntity project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "프로젝트를 찾을 수 없습니다."
                ));

        // 프로젝트 ID & 섹션 미연결 & 이미지 유형 기준 목록 조회
        List<ProjectImageResponseDto> heroImages = projectImageRepository
                .findByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        projectId,
                        ProjectImageType.MAIN
                )
                .stream()
                .map(ProjectImageResponseDto::from)
                .toList();

        // 프로젝트 기술 리스트 조회
        List<ProjectTechResponseDto> techStacks = projectTechRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectTechResponseDto::from)
                .toList();

        // 프로젝트 섹션 리스트 조회 (섹션 정보 + 섹션 이미지)
        List<ProjectSectionResponseDto> sections = projectSectionRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(section -> {
                    List<ProjectImageResponseDto> sectionImages = projectImageRepository
                            .findBySection_SectionIdOrderByDisplayOrderAsc(section.getSectionId())
                            .stream()
                            .map(ProjectImageResponseDto::from)
                            .toList();

                    return ProjectSectionResponseDto.from(section,sectionImages);
                })
                .toList();

        // 프로젝트 id 기준 링크 조회
        List<ProjectLinkResponseDto> links = projectLinkRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectLinkResponseDto::from)
                .toList();

        return AdminProjectDetailResponseDto.from(
                project,
                heroImages,
                techStacks,
                sections,
                links
        );
    }
}
