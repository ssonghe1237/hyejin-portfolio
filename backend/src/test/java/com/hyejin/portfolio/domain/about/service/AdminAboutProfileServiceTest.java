package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.*;
import com.hyejin.portfolio.domain.about.entity.*;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.security.html.RichTextHtmlSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AdminAboutProfileServiceTest {

    private AboutRepository aboutRepository;
    private AdminAboutServiceImpl service;

    @BeforeEach
    void setUp() {
        aboutRepository = mock(AboutRepository.class);
        service = new AdminAboutServiceImpl(aboutRepository, new RichTextHtmlSanitizer());
    }

    @Test
    void upsertReplacesProfileChildrenAndSanitizesWorkDescription() {
        AboutEntity about = existingAbout();
        when(aboutRepository.findBySingletonKey(AboutEntity.SINGLETON_KEY)).thenReturn(Optional.of(about));
        when(aboutRepository.saveAndFlush(any(AboutEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AdminAboutDetailResponseDto response = service.upsertAbout(request(
                LocalDate.of(2025, 1, 1), LocalDate.of(2025, 12, 31)
        ));

        assertThat(response.educations()).hasSize(1);
        assertThat(response.awards()).hasSize(1);
        assertThat(response.workExperiences()).hasSize(1);
        assertThat(response.workExperiences().get(0).descriptionHtml()).contains("업무").doesNotContain("script");
        assertThat(response.nameKo()).isEqualTo("송혜진");
    }

    @Test
    void rejectsWorkExperienceWhenStartDateIsAfterEndDate() {
        when(aboutRepository.findBySingletonKey(AboutEntity.SINGLETON_KEY)).thenReturn(Optional.of(existingAbout()));

        assertThatThrownBy(() -> service.upsertAbout(request(
                LocalDate.of(2026, 1, 1), LocalDate.of(2025, 12, 31)
        ))).isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("시작일은 종료일보다 늦을 수 없습니다");
    }

    @Test
    void legacyAboutWithNullProfileReturnsEmptyChildLists() {
        AboutResponseDto response = AboutResponseDto.from(existingAbout());

        assertThat(response.nameKo()).isNull();
        assertThat(response.educations()).isEmpty();
        assertThat(response.awards()).isEmpty();
        assertThat(response.workExperiences()).isEmpty();
    }

    private AboutEntity existingAbout() {
        return AboutEntity.builder()
                .heading("Heading")
                .summary("Summary")
                .ctaLabel("Contact")
                .ctaUrl("/contact")
                .published(true)
                .build();
    }

    private AdminAboutUpsertRequestDto request(LocalDate workStartDate, LocalDate workEndDate) {
        return new AdminAboutUpsertRequestDto(
                "Heading", "Summary", "송혜진", "SONG HYE JIN", "/profile.jpg",
                LocalDate.of(1997, 5, 9), "Backend Developer", "Planning · Design",
                "Backend", "Seoul", "Reading", "Contact", "/contact", true,
                List.of(), List.of(),
                List.of(new AdminAboutEducationRequestDto(
                        AboutEducationType.TRAINING, "기관", "과정",
                        LocalDate.of(2025, 1, 1), LocalDate.of(2025, 6, 1),
                        "수료", "교육 설명", 1
                )),
                List.of(new AdminAboutAwardRequestDto(
                        "수상", "기관", LocalDate.of(2025, 6, 1), "설명", 1
                )),
                List.of(new AdminAboutWorkExperienceRequestDto(
                        "회사", "개발자", AboutEmploymentType.FULL_TIME,
                        workStartDate, workEndDate, "<p><strong>업무</strong></p><script>alert(1)</script>", 1
                )),
                null
        );
    }
}
