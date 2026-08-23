package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutEntity;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutResponseDto
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 공개 About 응답 DTO
 *                  - About 메인 제목과 소개 요약 제공
 *                  - CTA 문구 및 이동 주소 제공
 *                  - 공개 About 섹션 목록 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */
public record AboutResponseDto(

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

        LocalDateTime updatedAt,

        List<AboutCompetencyResponseDto> competencies,

        List<AboutSectionResponseDto> sections,

        List<AboutEducationResponseDto> educations,

        List<AboutAwardResponseDto> awards,

        List<AboutWorkExperienceResponseDto> workExperiences,

        List<AboutSkillCategoryResponseDto> skillCategories

) {

    public static AboutResponseDto from(
            AboutEntity about
    ) {
        List<AboutCompetencyResponseDto> competencies =
                about.getCompetencies()
                        .stream()
                        .map(AboutCompetencyResponseDto::from)
                        .toList();

        List<AboutSectionResponseDto> sections =
                about.getSections()
                        .stream()
                        .map(AboutSectionResponseDto::from)
                        .toList();

        return new AboutResponseDto(
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
                about.getUpdatedAt(),
                competencies,
                sections,
                about.getEducations().stream().map(AboutEducationResponseDto::from).toList(),
                about.getAwards().stream().map(AboutAwardResponseDto::from).toList(),
                about.getWorkExperiences().stream().map(AboutWorkExperienceResponseDto::from).toList(),
                about.getSkillCategories().stream().map(AboutSkillCategoryResponseDto::from).toList()
        );
    }
}
