package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.*;
import com.hyejin.portfolio.domain.about.entity.*;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.security.html.RichTextHtmlSanitizer;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : AdminAboutServiceImpl
 * author         : Song
 * date           : 2026-08-05
 * description    : 관리자 About 콘텐츠 Service
 *                  - 싱글턴 키 기준 About 상세 조회
 *                  - About가 없으면 생성하고 있으면 수정
 *                  - 전체 섹션 교체 및 고아 섹션 삭제 처리
 *                  - About 섹션 Rich Text HTML 정제
 *                  - CTA 주소의 허용 경로 및 프로토콜 검증
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
@Transactional (readOnly = true)
public class AdminAboutServiceImpl implements AdminAboutService {

    private final AboutRepository aboutRepository;
    private final RichTextHtmlSanitizer richTextHtmlSanitizer;

    // =====================================================================================
    // 조회
    // =====================================================================================

    @Override
    public Optional<AdminAboutDetailResponseDto> getAbout() {
        return aboutRepository.findBySingletonKey(
                AboutEntity.SINGLETON_KEY
                )
                .map(AdminAboutDetailResponseDto :: from);
    }

    // =====================================================================================
    // 저장
    // =====================================================================================

    @Override
    @Transactional
    public AdminAboutDetailResponseDto upsertAbout(
            AdminAboutUpsertRequestDto request
    ) {
        if (request == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "About 저장 요청 정보가 필요합니다."
            );
        }

        // 1) 받아온 값 정재 =========================================
        String heading = request.heading().trim();

        String summary = request.summary().trim();

        String ctaLabel = request.ctaLabel().trim();

        // CTA 주소 검증
        String ctaUrl =
                validateAndNormalizeCtaUrl(
                    request.ctaUrl()
                );

        // competency 엔티티 생성
        List<AboutCompetencyEntity> competency =
                createCompetancies(
                        request.competencies()
                );

        // About 섹션 엔티티 생성
        List<AboutSectionEntity> sections =
                createSanitizedSection(
                        request.sections()
                );

        // 2) 기존 값과 값 비교 =========================================
        AboutEntity about = aboutRepository
                .findBySingletonKey(                // 1) DB에서 조회 시도
                        AboutEntity.SINGLETON_KEY
                )
                .orElseGet(() ->                    // 2) 조회 결과가 비어있으면 람다식 실행
                        AboutEntity.builder()       // 3) 새 AboutEntity 객체 생성하여 반환
                                .heading(heading)
                                .summary(summary)
                                .ctaLabel(ctaLabel)
                                .ctaUrl(ctaUrl)
                                .published(request.published())
                                .build()
                );

        // 3) 받아온 값으로 업데이트
        about.updateBasicInfo(
                heading,
                summary,
                ctaLabel,
                ctaUrl
        );

        // STEP 2 이전 Admin 클라이언트가 신규 프로필 필드를 생략하면 기존 값을 보존한다.
        if (hasProfilePayload(request)) {
            about.updateProfile(
                    trimToNull(request.nameKo()),
                    trimToNull(request.nameEn()),
                    trimToNull(request.profileImageUrl()),
                    request.birthDate(),
                    trimToNull(request.position()),
                    trimToNull(request.background()),
                    trimToNull(request.currentFocus()),
                    trimToNull(request.location()),
                    trimToNull(request.interests())
            );
        }

        if (request.published()) {
            about.publish();
        } else {
            about.unpublish();
        }

        // 요청으로 전달 된 핵심 역량으로 전체 교체
        about.replaceCompetencies(
                competency
        );


        // 요청으로 전달 된 섹션으로 전체 교체
        about.replaceSections(
                sections
        );

        // STEP 2 Admin UI 전환 전 요청은 신규 목록을 생략할 수 있다.
        if (request.educations() != null) {
            about.replaceEducations(createEducations(request.educations()));
        }
        if (request.awards() != null) {
            about.replaceAwards(createAwards(request.awards()));
        }
        if (request.workExperiences() != null) {
            about.replaceWorkExperiences(createWorkExperiences(request.workExperiences()));
        }
        // STEP 4B 이전 Admin 클라이언트가 필드를 생략하면 기존 기술 데이터를 보존한다.
        if (request.skillCategories() != null) {
            about.replaceSkillCategories(createSkillCategories(request.skillCategories()));
        }

        AboutEntity savedAbout =
                aboutRepository.saveAndFlush(
                        about
                );

