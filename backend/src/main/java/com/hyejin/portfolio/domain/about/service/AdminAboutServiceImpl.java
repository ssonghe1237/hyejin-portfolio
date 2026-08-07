package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.AdminAboutCompetencyRequestDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutDetailResponseDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutSectionRequestDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutUpsertRequestDto;
import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;
import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.entity.AboutSectionEntity;
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
}
