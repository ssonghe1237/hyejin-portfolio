package com.hyejin.portfolio.domain.project.service;


import com.hyejin.portfolio.domain.project.dto.*;
import com.hyejin.portfolio.domain.project.entity.*;
import com.hyejin.portfolio.domain.project.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.apache.logging.log4j.util.Strings.trimToNull;

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
 * 2026-07-07        Song       프로젝트 등록 기능 추가
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

    // 관리자 프로젝트 전체 목록 조회
    @Override
    public List<AdminProjectListResponseDto> getProjectList() {
        return projectRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(AdminProjectListResponseDto::from)
                .toList();
    }

    // 관리자 프로젝트 상세 조회
    @Override
    public AdminProjectDetailResponseDto getProjectDetail(Long projectId) {
        // 프로젝트 1건 조회
        ProjectEntity project = findProject(projectId);

        // 프로젝트 상세 응답 생성
        return buildDetailResponse(project);
    }

    // getProjectDetail 헬퍼 메서드 : 프로젝트 ID 기준 프로젝트 조회
    private ProjectEntity findProject(Long projectId){
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "프로젝트를 찾을 수 없습니다."
                ));
    }

    // getProjectDetail 헬퍼 메서드 : 프로젝트 상세 응답 생성
    // 조회와 등록 응답에서 동일한 상세 구조를 사용하기 위한 공통 메서드
    private AdminProjectDetailResponseDto buildDetailResponse(ProjectEntity project) {
        // 프로젝트id 정규화
        Long ProjectId = project.getProjectId();

        // 프로젝트id 기준 썸네일 조회
        ProjectImageResponseDto thumbnailImage = projectImageRepository
                .findFirstByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        ProjectId,
                        ProjectImageType.THUMBNAIL
                )
                .map(ProjectImageResponseDto::from)
                .orElse(null);

        // 프로젝트id 기준 히어로 이미지 조회
        List<ProjectImageResponseDto> heroImages = projectImageRepository
                .findByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        ProjectId,
                        ProjectImageType.MAIN
                )
                .stream()
                .map(ProjectImageResponseDto::from)
                .toList();

        // 프로젝트id 기준 기술 스택 조회
        List<ProjectTechResponseDto> techStacks = projectTechRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(
                        ProjectId
                )
                .stream()
                .map(ProjectTechResponseDto::from)
                .toList();

        // 프로젝트id 기준 프로젝트 섹션 리스트 조회
        List<ProjectSectionResponseDto> sections = projectSectionRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(ProjectId)
                .stream()
                .map(section -> {
                    List<ProjectImageResponseDto> sectionImages =
                            projectImageRepository
                                    .findBySection_SectionIdOrderByDisplayOrderAsc(
                                            section.getSectionId()
                                    )
                                    .stream()
                                    .map(ProjectImageResponseDto::from)
                                    .toList();

                    return ProjectSectionResponseDto.from(
                            section,
                            sectionImages
                    );
                })
                .toList();

        // 프로젝트id 기준 링크 조회
        List<ProjectLinkResponseDto> links = projectLinkRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(ProjectId)
                .stream()
                .map(ProjectLinkResponseDto::from)
                .toList();

        return AdminProjectDetailResponseDto.from(
                project,
                thumbnailImage,
                heroImages,
                techStacks,
                sections,
                links
        );
    }

    // 관리자 프로젝트 등록
    @Override
    @Transactional(readOnly = false)
    public AdminProjectDetailResponseDto createProject(
            AdminProjectCreateRequestDto request
    ) {
        validateCreateRequest(request);

        ProjectEntity project = projectRepository.save(
                ProjectEntity.builder()
                        .title(request.title().trim())
                        .slug(request.slug().trim())
                        .summary(request.summary().trim())
                        .description(trimToNull(request.description()))
                        .projectType(request.projectType())
                        .startDate(request.startDate())
                        .endDate(request.endDate())
                        .teamName(trimToNull(request.teamName()))
                        .role(trimToNull(request.role()))
                        .displayOrder(request.displayOrder())
                        .published(request.published())
                        .build()
        );

        saveTechStacks(project, request.techStacks());
        saveThumbnailImage(project, request.thumbnailImage());
        saveHeroImages(project, request.heroImages());
        saveSections(project, request.sections());
        saveLinks(project, request.links());

        return buildDetailResponse(project);
    }

    // 기술스택 저장
    private void saveTechStacks(
            ProjectEntity project,
            List<@Valid AdminProjectTechRequestDto> requests
    ) {
        if (requests.isEmpty()) {
            return;
        }

        List<ProjectTechEntity> techStacks = requests.stream()
                .map(request -> ProjectTechEntity.builder()
                        .project(project)
                        .techName(request.techName().trim())
                        .techCategory(trimToNull(request.techCategory()))
                        .displayOrder(request.displayOrder())
                        .build())
                .toList();

        projectTechRepository.saveAll(techStacks);
    }

    // 목록 카드용 썸네일 저장
    private void saveThumbnailImage(
            ProjectEntity project,
            AdminProjectImageRequestDto request
    ) {
        if (request == null) {
            return;
        }

        projectImageRepository.save(
                createImageEntity(project, null, request)
        );
    }

    // 상세 섹션 및 섹션별 이미지 저장
    private void saveSections(
            ProjectEntity project,
            List<AdminProjectSectionRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        for (AdminProjectSectionRequestDto request : requests) {
            ProjectSectionEntity section = projectSectionRepository.save(
                    ProjectSectionEntity.builder()
                            .project(project)
                            .sectionType(request.sectionType())
                            .title(trimToNull(request.title()))
                            .content(trimToNull(request.content()))
                            .displayOrder(request.displayOrder())
                            .build()
            );

            saveSectionImages(
                    project,
                    section,
                    request.images()
            );
        }
    }

    // 히로 이미지 저장
    private void saveHeroImages(
            ProjectEntity project,
            List<AdminProjectImageRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        List<ProjectImageEntity> heroImages = requests.stream()
                .map(request -> createImageEntity(
                        project,
                        null,
                        request
                ))
                .toList();

        projectImageRepository.saveAll(heroImages);
    }

    // 섹션 연결 이미지 저장
    private void saveSectionImages(
            ProjectEntity project,
            ProjectSectionEntity section,
            List<AdminProjectImageRequestDto> requests
    ) {
        if (requests.isEmpty()) {
            return;
        }

        List<ProjectImageEntity> sectionImages = requests.stream()
                .map(request -> createImageEntity(
                        project,
                        section,
                        request
                ))
                .toList();

        projectImageRepository.saveAll(sectionImages);
    }

    // 프로젝트 링크 저장
    private void saveLinks(
            ProjectEntity project,
            List<AdminProjectLinkRequestDto> requests
    ) {
        if (requests.isEmpty()) {
            return;
        }

        List<ProjectLinkEntity> links = requests.stream()
                .map(request -> ProjectLinkEntity.builder()
                        .project(project)
                        .linkType(request.linkType())
                        .linkName(request.linkName().trim())
                        .url(request.url().trim())
                        .displayOrder(request.displayOrder())
                        .build())
                .toList();

        projectLinkRepository.saveAll(links);
    }

    // 이미지 Entity 공통 생성
    private ProjectImageEntity createImageEntity(
            ProjectEntity project,
            ProjectSectionEntity section,
            AdminProjectImageRequestDto request
    ) {
        return ProjectImageEntity.builder()
                .project(project)
                .section(section)
                .imageType(request.imageType())
                .imageUrl(request.imageUrl().trim())
                .caption(trimToNull(request.caption()))
                .displayOrder(request.displayOrder())
                .build();
    }


    // =====================================================================================
    // 검증 메서드
    // -------------------------------------------------------------------------------------
    // createProject 헬퍼 메서드 : 프로젝트 등록 요청 비즈니스 검증
    private void validateCreateRequest(AdminProjectCreateRequestDto request) {

        String slug = request.slug().trim();

        // slug 중복 확인
        if (projectRepository.existsBySlug(slug)){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 사용 중인 프로젝트 slug 입니다."
            );
        }

        // 시작일. 종류일 검증
        if (request.startDate() != null
                && request.endDate() != null
                && request.startDate().isAfter(request.endDate())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "프로젝트 종료일은 시작일보다 빠를 수 없습니다."
            );
        }

        // 썸네일 이미지 유형 검증
        validateThumbnailImage(request.thumbnailImage());

        // 히로 이미지 유형 검증
        validateHeroImages(request.heroImages());

        // 섹션 이미지 유형 검증
        validateSectionImages(request.sections());
    }

    // validateCreateRequest 헬퍼 메서드 : 썸네일 이미지 유형 검증
    private void validateThumbnailImage(
            @Valid AdminProjectImageRequestDto thumnailImages
    ) {
        if (thumnailImages == null) {
            return;
        }

        if (thumnailImages.imageType() != ProjectImageType.THUMBNAIL){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "thumnailImage의 imageType은 THUMBNAIL이어야 합니다."
            );
        }
    }

    // validateCreateRequest 헬퍼 메서드 : 히로 이미지 유형 검증
    private void validateHeroImages(
            List<@Valid AdminProjectImageRequestDto> heroImage
    ) {
        boolean hasInvalidImageType = heroImage.stream()
                .anyMatch(image ->
                        image.imageType() != ProjectImageType.MAIN
                );

        if (hasInvalidImageType) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "heroImages의 imageType은 Main이어야 합니다."
            );
        }
    }

    // 섹션 이미지 유형 검증
    private void validateSectionImages(
            List<@Valid AdminProjectSectionRequestDto> sections
    ) {
        boolean hasInvalidImageType = sections.stream()
                .flatMap(section -> section.images().stream())
                .anyMatch(image ->
                        image.imageType() == ProjectImageType.MAIN
                                || image.imageType() == ProjectImageType.THUMBNAIL
                        );

        if (hasInvalidImageType) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "섹션 이미지에는 THUMNAIL 또는 MAIN 유형을 사용할 수 없습니다."
            );
        }
    }




}
