package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.dto.*;
import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;
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
 * 2026-07-02        Song       섹션 별 이미지 목록 조회로 수정
 * 2026-07-27        Song       기술스택 카테고리 및 MY_ROLE 섹션 제목 출력 추가
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
        Long projectId = project.getProjectId();

        String thumbnailUrl = projectImageRepository
                .findFirstByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        projectId,
                        ProjectImageType.THUMBNAIL
                )
                .map(image -> image.getImageUrl())
                .orElse(null);

        List<String> techCategories = getTechCategories(projectId);
        List<String> myRoleTitles = getMyRoleTitles(projectId);

        return ProjectListResponseDto.from(
                project,
                thumbnailUrl,
                formatPeriodText(project.getStartDate(), project.getEndDate()),
                techCategories,
                myRoleTitles
        );
    }

    // [toListResponse 헬퍼 메서드] : 기술 스택 카테고리 목록 생성
    private List<String> getTechCategories(Long projectId) {
        return projectTechRepository.findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(tech -> tech.getTechCategory())
                .filter(category -> category != null && !category.isBlank())
                .distinct()
                .toList();
    }

    // [toListResponse 헬퍼 메서드] : myRole 타이틀 목록 생성
    private List<String> getMyRoleTitles(Long projectId) {
        return projectSectionRepository.findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .filter(section -> section.getSectionType() == ProjectSectionType.MY_ROLE)
                .map(section -> section.getTitle())
                .filter(title -> title != null && !title.isBlank())
                .distinct()
                .toList();
    }

    // [toListResponse 헬퍼 메서드] : 프로젝트 제작 기간 산출
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

        List<ProjectImageResponseDto> heroImages = projectImageRepository
                .findByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        projectId,
                        ProjectImageType.MAIN
                )
                .stream()
                .map(ProjectImageResponseDto::from)
                .toList();

        List<ProjectSectionResponseDto> sections = projectSectionRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(section -> {
                    List<ProjectImageResponseDto> sectionImages = projectImageRepository
                            .findBySection_SectionIdOrderByDisplayOrderAsc(section.getSectionId())
                            .stream()
                            .map(ProjectImageResponseDto::from)
                            .toList();

                    return ProjectSectionResponseDto.from(section, sectionImages);
                })
                .toList();

        List<ProjectLinkResponseDto> links = projectLinkRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectLinkResponseDto::from)
                .toList();


        return ProjectDetailResponseDto.from(
                project,
                formatPeriodText(project.getStartDate(), project.getEndDate()),
                heroImages,
                techStacks,
                sections,
                links
        );
    }
}
