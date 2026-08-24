package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.AdminAboutDetailResponseDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutSectionRequestDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutSkillCategoryRequestDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutSkillRequestDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutUpsertRequestDto;
import com.hyejin.portfolio.domain.about.dto.AboutResponseDto;
import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.entity.AboutSectionType;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import com.hyejin.portfolio.global.security.html.RichTextHtmlSanitizer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class AdminAboutTechnicalSkillsServiceTest {
    private AboutRepository repository;
    private AdminAboutServiceImpl service;
    private AboutEntity about;

    @BeforeEach
    void setUp() {
        repository = mock(AboutRepository.class);
        service = new AdminAboutServiceImpl(repository, new RichTextHtmlSanitizer());
        about = AboutEntity.builder().heading("Heading").summary("Summary")
                .ctaLabel("Contact").ctaUrl("/contact").published(true).build();
        when(repository.findBySingletonKey(AboutEntity.SINGLETON_KEY)).thenReturn(Optional.of(about));
        when(repository.saveAndFlush(any(AboutEntity.class))).thenAnswer(invocation -> invocation.getArgument(0));
    }

    @Test
    void savesCategoriesWithSkillsAndKeepsTechnicalStack() {
        AdminAboutDetailResponseDto response = service.upsertAbout(request(categories()));

        assertThat(response.skillCategories()).hasSize(2);
        assertThat(response.skillCategories().get(0).skills()).extracting("name")
                .containsExactly("Java", "Spring Boot");
        assertThat(response.sections()).singleElement()
                .satisfies(section -> assertThat(section.sectionType()).isEqualTo(AboutSectionType.TECHNICAL_STACK));

        AboutResponseDto userResponse = AboutResponseDto.from(about);
        assertThat(userResponse.skillCategories()).hasSize(2);
        assertThat(userResponse.skillCategories().get(0).skills()).extracting("displayOrder")
                .containsExactly(1, 2);
    }

    @Test
    void omittedCategoriesPreserveExistingAndEmptyListDeletesAll() {
        service.upsertAbout(request(categories()));
        service.upsertAbout(request(null));
        assertThat(about.getSkillCategories()).hasSize(2);

        service.upsertAbout(request(List.of()));
        assertThat(about.getSkillCategories()).isEmpty();
    }

    @Test
    void rejectsDuplicateSkillNameIgnoringCaseAndWhitespace() {
        List<AdminAboutSkillCategoryRequestDto> duplicate = List.of(
                new AdminAboutSkillCategoryRequestDto("BACKEND", null, 1, List.of(
                        new AdminAboutSkillRequestDto("Java", null, null, 1),
                        new AdminAboutSkillRequestDto(" java ", null, null, 2)
                ))
        );

        assertThatThrownBy(() -> service.upsertAbout(request(duplicate)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("기술명은 중복될 수 없습니다");
    }

    private List<AdminAboutSkillCategoryRequestDto> categories() {
        return List.of(
                new AdminAboutSkillCategoryRequestDto("CORE BACKEND", "Backend", 1, List.of(
                        new AdminAboutSkillRequestDto("Java", null, "Language", 1),
                        new AdminAboutSkillRequestDto("Spring Boot", null, null, 2)
                )),
                new AdminAboutSkillCategoryRequestDto("DATA & AI", null, 2, List.of())
        );
    }

    private AdminAboutUpsertRequestDto request(List<AdminAboutSkillCategoryRequestDto> skillCategories) {
        return new AdminAboutUpsertRequestDto(
                "Heading", "Summary", null, null, null, null,
                null, null, null, null, null,
                "Contact", "/contact", true,
                List.of(),
                List.of(new AdminAboutSectionRequestDto(
                        "Technical Stack", "<p>기존 기술 스택</p>", AboutSectionType.TECHNICAL_STACK, 1
                )),
                null, null, null, skillCategories
        );
    }
}