        return AdminAboutDetailResponseDto.from(savedAbout);
    }

    // [upsertAbout 헬퍼] : CTA 주소 검증
    private String validateAndNormalizeCtaUrl(
            String rowCtaUrl
    ) {
        String ctaUrl = rowCtaUrl.trim();

        // React 내부 경로 허용
        if (ctaUrl.startsWith("/") && !ctaUrl.startsWith("//")) {
            return ctaUrl;
        }

        // 현재 페이지 내 앵커 주소 허용
        if (ctaUrl.startsWith("#")) {
            return ctaUrl;
        }

        URI uri;

        try {
            uri = URI.create(ctaUrl);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "About CTA 주소 형식이 올바르지 않습니다."
            );
        }

        String scheme = uri.getScheme();

        if (scheme == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "About CTA 주소는 내부 경로 또는 허용된 프로토콜을 사용해야 합니다."
            );
        }

        String normalizedScheme = scheme.toLowerCase(Locale.ROOT);

        boolean allowedScheme =
                normalizedScheme.equals("http")
                    || normalizedScheme.equals("https")
                    || normalizedScheme.equals("mailto")
                    || normalizedScheme.equals("tel");

        if (!allowedScheme) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "About CTA 주소에는 http, https, mailto, tel 또는 내부 경로만 사용할 수 있습니다."
            );
        }

        return ctaUrl;
    }

    // [upsertAbout 헬퍼] : AdminAboutSectionRequestDto => About 섹션 엔티티 변환
    private List<AboutSectionEntity> createSanitizedSection(
            List<AdminAboutSectionRequestDto> sectionRequests
    ) {
        if (sectionRequests == null) {
            throw new ResponseStatusException(
                  HttpStatus.BAD_REQUEST,
                  "About 섹션 목록은 필수입니다."
            );
        }

        List<AboutSectionEntity> sections = new ArrayList<>();

        long technicalStackCount = sectionRequests.stream()
                .filter(request -> request != null && request.sectionType() == AboutSectionType.TECHNICAL_STACK)
                .count();
        long troubleshootingCount = sectionRequests.stream()
                .filter(request -> request != null && request.sectionType() == AboutSectionType.TROUBLESHOOTING)
                .count();

        if (technicalStackCount > 1 || troubleshootingCount > 1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Technical Stack과 Troubleshooting 섹션은 각각 하나만 등록할 수 있습니다."
            );
        }

        for(int index = 0; index < sectionRequests.size(); index++) {
            AdminAboutSectionRequestDto sectionRequest = sectionRequests.get(index);

            if (sectionRequest == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "About 섹션 정보는 null일 수 없습니다."
                );
            }

            // 허용 목록 정책을 적용하여 안전한 HTML 반환
            String sanitizedContentHtml =
                    richTextHtmlSanitizer.sanitize(
                            sectionRequest.contentHtml()
                    );

            // 정제된 HTML에 실제 표시 가능한 텍스트가 존재하는지 확인
            if (!richTextHtmlSanitizer.hasVisibleContent(sanitizedContentHtml)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "About" + (index +1) + "번 섹션 본문에는 실제 내용이 포함되어야 합니다."
                );
            }

            AboutSectionEntity section =
                    AboutSectionEntity.builder()
                            .title(sectionRequest.title().trim())
                            .contentHtml(sanitizedContentHtml)
                            .sectionType(sectionRequest.sectionType())
                            .displayOrder(sectionRequest.displayOrder())
                            .build();

            sections.add(section);
        }

        return sections;
    }

    // AdminAboutCompetencyRequestDto => AboutCompetencyEntity 변환
    private List<AboutCompetencyEntity> createCompetancies(
        List<AdminAboutCompetencyRequestDto> competencyRequests
    ) {
        // 값 검증
        if (competencyRequests == null) {
             throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "About 핵심역량 목록은 필수입니다."
            );
        }

        // AboutCompetencyEntity를 담을 List 생성
        List<AboutCompetencyEntity> competencies = new ArrayList<>();

        // for문(반복문)을 돌며 competencies에 값 담기
        for (int index = 0; index < competencyRequests.size(); index++) {

            // AboutCompetencyEntity 1개 꺼내기
            AdminAboutCompetencyRequestDto request  = competencyRequests.get(index);

            // 값 검증
            if (request == null) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "핵심 역량 정보는 null일 수 없습니다."
                );
            }

            // AboutCompetencyEntity 생성
            AboutCompetencyEntity competency = AboutCompetencyEntity.builder()
                    .title(request.title().trim())
                    .description(request.description().trim())
                    .displayOrder(request.displayOrder())
                    .build();

            competencies.add(competency);
        }

        return competencies;
    }

    private List<AboutEducationEntity> createEducations(
            List<AdminAboutEducationRequestDto> requests
    ) {
        List<AboutEducationEntity> result = new ArrayList<>();
        for (int index = 0; index < requests.size(); index++) {
            AdminAboutEducationRequestDto request = requests.get(index);
            validateDateRange(request.startDate(), request.endDate(), "교육 이력", index);
            result.add(AboutEducationEntity.builder()
                    .educationType(request.educationType())
                    .institutionName(request.institutionName().trim())
                    .courseName(request.courseName().trim())
                    .startDate(request.startDate())
                    .endDate(request.endDate())
                    .status(trimToNull(request.status()))
                    .description(trimToNull(request.description()))
                    .displayOrder(request.displayOrder())
                    .build());
        }
        return result;
    }

    private List<AboutAwardEntity> createAwards(
            List<AdminAboutAwardRequestDto> requests
    ) {
        return requests.stream()
                .map(request -> AboutAwardEntity.builder()
                        .title(request.title().trim())
                        .issuer(request.issuer().trim())
                        .awardedDate(request.awardedDate())
                        .description(trimToNull(request.description()))
                        .displayOrder(request.displayOrder())
                        .build())
                .toList();
    }

    private List<AboutWorkExperienceEntity> createWorkExperiences(
            List<AdminAboutWorkExperienceRequestDto> requests
    ) {
        List<AboutWorkExperienceEntity> result = new ArrayList<>();
        for (int index = 0; index < requests.size(); index++) {
            AdminAboutWorkExperienceRequestDto request = requests.get(index);
            validateDateRange(request.startDate(), request.endDate(), "근무 이력", index);
            String sanitizedDescription = richTextHtmlSanitizer.sanitize(request.descriptionHtml());
            if (!richTextHtmlSanitizer.hasVisibleContent(sanitizedDescription)) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "근무 이력 " + (index + 1) + "번 설명에는 실제 내용이 포함되어야 합니다."
                );
            }
            result.add(AboutWorkExperienceEntity.builder()
                    .companyName(request.companyName().trim())
                    .positionTitle(request.positionTitle().trim())
                    .employmentType(request.employmentType())
                    .startDate(request.startDate())
                    .endDate(request.endDate())
                    .descriptionHtml(sanitizedDescription)
                    .displayOrder(request.displayOrder())
                    .build());
        }
        return result;
    }

    private List<AboutSkillCategoryEntity> createSkillCategories(
            List<AdminAboutSkillCategoryRequestDto> requests
    ) {
        validateUniqueCategoryTitles(requests);

        return requests.stream()
                .map(category -> {
                    validateUniqueSkillNames(category);
                    List<AboutSkillEntity> skills = category.skills().stream()
                            .map(skill -> AboutSkillEntity.builder()
                                    .name(skill.name().trim())
                                    .logoUrl(trimToNull(skill.logoUrl()))
                                    .description(trimToNull(skill.description()))
                                    .displayOrder(skill.displayOrder())
                                    .build())
                            .toList();

                    return AboutSkillCategoryEntity.builder()
                            .title(category.title().trim())
                            .description(trimToNull(category.description()))
                            .displayOrder(category.displayOrder())
                            .skills(skills)
                            .build();
                })
                .toList();
    }

    private void validateUniqueCategoryTitles(List<AdminAboutSkillCategoryRequestDto> requests) {
        long distinctCount = requests.stream()
                .map(request -> request.title().trim().toLowerCase(Locale.ROOT))
                .distinct()
                .count();
        if (distinctCount != requests.size()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기술 카테고리 제목은 중복될 수 없습니다.");
        }
    }

    private void validateUniqueSkillNames(AdminAboutSkillCategoryRequestDto category) {
        long distinctCount = category.skills().stream()
                .map(skill -> skill.name().trim().toLowerCase(Locale.ROOT))
                .distinct()
                .count();
        if (distinctCount != category.skills().size()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    category.title().trim() + " 카테고리의 기술명은 중복될 수 없습니다."
            );
        }
    }

    private void validateDateRange(
            LocalDate startDate, LocalDate endDate, String label, int index
    ) {
        if (endDate != null && startDate.isAfter(endDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    label + " " + (index + 1) + "번 시작일은 종료일보다 늦을 수 없습니다."
            );
        }
    }

    private String trimToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private boolean hasProfilePayload(AdminAboutUpsertRequestDto request) {
        return request.nameKo() != null
                || request.nameEn() != null
                || request.profileImageUrl() != null
                || request.birthDate() != null
                || request.position() != null
                || request.background() != null
                || request.currentFocus() != null
                || request.location() != null
                || request.interests() != null;
    }
}
