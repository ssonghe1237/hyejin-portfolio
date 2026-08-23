package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;
import com.hyejin.portfolio.domain.about.entity.AboutEntity;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutDetailResponseDto
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 About 상세 응답 DTO
 *                  - About 기본 정보와 공개 상태 제공
 *                  - 관리자 편집에 필요한 전체 섹션 HTML 제공
 *                  - About 생성 및 수정 시각 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 */
public record AdminAboutDetailResponseDto(

        Long aboutId,

        String heading,

        String summary,

        String nameKo,
        String nameEn,
        String profileImageUrl,
        LocalDate birthDate,
        String position,
        String background,
        String currentFocus,
        String location,
        String interests,

        String ctaLabel,

        String ctaUrl,

        boolean published,

        LocalDateTime createdAt,

        LocalDateTime updatedAt,

        List<AdminAboutCompetencyResponseDto> competencies,

        List<AdminAboutSectionResponseDto> sections,
        List<AdminAboutEducationResponseDto> educations,
        List<AdminAboutAwardResponseDto> awards,
        List<AdminAboutWorkExperienceResponseDto> workExperiences,
        List<AdminAboutSkillCategoryResponseDto> skillCategories

) {

    public static AdminAboutDetailResponseDto from(
            AboutEntity about
    ) {
        List<AdminAboutCompetencyResponseDto> competencies =
                about.getCompetencies()
                        .stream()
                        .map(AdminAboutCompetencyResponseDto :: from)
                        .toList();

        List<AdminAboutSectionResponseDto> sections =
                about.getSections()
                        .stream()
                        .map(AdminAboutSectionResponseDto::from)
                        .toList();

        return new AdminAboutDetailResponseDto(
                about.getAboutId(),
                about.getHeading(),
                about.getSummary(),
                about.getNameKo(),
                about.getNameEn(),
                about.getProfileImageUrl(),
                about.getBirthDate(),
                about.getPosition(),
                about.getBackground(),
                about.getCurrentFocus(),
                about.getLocation(),
                about.getInterests(),
                about.getCtaLabel(),
                about.getCtaUrl(),
                about.isPublished(),
                about.getCreatedAt(),
                about.getUpdatedAt(),
                competencies,
                sections,
                about.getEducations().stream().map(AdminAboutEducationResponseDto::from).toList(),
                about.getAwards().stream().map(AdminAboutAwardResponseDto::from).toList(),
                about.getWorkExperiences().stream().map(AdminAboutWorkExperienceResponseDto::from).toList(),
                about.getSkillCategories().stream().map(AdminAboutSkillCategoryResponseDto::from).toList()
        );
    }
}
