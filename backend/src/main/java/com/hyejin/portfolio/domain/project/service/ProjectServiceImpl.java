package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.dto.*;
import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import com.hyejin.portfolio.domain.project.entity.ProjectType;
import com.hyejin.portfolio.domain.project.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : ProjectServiceImpl
 * author         : Song
 * date           : 2026-06-25
 * description    : 프로젝트 사용자 조회 Service
 *                  - 사용자 화면에서 필요한 프로젝트 목록/상세 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 * 2026-06-30        Song       목록/ 상세 조회 메서드 생성
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectServiceImpl implements ProjectService{

    // Repository 선언
    private final ProjectRepository projectRepository;
    private final ProjectTechRepository projectTechRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectSectionRepository projectSectionRepository;
    private final ProjectLinkRepository projectLinkRepository;

    // 날짜 타입 지정
    private static final DateTimeFormatter PERIOD_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy.MM");

    // 프로젝트 유형별 공개 프로젝트 목록 조회
    // TEAM : Team Project  |  PERSONAL : More stuff I made
    @Override
    public List<ProjectListResponseDto> getProjects(ProjectType projectType) {
        return projectRepository
                .findByProjectTypeAndPublishedTrueOrderByDisplayOrderAscStartDateDesc(projectType)
                .stream()
                .map(this::toListResponse)
                .toList();
    }

    // [getProjects 헬퍼 메서드] ProjectEntity -> ProjectListResponseDto 형식으로 변환
    private ProjectListResponseDto toListResponse(ProjectEntity project) {
        String thumbnailUrl = projectImageRepository
                .findFirstByProject_ProjectIdAndImageTypeOrderByDisplayOrderAsc(
                        project.getProjectId(),
                        ProjectImageType.THUMBNAIL
                )
                .map(image -> image.getImageUrl())
                .orElse(null);

        return ProjectListResponseDto.from(
                project,
                thumbnailUrl,
                formatPeriodText(project.getStartDate(), project.getEndDate())
        );
    }

    // [toListResponse 헬퍼 메서드]
    private String formatPeriodText(LocalDate startDate, LocalDate endDate) {
        if (startDate == null && endDate == null) {
            return null;
        }

        if (startDate == null) {
            return endDate.format(PERIOD_FORMATTER);
        }

        if (endDate == null) {
            return startDate.format(PERIOD_FORMATTER) + " - 진행 중";
        }

        return startDate.format(PERIOD_FORMATTER) + " - " + endDate.format(PERIOD_FORMATTER);
    }

    // slug 기준 공개 프로젝트 상세 조회
    @Override
    public ProjectDetailResponseDto getProjectDetail(String slug) {
        ProjectEntity project = projectRepository.findBySlugAndPublishedTrue(slug)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "프로젝트를 찾을 수 없습니다."
                ));

        Long projectId = project.getProjectId();

        List<ProjectTechResponseDto> techStacks = projectTechRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectTechResponseDto::from)
                .toList();

        List<ProjectImageResponseDto> images = projectImageRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectImageResponseDto::from)
                .toList();

        List<ProjectSectionResponseDto> sections = projectSectionRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectSectionResponseDto::from)
                .toList();

        List<ProjectLinkResponseDto> links = projectLinkRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectLinkResponseDto::from)
                .toList();


        return ProjectDetailResponseDto.from(
                project,
                formatPeriodText(project.getStartDate(), project.getEndDate()),
                techStacks,
                images,
                sections,
                links
        );
    }
}
