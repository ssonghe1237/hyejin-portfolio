package com.hyejin.portfolio.domain.about.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutUpsertRequestDto
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 About 생성·수정 요청 DTO
 *                  - About 기본 정보와 공개 상태 전달
 *                  - 전체 About 섹션 목록을 일괄 저장
 *                  - About가 없으면 생성하고 있으면 수정하는 upsert 요청
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 */
public record AdminAboutUpsertRequestDto(

        @NotBlank(message = "About 메인 제목은 필수입니다.")
        @Size(
                max = 200,
                message = "About 메인 제목은 200자 이하여야 합니다."
        )
        String heading,

        @NotBlank(message = "About 소개 요약은 필수입니다.")
        @Size(
                max = 1000,
                message = "About 소개 요약은 1000자 이하여야 합니다."
        )
        String summary,

        @Size(max = 100) String nameKo,
        @Size(max = 100) String nameEn,
        @Size(max = 2000) String profileImageUrl,
        LocalDate birthDate,
        @Size(max = 150) String position,
        @Size(max = 200) String background,
        @Size(max = 200) String currentFocus,
        @Size(max = 200) String location,
        @Size(max = 500) String interests,

        @NotBlank(message = "About CTA 문구는 필수입니다.")
        @Size(
                max = 100,
                message = "About CTA 문구는 100자 이하여야 합니다."
        )
        String ctaLabel,

        @NotBlank(message = "About CTA 주소는 필수입니다.")
        @Size(
                max = 500,
                message = "About CTA 주소는 500자 이하여야 합니다."
        )
        String ctaUrl,

        @NotNull(message = "About 공개 여부는 필수입니다.")
        Boolean published,

        @NotNull(
                message = "핵심 역량 목록은 필수입니다."
        )
        @Size(
                max = 10,
                message = "핵심 역량은 최대 10개까지 등록할 수 있습니다."
        )
        List<
                @NotNull(
                        message = "핵심 역량 정보는 null일 수 없습니다."
                )
                @Valid AdminAboutCompetencyRequestDto
                > competencies,

        @NotNull(message = "About 섹션 목록은 필수입니다.")
        @Size(
                max = 20,
                message = "About 섹션은 최대 20개까지 등록할 수 있습니다."
        )
        List<
                @NotNull(message = "About 섹션 정보는 null일 수 없습니다.")
                @Valid AdminAboutSectionRequestDto
                > sections,

        @Size(max = 20, message = "교육 이력은 최대 20개까지 등록할 수 있습니다.")
        List<@NotNull @Valid AdminAboutEducationRequestDto> educations,

        @Size(max = 30, message = "수상 이력은 최대 30개까지 등록할 수 있습니다.")
        List<@NotNull @Valid AdminAboutAwardRequestDto> awards,

        @Size(max = 30, message = "근무 이력은 최대 30개까지 등록할 수 있습니다.")
        List<@NotNull @Valid AdminAboutWorkExperienceRequestDto> workExperiences,

        @Size(max = 10, message = "기술 카테고리는 최대 10개까지 등록할 수 있습니다.")
        List<@NotNull @Valid AdminAboutSkillCategoryRequestDto> skillCategories

) {
}
