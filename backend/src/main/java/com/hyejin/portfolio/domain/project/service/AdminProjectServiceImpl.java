package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.dto.*;
import com.hyejin.portfolio.domain.project.entity.*;
import com.hyejin.portfolio.domain.project.event.ProjectImageFilesDeleteEvent;
import com.hyejin.portfolio.domain.project.repository.*;
import com.hyejin.portfolio.global.security.html.RichTextHtmlSanitizer;
import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import com.hyejin.portfolio.global.upload.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;

import static org.apache.logging.log4j.util.Strings.trimToNull;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : AdminProjectServiceImpl
 * author         : Song
 * date           : 2026-07-03
 * description    : 관리자 프로젝트 관리 Service
 *                  - 프로젝트 목록 및 상세 조회
 *                  - 프로젝트 등록
 *                  - 프로젝트 기본 정보 수정
 *                  - 이미지, 섹션, 기술스택, 링크 신규 등록 및 수정
 *                  - 이미지, 섹션, 기술스택, 링크 선택 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-03        Song       최초 생성
 * 2026-07-07        Song       프로젝트 등록 기능 추가
 * 2026-07-08        Song       프로젝트 수정 및 하위 데이터 선택 삭제 기능 추가
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminProjectServiceImpl implements AdminProjectService {

    private static final Set<ProjectSectionType> RICH_TEXT_SECTION_TYPES =
            EnumSet.of(
                    ProjectSectionType.OVERVIEW,
                    ProjectSectionType.KEY_FEATURES,
                    ProjectSectionType.MY_ROLE,
                    ProjectSectionType.ARCHITECTURE,
                    ProjectSectionType.DATABASE_ERD,
                    ProjectSectionType.TROUBLESHOOTING,
                    ProjectSectionType.RESULT
            );

    private final ProjectRepository projectRepository;
    private final ProjectTechRepository projectTechRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectSectionRepository projectSectionRepository;
    private final ProjectLinkRepository projectLinkRepository;
    private final ImageStorageService imageStorageService;
    private final ApplicationEventPublisher eventPublisher;
    private final RichTextHtmlSanitizer richTextHtmlSanitizer;


    // =====================================================================================
    // 조회
    // =====================================================================================

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
    public AdminProjectDetailResponseDto getProjectDetail(
            Long projectId
    ) {
        ProjectEntity project = findProject(projectId);

        return buildDetailResponse(project);
    }

    // =====================================================================================
    // 등록
    // =====================================================================================

    // 관리자 프로젝트 등록
    @Override
    @Transactional
    public AdminProjectDetailResponseDto createProject(
            AdminProjectCreateRequestDto request
    ) {
        validateCreateRequest(request);

        // 프로젝트 핵심 정보 저장
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

        // 프로젝트 기술스택 정보 저장
        saveTechStacks(
                project,
                request.techStacks()
        );

        // 프로젝트 썸네일 이미지 저장
        saveThumbnailImage(
                project,
                request.thumbnailImage()
        );

        // 프로젝트 히어로 이미지 저장
        saveHeroImages(
                project,
                request.heroImages()
        );

        saveSections(
                project,
                request.sections()
        );

        saveLinks(
                project,
                request.links()
        );

        projectRepository.flush();

        return buildDetailResponse(project);
    }

    // =====================================================================================
    // 수정
    // =====================================================================================

    // 관리자 프로젝트 수정
    @Override
    @Transactional
    public AdminProjectDetailResponseDto updateProject(
            Long projectId,
            AdminProjectUpdateRequestDto request
    ) {
        // 프로젝트 존재 여부 확인
        ProjectEntity project = findProject(projectId);

        // 요청 값 자체에 대한 비즈니스 검증
        validateUpdateRequest(
                projectId,
                request
        );

        // 삭제 대상 Entity 조회
        DeleteTargets deleteTargets = loadDeleteTargets(
                projectId,
                request
        );

        /*
         * 섹션 삭제 시 연결된 이미지도 삭제 대상에 자동 포함되므로
         * 확장된 전체 삭제 목록과 수정 목록 사이의 충돌을 확인한다.
         */
        validateDeleteConflicts(
                request,
                deleteTargets
        );

        /*
         * 기존 데이터를 수정하는 요청의 ID와 프로젝트 소속을 검증한다.
         * 삭제 전에 검증하여 잘못된 수정 요청을 먼저 차단한다.
         */
        validateExistingUpdateTargets(
                projectId,
                request
        );

        // 프로젝트 기본 정보 수정
        updateProjectBasicInfo(
                project,
                request
        );

        /*
         * 외래키 관계를 고려한 삭제 순서
         *
         * 1. 이미지 삭제
         * 2. 섹션 삭제
         * 3. 기술스택 삭제
         * 4. 링크 삭제
         */
        deleteSelectedChildren(deleteTargets);

        // 썸네일 수정 또는 신규 등록
        saveOrUpdateThumbnailImage(
                project,
                request.thumbnailImage()
        );

        // Hero 이미지 수정 또는 신규 등록
        saveOrUpdateHeroImages(
                project,
                request.heroImages()
        );

        // 섹션 및 섹션 이미지 수정 또는 신규 등록
        saveOrUpdateSections(
                project,
                request.sections()
        );

        // 기술스택 수정 또는 신규 등록
        saveOrUpdateTechStacks(
                project,
                request.techStacks()
        );

        // 링크 수정 또는 신규 등록
        saveOrUpdateLinks(
                project,
                request.links()
        );

        /*
         * 프로젝트 기본 정보가 이전 값과 동일하고
         * 하위 데이터만 변경된 경우에도 updatedAt이 변경되도록 처리한다.
         */
        project.touch();

        // 모든 변경 사항을 DB에 반영한 뒤 상세 데이터를 다시 조회
        projectRepository.flush();

        return buildDetailResponse(project);
    }

    // 프로젝트 기본 정보 수정
    private void updateProjectBasicInfo(
            ProjectEntity project,
            AdminProjectUpdateRequestDto request
    ) {
        project.updateBasicInfo(
                request.title().trim(),
                request.slug().trim(),
                request.summary().trim(),
                trimToNull(request.description()),
                request.projectType(),
                request.startDate(),
                request.endDate(),
                trimToNull(request.teamName()),
                trimToNull(request.role()),
                request.displayOrder()
        );

        if (Boolean.TRUE.equals(request.published())) {
            project.publish();
        } else {
            project.unpublish();
        }
    }

    // =====================================================================================
    // 프로젝트 공개/ 비공개 처리
    // =====================================================================================
    @Override
    @Transactional
    public AdminProjectDetailResponseDto updateProjectPublication(
            Long projectId,
            AdminProjectPublicationUpdateRequestDto request
    ) {
        ProjectEntity project = findProject(projectId);

        if (request == null || request.published() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "공개 여부 값은 필수입니다."
            );
        }

        if (Boolean.TRUE.equals(request.published())) {
            project.publish();
        } else {
            project.unpublish();
        }

        project.touch();
        projectRepository.flush();

        return buildDetailResponse(project);
    }

    // =====================================================================================
    // 삭제
    // =====================================================================================
    @Override
    @Transactional
    public void deleteProject(Long projectId){
        //) projectId로 프로젝트 1건 조회
        ProjectEntity project = findProject(projectId);

        // 2) 프로젝트 하위 데이터 삭제
        deleteProjectChildren(projectId);

        // 3) 프로젝트 삭제
        projectRepository.delete(project);

        // .flush() : 영속성 컨텍스트의 변경 내용을 즉시 데이터베이스에 반영하라는 명령문
        // 4) 삭제 결과를 즉시 DB에 반영
        projectRepository.flush();

    }

    // deleteProject 헬퍼 메서드: 프로젝트 하위 데이터 전체 삭제
    private void deleteProjectChildren(Long projectId) {
        /* 프로젝트 이미지 DB 데이터를 삭제하기 전에
        * 실제 파일 삭제에 필요한 imageUrl을 수집 */
        List<ProjectImageEntity> images =
                projectImageRepository.findAllByProject_ProjectId(
                        projectId
                );

        List<String> imageUrlsToDelete =
                images.stream()
                        .map(ProjectImageEntity::getImageUrl)
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(imageUrl -> !imageUrl.isEmpty())
                        .distinct()
                        .toList();

        // 삭제 순서 1) 프로젝트에 속한 모든 이미지 삭제
        // 섹션 이미지가 section FK를 참조하므로 섹션보다 먼저 삭제
        if (!images.isEmpty()) {
            projectImageRepository.deleteAll(
                    images
            );
        }

        // 삭제 순서 2) 프로젝트에 속한 모든 섹션 삭제
        List<ProjectSectionEntity> sections =
                projectSectionRepository
                        .findByProject_ProjectIdOrderByDisplayOrderAsc(
                                projectId
                        );

        if (!sections.isEmpty()) {
            projectSectionRepository.deleteAll(
                    sections
            );
        }

        // 삭제 순서 3) 프로젝트 기술스택 삭제
        List<ProjectTechEntity> techStacks =
                projectTechRepository
                        .findByProject_ProjectIdOrderByDisplayOrderAsc(
                                projectId
                        );

        if (!techStacks.isEmpty()) {
            projectTechRepository.deleteAll(
                    techStacks
            );
        }

        // 삭제 순서 4) 프로젝트 링크 삭제
        List<ProjectLinkEntity> links =
                projectLinkRepository
                        .findByProject_ProjectIdOrderByDisplayOrderAsc(
                                projectId
                        );

        if (!links.isEmpty()) {
            projectLinkRepository.deleteAll(
                    links
            );
        }

        /*
         * 프로젝트와 하위 데이터 삭제 트랜잭션이 정상 커밋된 후
         * 수집한 URL에 대응하는 실제 이미지 파일을 삭제한다.
         */
        publishImageFileDeleteEvent(
                imageUrlsToDelete
        );
    }


    // =====================================================================================
    // 공통 조회
    // =====================================================================================

    // 프로젝트 ID 기준 프로젝트 조회
    private ProjectEntity findProject(
            Long projectId
    ) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "프로젝트를 찾을 수 없습니다."
                ));
    }

    // 프로젝트 ID와 이미지 ID 기준 이미지 조회
    private ProjectImageEntity findProjectImage(
            Long projectId,
            Long projectImageId
    ) {
        return projectImageRepository
                .findByProjectImageIdAndProject_ProjectId(
                        projectImageId,
                        projectId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "수정할 프로젝트 이미지를 찾을 수 없습니다."
                ));
    }

    // 프로젝트 ID와 섹션 ID 기준 섹션 조회
    private ProjectSectionEntity findProjectSection(
            Long projectId,
            Long sectionId
    ) {
        return projectSectionRepository
                .findBySectionIdAndProject_ProjectId(
                        sectionId,
                        projectId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "수정할 프로젝트 섹션을 찾을 수 없습니다."
                ));
    }

    // 프로젝트 ID와 기술스택 ID 기준 기술스택 조회
    private ProjectTechEntity findProjectTech(
            Long projectId,
            Long projectTechId
    ) {
        return projectTechRepository
                .findByProjectTechIdAndProject_ProjectId(
                        projectTechId,
                        projectId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "수정할 프로젝트 기술스택을 찾을 수 없습니다."
                ));
    }

    // 프로젝트 ID와 링크 ID 기준 링크 조회
    private ProjectLinkEntity findProjectLink(
            Long projectId,
            Long projectLinkId
    ) {
        return projectLinkRepository
                .findByProjectLinkIdAndProject_ProjectId(
                        projectLinkId,
                        projectId
                )
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "수정할 프로젝트 링크를 찾을 수 없습니다."
                ));
    }

    // =====================================================================================
    // 상세 응답 생성
    // =====================================================================================

    private AdminProjectDetailResponseDto buildDetailResponse(
            ProjectEntity project
    ) {
        Long projectId = project.getProjectId();

        // 썸네일 조회
        ProjectImageResponseDto thumbnailImage = projectImageRepository
                .findFirstByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        projectId,
                        ProjectImageType.THUMBNAIL
                )
                .map(ProjectImageResponseDto::from)
                .orElse(null);

        // Hero 이미지 조회
        List<ProjectImageResponseDto> heroImages = projectImageRepository
                .findByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                        projectId,
                        ProjectImageType.MAIN
                )
                .stream()
                .map(ProjectImageResponseDto::from)
                .toList();

        // 기술스택 조회
        List<ProjectTechResponseDto> techStacks = projectTechRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
                .stream()
                .map(ProjectTechResponseDto::from)
                .toList();

        // 섹션 및 섹션 이미지 조회
        List<ProjectSectionResponseDto> sections = projectSectionRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
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

        // 링크 조회
        List<ProjectLinkResponseDto> links = projectLinkRepository
                .findByProject_ProjectIdOrderByDisplayOrderAsc(projectId)
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

    // =====================================================================================
    // 등록용 저장
    // =====================================================================================

    // 기술스택 저장
    private void saveTechStacks(
            ProjectEntity project,
            List<AdminProjectTechRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
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

    // 썸네일 저장
    private void saveThumbnailImage(
            ProjectEntity project,
            AdminProjectImageRequestDto request
    ) {
        if (request == null) {
            return;
        }

        projectImageRepository.save(
                createImageEntity(
                        project,
                        null,
                        request
                )
        );
    }

    // Hero 이미지 저장
    private void saveHeroImages(
            ProjectEntity project,
            List<AdminProjectImageRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        List<ProjectImageEntity> images = requests.stream()
                .map(request -> createImageEntity(
                        project,
                        null,
                        request
                ))
                .toList();

        projectImageRepository.saveAll(images);
    }

    // 섹션 및 섹션 이미지 저장
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
                            .content(normalizeProjectSectionContent(
                                    request.sectionType(),
                                    request.content()
                            ))
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

    // 섹션 이미지 저장
    private void saveSectionImages(
            ProjectEntity project,
            ProjectSectionEntity section,
            List<AdminProjectImageRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        List<ProjectImageEntity> images = requests.stream()
                .map(request -> createImageEntity(
                        project,
                        section,
                        request
                ))
                .toList();

        projectImageRepository.saveAll(images);
    }

    // 링크 저장
    private void saveLinks(
            ProjectEntity project,
            List<AdminProjectLinkRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
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

    // =====================================================================================
    // 수정용 선택 삭제 대상 조회
    // =====================================================================================

    private DeleteTargets loadDeleteTargets(
            Long projectId,
            AdminProjectUpdateRequestDto request
    ) {
        List<ProjectSectionEntity> sections = loadSectionsToDelete(
                projectId,
                request.deletedSectionIds()
        );

        List<ProjectImageEntity> directlySelectedImages = loadImagesToDelete(
                projectId,
                request.deletedImageIds()
        );

        /*
         * 삭제할 섹션에 연결된 이미지는 프론트에서 별도로 전달하지 않아도
         * 서버가 자동으로 삭제 대상에 포함한다.
         */
        List<ProjectImageEntity> sectionImages =
                loadSectionImagesToDelete(
                        projectId,
                        sections
                );

        /*
         * 직접 선택한 이미지와 섹션 삭제로 인해 함께 삭제되는 이미지가
         * 중복될 수 있으므로 이미지 ID를 기준으로 합친다.
         */
        Map<Long, ProjectImageEntity> imageMap =
                new LinkedHashMap<>();

        directlySelectedImages.forEach(image ->
                imageMap.put(
                        image.getProjectImageId(),
                        image
                )
        );

        sectionImages.forEach(image ->
                imageMap.put(
                        image.getProjectImageId(),
                        image
                )
        );

        List<ProjectTechEntity> techStacks = loadTechStacksToDelete(
                projectId,
                request.deletedTechIds()
        );

        List<ProjectLinkEntity> links = loadLinksToDelete(
                projectId,
                request.deletedLinkIds()
        );

        return new DeleteTargets(
                List.copyOf(imageMap.values()),
                sections,
                techStacks,
                links
        );
    }

    // 선택 삭제할 이미지 조회
    private List<ProjectImageEntity> loadImagesToDelete(
            Long projectId,
            List<Long> deletedImageIds
    ) {
        // 중복 아이디 삭제
        List<Long> imageIds = distinctIds(deletedImageIds);

        if (imageIds.isEmpty()) {
            return List.of();
        }

        //
        List<ProjectImageEntity> images =
                projectImageRepository
                        .findAllByProject_ProjectIdAndProjectImageIdIn(
                                projectId,
                                imageIds
                        );

        if (images.size() != imageIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "삭제할 이미지 중 존재하지 않거나 현재 프로젝트에 속하지 않은 이미지가 있습니다."
            );
        }

        return images;
    }

    // 선택 삭제할 섹션 조회
    private List<ProjectSectionEntity> loadSectionsToDelete(
            Long projectId,
            List<Long> deletedSectionIds
    ) {
        List<Long> sectionIds = distinctIds(deletedSectionIds);

        if (sectionIds.isEmpty()) {
            return List.of();
        }

        List<ProjectSectionEntity> sections =
                projectSectionRepository
                        .findAllByProject_ProjectIdAndSectionIdIn(
                                projectId,
                                sectionIds
                        );

        if (sections.size() != sectionIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "삭제할 섹션 중 존재하지 않거나 현재 프로젝트에 속하지 않은 섹션이 있습니다."
            );
        }

        return sections;
    }

    // 삭제할 섹션에 연결된 이미지 조회
    private List<ProjectImageEntity> loadSectionImagesToDelete(
            Long projectId,
            List<ProjectSectionEntity> sections
    ) {
        if (sections.isEmpty()) {
            return List.of();
        }

        List<Long> sectionIds = sections.stream()
                .map(ProjectSectionEntity::getSectionId)
                .toList();

        return projectImageRepository
                .findAllByProject_ProjectIdAndSection_SectionIdIn(
                        projectId,
                        sectionIds
                );
    }

    // 선택 삭제할 기술스택 조회
    private List<ProjectTechEntity> loadTechStacksToDelete(
            Long projectId,
            List<Long> deletedTechIds
    ) {
        List<Long> techIds = distinctIds(deletedTechIds);

        if (techIds.isEmpty()) {
            return List.of();
        }

        List<ProjectTechEntity> techStacks =
                projectTechRepository
                        .findAllByProject_ProjectIdAndProjectTechIdIn(
                                projectId,
                                techIds
                        );

        if (techStacks.size() != techIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "삭제할 기술스택 중 존재하지 않거나 현재 프로젝트에 속하지 않은 항목이 있습니다."
            );
        }

        return techStacks;
    }

    // 선택 삭제할 링크 조회
    private List<ProjectLinkEntity> loadLinksToDelete(
            Long projectId,
            List<Long> deletedLinkIds
    ) {
        List<Long> linkIds = distinctIds(deletedLinkIds);

        if (linkIds.isEmpty()) {
            return List.of();
        }

        List<ProjectLinkEntity> links =
                projectLinkRepository
                        .findAllByProject_ProjectIdAndProjectLinkIdIn(
                                projectId,
                                linkIds
                        );

        if (links.size() != linkIds.size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "삭제할 링크 중 존재하지 않거나 현재 프로젝트에 속하지 않은 링크가 있습니다."
            );
        }

        return links;
    }

    // 삭제 ID 중복 제거
    private List<Long> distinctIds(
            List<Long> ids
    ) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        return ids.stream()
                .filter(Objects::nonNull)
                .distinct()
                .toList();
    }

    // =====================================================================================
    // 수정용 선택 삭제
    // =====================================================================================

    private void deleteSelectedChildren(
            DeleteTargets deleteTargets
    ) {
        /* DB에서 먼저 이미지 Entity를 삭제하면 imageUrl을 다시 조회할 수 없으므로
        *   삭제 전에 실제 파일 삭제에 필요한 URL을 수집
        *   - 실제 deletedImageId로 직접 선택한 이미지
        *   - 삭제 대상 섹션에 연결되어져 있는 이미지 */
        List<String> iamgeUrlsToDelete =
                deleteTargets.images()
                        .stream()
                        .map(ProjectImageEntity :: getImageUrl)
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(imageUrl -> !imageUrl.isEmpty())
                        .distinct()
                        .toList();

        // 섹션 FK를 참조하는 이미지가 있으므로 이미지 먼저 삭제
        if (!deleteTargets.images().isEmpty()) {
            projectImageRepository.deleteAll(
                    deleteTargets.images()
            );
        }

        if (!deleteTargets.sections().isEmpty()) {
            projectSectionRepository.deleteAll(
                    deleteTargets.sections()
            );
        }

        if (!deleteTargets.techStacks().isEmpty()) {
            projectTechRepository.deleteAll(
                    deleteTargets.techStacks()
            );
        }

        if (!deleteTargets.links().isEmpty()) {
            projectLinkRepository.deleteAll(
                    deleteTargets.links()
            );
        }

        /* 이벤트는 현재 트랜젝션 안에서 발행하지만
        * 실제 파일 삭제 Listener는 AFTER_COMMIT 시점에 실행 */
        publishImageFileDeleteEvent(
                iamgeUrlsToDelete
        );
    }

    // =====================================================================================
    // 수정용 이미지 처리
    // =====================================================================================

    // 썸네일 수정 또는 신규 등록
    private void saveOrUpdateThumbnailImage(
            ProjectEntity project,
            AdminProjectImageUpdateRequestDto request
    ) {
        if (request == null) {
            return;
        }

        saveOrUpdateImage(
                project,
                null,
                request
        );
    }

    // Hero 이미지 수정 또는 신규 등록
    private void saveOrUpdateHeroImages(
            ProjectEntity project,
            List<AdminProjectImageUpdateRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        for (AdminProjectImageUpdateRequestDto request : requests) {
            saveOrUpdateImage(
                    project,
                    null,
                    request
            );
        }
    }

    // 섹션 이미지 수정 또는 신규 등록
    private void saveOrUpdateSectionImages(
            ProjectEntity project,
            ProjectSectionEntity section,
            List<AdminProjectImageUpdateRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        for (AdminProjectImageUpdateRequestDto request : requests) {
            saveOrUpdateImage(
                    project,
                    section,
                    request
            );
        }
    }

    // 이미지 수정 또는 신규 등록
    private void saveOrUpdateImage(
            ProjectEntity project,
            ProjectSectionEntity section,
            AdminProjectImageUpdateRequestDto request
    ) {
        // 이미지 ID가 없으면 신규 등록
        if (request.projectImageId() == null) {
            projectImageRepository.save(
                    createImageEntity(
                            project,
                            section,
                            request
                    )
            );

            return;
        }

        // 이미지 ID가 있으면 기존 데이터 수정
        ProjectImageEntity image = findProjectImage(
                project.getProjectId(),
                request.projectImageId()
        );

        validateImageType(
                image,
                request
        );

        validateImageSection(
                image,
                section
        );

        String previousImageUrl = image.getImageUrl();
        String nextImageUrl = request.imageUrl().trim();

        imageStorageService.validateManagedImageUrl(nextImageUrl);

        image.updateImageInfo(
                nextImageUrl,
                trimToNull(request.caption()),
                request.displayOrder()
        );

        if (!Objects.equals(
                previousImageUrl,
                nextImageUrl
        )) {
            publishImageFileDeleteEvent(
                    previousImageUrl == null
                    ? List.of()
                            : List.of(previousImageUrl)
            );
        }
    }

    // 수정용 이미지 Entity 생성
    private ProjectImageEntity createImageEntity(
            ProjectEntity project,
            ProjectSectionEntity section,
            AdminProjectImageUpdateRequestDto request
    ) {
        String imageUrl = request.imageUrl();

        imageStorageService.validateManagedImageUrl(imageUrl);

        return ProjectImageEntity.builder()
                .project(project)
                .section(section)
                .imageType(request.imageType())
                .imageUrl(request.imageUrl().trim())
                .caption(trimToNull(request.caption()))
                .displayOrder(request.displayOrder())
                .build();
    }

    // 기존 이미지의 이미지 유형 변경 방지
    private void validateImageType(
            ProjectImageEntity image,
            AdminProjectImageUpdateRequestDto request
    ) {
        if (image.getImageType() != request.imageType()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "기존 이미지의 imageType은 변경할 수 없습니다."
            );
        }
    }

    // 기존 이미지의 소속 영역 또는 섹션 변경 방지
    private void validateImageSection(
            ProjectImageEntity image,
            ProjectSectionEntity requestedSection
    ) {
        ProjectSectionEntity currentSection = image.getSection();

        // 썸네일 또는 Hero 이미지 요청
        if (requestedSection == null) {
            if (currentSection != null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "섹션 이미지를 썸네일 또는 Hero 이미지로 변경할 수 없습니다."
                );
            }

            return;
        }

        // 프로젝트 대표 이미지를 섹션 이미지로 변경하는 요청
        if (currentSection == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "썸네일 또는 Hero 이미지를 섹션 이미지로 변경할 수 없습니다."
            );
        }

        // 다른 섹션으로 이미지를 이동하는 요청
        if (!currentSection.getSectionId()
                .equals(requestedSection.getSectionId())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지가 요청한 프로젝트 섹션에 속하지 않습니다."
            );
        }
    }

    // 삭제할 실제 이미지 파일 정보를 이벤트로 발행
    private void publishImageFileDeleteEvent(
            Collection<String> imageUrls
    ) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return;
        }

        List<String> deleteTargets =
                imageUrls.stream()
                        .filter(Objects::nonNull)
                        .map(String::trim)
                        .filter(imageUrl ->
                                !imageUrl.isEmpty()
                        )
                        .distinct()
                        .toList();

        if (deleteTargets.isEmpty()) {
            return;
        }

        eventPublisher.publishEvent(
                new ProjectImageFilesDeleteEvent(
                        deleteTargets
                )
        );
    }

    // =====================================================================================
    // 수정용 섹션 처리
    // =====================================================================================

    private void saveOrUpdateSections(
            ProjectEntity project,
            List<AdminProjectSectionUpdateRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        for (AdminProjectSectionUpdateRequestDto request : requests) {

            ProjectSectionEntity section;

            // 섹션 ID가 없으면 신규 등록
            if (request.sectionId() == null) {
                section = projectSectionRepository.save(
                        ProjectSectionEntity.builder()
                                .project(project)
                                .sectionType(request.sectionType())
                                .title(trimToNull(request.title()))
                                .content(normalizeProjectSectionContent(
                                        request.sectionType(),
                                        request.content()
                                ))
                                .displayOrder(request.displayOrder())
                                .build()
                );

            } else {
                // 섹션 ID가 있으면 기존 데이터 수정
                section = findProjectSection(
                        project.getProjectId(),
                        request.sectionId()
                );

                section.updateSectionInfo(
                        request.sectionType(),
                        trimToNull(request.title()),
                        normalizeProjectSectionContent(
                                request.sectionType(),
                                request.content()
                        ),
                        request.displayOrder()
                );
            }

            saveOrUpdateSectionImages(
                    project,
                    section,
                    request.images()
            );
        }
    }

    // =====================================================================================
    // 수정용 기술스택 처리
    // =====================================================================================

    private void saveOrUpdateTechStacks(
            ProjectEntity project,
            List<AdminProjectTechUpdateRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        for (AdminProjectTechUpdateRequestDto request : requests) {

            // 기술스택 ID가 없으면 신규 등록
            if (request.projectTechId() == null) {
                projectTechRepository.save(
                        ProjectTechEntity.builder()
                                .project(project)
                                .techName(request.techName().trim())
                                .techCategory(trimToNull(request.techCategory()))
                                .displayOrder(request.displayOrder())
                                .build()
                );

                continue;
            }

            // 기술스택 ID가 있으면 기존 데이터 수정
            ProjectTechEntity tech = findProjectTech(
                    project.getProjectId(),
                    request.projectTechId()
            );

            tech.updateTechInfo(
                    request.techName().trim(),
                    trimToNull(request.techCategory()),
                    request.displayOrder()
            );
        }
    }

    // =====================================================================================
    // 수정용 링크 처리
    // =====================================================================================

    private void saveOrUpdateLinks(
            ProjectEntity project,
            List<AdminProjectLinkUpdateRequestDto> requests
    ) {
        if (requests == null || requests.isEmpty()) {
            return;
        }

        for (AdminProjectLinkUpdateRequestDto request : requests) {

            // 링크 ID가 없으면 신규 등록
            if (request.projectLinkId() == null) {
                projectLinkRepository.save(
                        ProjectLinkEntity.builder()
                                .project(project)
                                .linkType(request.linkType())
                                .linkName(request.linkName().trim())
                                .url(request.url().trim())
                                .displayOrder(request.displayOrder())
                                .build()
                );

                continue;
            }

            // 링크 ID가 있으면 기존 데이터 수정
            ProjectLinkEntity link = findProjectLink(
                    project.getProjectId(),
                    request.projectLinkId()
            );

            link.updateLinkInfo(
                    request.linkType(),
                    request.linkName().trim(),
                    request.url().trim(),
                    request.displayOrder()
            );
        }
    }

    /**
     * Sanitizes only section types whose content contract is Rich Text HTML.
     * WORKFLOW and other structured/plain-text sections retain their existing
     * source format and continue through the previous trim-to-null policy.
     */
    private String normalizeProjectSectionContent(
            ProjectSectionType sectionType,
            String content
    ) {
        String normalizedContent = trimToNull(content);

        if (normalizedContent == null
                || !RICH_TEXT_SECTION_TYPES.contains(sectionType)) {
            return normalizedContent;
        }

        String sanitizedContent =
                richTextHtmlSanitizer.sanitize(normalizedContent);

        return richTextHtmlSanitizer.hasVisibleContent(sanitizedContent)
                ? sanitizedContent
                : null;
    }

    // =====================================================================================
    // 등록 요청 검증
    // =====================================================================================

    private void validateCreateRequest(
            AdminProjectCreateRequestDto request
    ) {
        String slug = request.slug().trim();

        if (projectRepository.existsBySlug(slug)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 사용 중인 프로젝트 slug입니다."
            );
        }

        validateProjectPeriod(
                request.startDate(),
                request.endDate()
        );

        validateCreateThumbnailImage(
                request.thumbnailImage()
        );

        validateCreateHeroImages(
                request.heroImages()
        );

        validateCreateSectionImages(
                request.sections()
        );
    }

    // 등록 요청 썸네일 유형 검증
    private void validateCreateThumbnailImage(
            AdminProjectImageRequestDto thumbnailImage
    ) {
        if (thumbnailImage == null) {
            return;
        }

        if (thumbnailImage.imageType() != ProjectImageType.THUMBNAIL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "thumbnailImage의 imageType은 THUMBNAIL이어야 합니다."
            );
        }
    }

    // 등록 요청 Hero 이미지 유형 검증
    private void validateCreateHeroImages(
            List<AdminProjectImageRequestDto> heroImages
    ) {
        boolean hasInvalidImageType = heroImages.stream()
                .anyMatch(image ->
                        image.imageType() != ProjectImageType.MAIN
                );

        if (hasInvalidImageType) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "heroImages의 imageType은 MAIN이어야 합니다."
            );
        }
    }

    // 등록 요청 섹션 이미지 유형 검증
    private void validateCreateSectionImages(
            List<AdminProjectSectionRequestDto> sections
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
                    "섹션 이미지에는 THUMBNAIL 또는 MAIN 유형을 사용할 수 없습니다."
            );
        }
    }

    // =====================================================================================
    // 수정 요청 검증
    // =====================================================================================

    private void validateUpdateRequest(
            Long projectId,
            AdminProjectUpdateRequestDto request
    ) {
        String slug = request.slug().trim();

        // 현재 프로젝트를 제외한 slug 중복 검사
        if (projectRepository.existsBySlugAndProjectIdNot(
                slug,
                projectId
        )) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "이미 사용 중인 프로젝트 slug입니다."
            );
        }

        validateProjectPeriod(
                request.startDate(),
                request.endDate()
        );

        validateUpdateThumbnailImage(
                request.thumbnailImage()
        );

        validateUpdateHeroImages(
                request.heroImages()
        );

        validateUpdateSectionImages(
                request.sections()
        );

        // 수정 대상 ID 중복 검사
        validateDuplicateUpdateIds(request);

        // 신규 썸네일 추가 시 기존 썸네일 처리 여부 확인
        validateNewThumbnail(
                projectId,
                request
        );
    }

    // 수정 요청 썸네일 유형 검증
    private void validateUpdateThumbnailImage(
            AdminProjectImageUpdateRequestDto thumbnailImage
    ) {
        if (thumbnailImage == null) {
            return;
        }

        if (thumbnailImage.imageType() != ProjectImageType.THUMBNAIL) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "thumbnailImage의 imageType은 THUMBNAIL이어야 합니다."
            );
        }
    }

    // 수정 요청 Hero 이미지 유형 검증
    private void validateUpdateHeroImages(
            List<AdminProjectImageUpdateRequestDto> heroImages
    ) {
        boolean hasInvalidImageType = heroImages.stream()
                .anyMatch(image ->
                        image.imageType() != ProjectImageType.MAIN
                );

        if (hasInvalidImageType) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "heroImages의 imageType은 MAIN이어야 합니다."
            );
        }
    }

    // 수정 요청 섹션 이미지 유형 검증
    private void validateUpdateSectionImages(
            List<AdminProjectSectionUpdateRequestDto> sections
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
                    "섹션 이미지에는 THUMBNAIL 또는 MAIN 유형을 사용할 수 없습니다."
            );
        }
    }

    // 수정 대상 ID 중복 검사
    private void validateDuplicateUpdateIds(
            AdminProjectUpdateRequestDto request
    ) {
        validateDuplicateIds(
                collectUpdateImageIds(request),
                "동일한 프로젝트 이미지 ID가 수정 요청에 중복되었습니다."
        );

        validateDuplicateIds(
                request.sections().stream()
                        .map(AdminProjectSectionUpdateRequestDto::sectionId)
                        .filter(Objects::nonNull)
                        .toList(),
                "동일한 프로젝트 섹션 ID가 수정 요청에 중복되었습니다."
        );

        validateDuplicateIds(
                request.techStacks().stream()
                        .map(AdminProjectTechUpdateRequestDto::projectTechId)
                        .filter(Objects::nonNull)
                        .toList(),
                "동일한 프로젝트 기술스택 ID가 수정 요청에 중복되었습니다."
        );

        validateDuplicateIds(
                request.links().stream()
                        .map(AdminProjectLinkUpdateRequestDto::projectLinkId)
                        .filter(Objects::nonNull)
                        .toList(),
                "동일한 프로젝트 링크 ID가 수정 요청에 중복되었습니다."
        );
    }

    private void validateDuplicateIds(
            List<Long> ids,
            String message
    ) {
        if (ids.size() != new HashSet<>(ids).size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    message
            );
        }
    }

    // 수정 요청의 기존 이미지 ID 수집
    private List<Long> collectUpdateImageIds(
            AdminProjectUpdateRequestDto request
    ) {
        List<Long> imageIds = new ArrayList<>();

        if (request.thumbnailImage() != null
                && request.thumbnailImage().projectImageId() != null) {

            imageIds.add(
                    request.thumbnailImage().projectImageId()
            );
        }

        request.heroImages().stream()
                .map(AdminProjectImageUpdateRequestDto::projectImageId)
                .filter(Objects::nonNull)
                .forEach(imageIds::add);

        request.sections().stream()
                .flatMap(section -> section.images().stream())
                .map(AdminProjectImageUpdateRequestDto::projectImageId)
                .filter(Objects::nonNull)
                .forEach(imageIds::add);

        return imageIds;
    }

    // 기존 수정 대상의 프로젝트 소유권 및 관계 검증
    private void validateExistingUpdateTargets(
            Long projectId,
            AdminProjectUpdateRequestDto request
    ) {
        // 썸네일 검증
        validateExistingImageRequest(
                projectId,
                null,
                request.thumbnailImage()
        );

        // Hero 이미지 검증
        for (AdminProjectImageUpdateRequestDto imageRequest
                : request.heroImages()) {

            validateExistingImageRequest(
                    projectId,
                    null,
                    imageRequest
            );
        }

        // 섹션 및 섹션 이미지 검증
        for (AdminProjectSectionUpdateRequestDto sectionRequest
                : request.sections()) {

            ProjectSectionEntity section = null;

            if (sectionRequest.sectionId() != null) {
                section = findProjectSection(
                        projectId,
                        sectionRequest.sectionId()
                );
            }

            for (AdminProjectImageUpdateRequestDto imageRequest
                    : sectionRequest.images()) {

                /*
                 * 신규 섹션은 아직 sectionId가 없으므로
                 * 기존 이미지의 소속 섹션으로 사용할 수 없다.
                 */
                if (section == null
                        && imageRequest.projectImageId() != null) {

                    throw new ResponseStatusException(
                            HttpStatus.BAD_REQUEST,
                            "신규 섹션에는 기존 이미지 ID를 연결할 수 없습니다."
                    );
                }

                validateExistingImageRequest(
                        projectId,
                        section,
                        imageRequest
                );
            }
        }

        // 기술스택 검증
        request.techStacks().stream()
                .map(AdminProjectTechUpdateRequestDto::projectTechId)
                .filter(Objects::nonNull)
                .forEach(projectTechId ->
                        findProjectTech(
                                projectId,
                                projectTechId
                        )
                );

        // 링크 검증
        request.links().stream()
                .map(AdminProjectLinkUpdateRequestDto::projectLinkId)
                .filter(Objects::nonNull)
                .forEach(projectLinkId ->
                        findProjectLink(
                                projectId,
                                projectLinkId
                        )
                );
    }

    private void validateExistingImageRequest(
            Long projectId,
            ProjectSectionEntity section,
            AdminProjectImageUpdateRequestDto request
    ) {
        if (request == null
                || request.projectImageId() == null) {
            return;
        }

        ProjectImageEntity image = findProjectImage(
                projectId,
                request.projectImageId()
        );

        validateImageType(
                image,
                request
        );

        validateImageSection(
                image,
                section
        );
    }

    // 삭제 대상과 수정 대상의 충돌 검증
    private void validateDeleteConflicts(
            AdminProjectUpdateRequestDto request,
            DeleteTargets deleteTargets
    ) {
        Set<Long> deletedImageIds = deleteTargets.images()
                .stream()
                .map(ProjectImageEntity::getProjectImageId)
                .collect(HashSet::new, Set::add, Set::addAll);

        Set<Long> deletedSectionIds = deleteTargets.sections()
                .stream()
                .map(ProjectSectionEntity::getSectionId)
                .collect(HashSet::new, Set::add, Set::addAll);

        Set<Long> deletedTechIds = deleteTargets.techStacks()
                .stream()
                .map(ProjectTechEntity::getProjectTechId)
                .collect(HashSet::new, Set::add, Set::addAll);

        Set<Long> deletedLinkIds = deleteTargets.links()
                .stream()
                .map(ProjectLinkEntity::getProjectLinkId)
                .collect(HashSet::new, Set::add, Set::addAll);

        boolean imageConflict = collectUpdateImageIds(request)
                .stream()
                .anyMatch(deletedImageIds::contains);

        if (imageConflict) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "동일한 이미지를 수정 대상과 삭제 대상에 함께 지정할 수 없습니다."
            );
        }

        boolean sectionConflict = request.sections()
                .stream()
                .map(AdminProjectSectionUpdateRequestDto::sectionId)
                .filter(Objects::nonNull)
                .anyMatch(deletedSectionIds::contains);

        if (sectionConflict) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "동일한 섹션을 수정 대상과 삭제 대상에 함께 지정할 수 없습니다."
            );
        }

        boolean techConflict = request.techStacks()
                .stream()
                .map(AdminProjectTechUpdateRequestDto::projectTechId)
                .filter(Objects::nonNull)
                .anyMatch(deletedTechIds::contains);

        if (techConflict) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "동일한 기술스택을 수정 대상과 삭제 대상에 함께 지정할 수 없습니다."
            );
        }

        boolean linkConflict = request.links()
                .stream()
                .map(AdminProjectLinkUpdateRequestDto::projectLinkId)
                .filter(Objects::nonNull)
                .anyMatch(deletedLinkIds::contains);

        if (linkConflict) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "동일한 링크를 수정 대상과 삭제 대상에 함께 지정할 수 없습니다."
            );
        }
    }

    // 신규 썸네일 등록 시 기존 썸네일 중복 방지
    private void validateNewThumbnail(
            Long projectId,
            AdminProjectUpdateRequestDto request
    ) {
        AdminProjectImageUpdateRequestDto thumbnailImage =
                request.thumbnailImage();

        // 썸네일 요청이 없거나 기존 썸네일 수정 요청인 경우
        if (thumbnailImage == null
                || thumbnailImage.projectImageId() != null) {
            return;
        }

        ProjectImageEntity currentThumbnail =
                projectImageRepository
                        .findFirstByProject_ProjectIdAndSectionIsNullAndImageTypeOrderByDisplayOrderAsc(
                                projectId,
                                ProjectImageType.THUMBNAIL
                        )
                        .orElse(null);

        // 기존 썸네일이 없으면 신규 등록 가능
        if (currentThumbnail == null) {
            return;
        }

        boolean deletesCurrentThumbnail =
                request.deletedImageIds().contains(
                        currentThumbnail.getProjectImageId()
                );

        if (!deletesCurrentThumbnail) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "새 썸네일을 등록하려면 기존 썸네일을 수정하거나 삭제 대상으로 지정해야 합니다."
            );
        }
    }

    // =====================================================================================
    // 공통 검증
    // =====================================================================================

    private void validateProjectPeriod(
            LocalDate startDate,
            LocalDate endDate
    ) {
        if (startDate != null
                && endDate != null
                && startDate.isAfter(endDate)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "프로젝트 종료일은 시작일보다 빠를 수 없습니다."
            );
        }
    }

    // =====================================================================================
    // 내부 삭제 대상 묶음
    // =====================================================================================

    private record DeleteTargets(
            List<ProjectImageEntity> images,
            List<ProjectSectionEntity> sections,
            List<ProjectTechEntity> techStacks,
            List<ProjectLinkEntity> links
    ) {
    }

    // =====================================================================================
    // 이미지 저장
    // =====================================================================================
    // 등록용 이미지 Entity 생성
    private ProjectImageEntity createImageEntity(
            ProjectEntity project,
            ProjectSectionEntity section,
            AdminProjectImageRequestDto request
    ) {
        String imageUrl =
                request.imageUrl().trim();

        imageStorageService.validateManagedImageUrl(
                imageUrl
        );

        return ProjectImageEntity.builder()
                .project(project)
                .section(section)
                .imageType(request.imageType())
                .imageUrl(imageUrl)
                .caption(trimToNull(request.caption()))
                .displayOrder(request.displayOrder())
                .build();
    }
}
