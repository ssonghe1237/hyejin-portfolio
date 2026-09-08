package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectCreateRequestDto
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 등록 요청 DTO
 *                  - 프로젝트 기본 정보 등록
 *                  - 썸네일, 대표 이미지, 기술스택, 섹션, 링크 목록 포함
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 */
public record AdminProjectCreateRequestDto(

        @NotBlank(message = "프로젝트 제목은 필수입니다.")
        String title,

        @NotBlank(message = "프로젝트 slug는 필수입니다.")
        @Pattern(
                regexp = "^[a-z0-9]+(?:-[a-z0-9]+)*$",
                message = "slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다."
        )
        String slug,

        @NotBlank(message = "프로젝트 요약은 필수입니다.")
        String summary,

        String description,

        @NotNull(message = "프로젝트 유형은 필수입니다.")
        ProjectType projectType,

        LocalDate startDate,

        LocalDate endDate,

        String teamName,

        String role,

        @PositiveOrZero(message = "프로젝트 표시 순서는 0 이상이어야 합니다.")
        int displayOrder,


        boolean published,

        @Valid
        AdminProjectImageRequestDto thumbnailImage,

        List<@Valid AdminProjectImageRequestDto> heroImages,

        List<@Valid AdminProjectTechRequestDto> techStacks,

        List<@Valid AdminProjectSectionRequestDto> sections,

        List<@Valid AdminProjectLinkRequestDto> links

) {

    public AdminProjectCreateRequestDto {
        heroImages = heroImages == null ? List.of() : List.copyOf(heroImages);
        techStacks = techStacks == null ? List.of() : List.copyOf(techStacks);
        sections = sections == null ? List.of() : List.copyOf(sections);
        links = links == null ? List.of() : List.copyOf(links);
    }
}