package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : AdminProjectUpdateRequestDto
 * author         : Song
 * date           : 2026-07-08
 * description    : 관리자 프로젝트 수정 요청 DTO
 *                  - 프로젝트 기본 정보 수정
 *                  - 이미지, 섹션, 기술스택, 링크 수정 및 신규 등록
 *                  - 하위 데이터 ID 기준 선택 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-08        Song       최초 생성
 */
public record AdminProjectUpdateRequestDto(

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

        /*
         * primitive int를 사용하면 JSON 필드 누락 시 0이 들어가므로
         * 누락 여부를 검증하기 위해 Integer 사용
         */
        @NotNull(message = "프로젝트 표시 순서는 필수입니다.")
        @PositiveOrZero(message = "프로젝트 표시 순서는 0 이상이어야 합니다.")
        Integer displayOrder,

        /*
         * primitive boolean을 사용하면 JSON 필드 누락 시 false가 들어가므로
         * 누락 여부를 검증하기 위해 Boolean 사용
         */
        @NotNull(message = "프로젝트 공개 여부는 필수입니다.")
        Boolean published,

        /*
         * null이면 썸네일을 수정하거나 추가하지 않음
         *
         * projectImageId 있음:
         * 기존 썸네일 수정
         *
         * projectImageId 없음:
         * 신규 썸네일 등록
         *
         * 기존 썸네일 삭제:
         * deletedImageIds에 기존 썸네일 ID 전달
         */
        @Valid
        AdminProjectImageUpdateRequestDto thumbnailImage,

        /*
         * 기존 Hero 이미지 수정 및 신규 Hero 이미지 등록 목록
         *
         * 빈 배열 []은 기존 Hero 이미지 전체 삭제가 아니라
         * 이번 요청에서 수정하거나 추가할 Hero 이미지가 없다는 의미
         */
        @NotNull(message = "Hero 이미지 목록은 필수입니다.")
        List<
                @NotNull(message = "Hero 이미지 항목에는 null을 사용할 수 없습니다.")
                @Valid
                        AdminProjectImageUpdateRequestDto
                > heroImages,

        /*
         * 직접 선택하여 삭제할 이미지 ID 목록
         *
         * 썸네일, Hero 이미지, 섹션 이미지 모두 포함 가능
         * 삭제 대상이 없으면 빈 배열 [] 전달
         *
         * 섹션 자체를 삭제하는 경우 해당 섹션의 이미지는
         * Service에서 자동으로 삭제하므로 여기에 별도로 넣지 않아도 됨
         */
        @NotNull(message = "삭제 이미지 ID 목록은 필수입니다.")
        List<
                @NotNull(message = "삭제 이미지 ID에는 null을 사용할 수 없습니다.")
                @Positive(message = "삭제 이미지 ID는 1 이상이어야 합니다.")
                        Long
                > deletedImageIds,

        /*
         * 기존 섹션 수정 및 신규 섹션 등록 목록
         *
         * 빈 배열 []은 기존 섹션 전체 삭제가 아니라
         * 이번 요청에서 수정하거나 추가할 섹션이 없다는 의미
         */
        @NotNull(message = "프로젝트 섹션 목록은 필수입니다.")
        List<
                @NotNull(message = "프로젝트 섹션 항목에는 null을 사용할 수 없습니다.")
                @Valid
                        AdminProjectSectionUpdateRequestDto
                > sections,

        /*
         * 선택 삭제할 섹션 ID 목록
         *
         * 섹션 삭제 시 해당 섹션에 연결된 이미지는
         * Service에서 이미지 먼저 삭제한 후 섹션을 삭제
         */
        @NotNull(message = "삭제 섹션 ID 목록은 필수입니다.")
        List<
                @NotNull(message = "삭제 섹션 ID에는 null을 사용할 수 없습니다.")
                @Positive(message = "삭제 섹션 ID는 1 이상이어야 합니다.")
                        Long
                > deletedSectionIds,

        /*
         * 기존 기술스택 수정 및 신규 기술스택 등록 목록
         */
        @NotNull(message = "기술스택 목록은 필수입니다.")
        List<
                @NotNull(message = "기술스택 항목에는 null을 사용할 수 없습니다.")
                @Valid
                        AdminProjectTechUpdateRequestDto
                > techStacks,

        /*
         * 선택 삭제할 기술스택 ID 목록
         */
        @NotNull(message = "삭제 기술스택 ID 목록은 필수입니다.")
        List<
                @NotNull(message = "삭제 기술스택 ID에는 null을 사용할 수 없습니다.")
                @Positive(message = "삭제 기술스택 ID는 1 이상이어야 합니다.")
                        Long
                > deletedTechIds,

        /*
         * 기존 링크 수정 및 신규 링크 등록 목록
         */
        @NotNull(message = "프로젝트 링크 목록은 필수입니다.")
        List<
                @NotNull(message = "프로젝트 링크 항목에는 null을 사용할 수 없습니다.")
                @Valid
                        AdminProjectLinkUpdateRequestDto
                > links,

        /*
         * 선택 삭제할 링크 ID 목록
         */
        @NotNull(message = "삭제 링크 ID 목록은 필수입니다.")
        List<
                @NotNull(message = "삭제 링크 ID에는 null을 사용할 수 없습니다.")
                @Positive(message = "삭제 링크 ID는 1 이상이어야 합니다.")
                        Long
                > deletedLinkIds

) {

    /**
     * 요청으로 전달된 목록의 외부 변경을 방지하기 위해
     * 불변 리스트로 복사한다.
     *
     * null은 @NotNull 검증에서 처리할 수 있도록 그대로 유지한다.
     */
    public AdminProjectUpdateRequestDto {

        if (heroImages != null) {
            heroImages = List.copyOf(heroImages);
        }

        if (deletedImageIds != null) {
            deletedImageIds = List.copyOf(deletedImageIds);
        }

        if (sections != null) {
            sections = List.copyOf(sections);
        }

        if (deletedSectionIds != null) {
            deletedSectionIds = List.copyOf(deletedSectionIds);
        }

        if (techStacks != null) {
            techStacks = List.copyOf(techStacks);
        }

        if (deletedTechIds != null) {
            deletedTechIds = List.copyOf(deletedTechIds);
        }

        if (links != null) {
            links = List.copyOf(links);
        }

        if (deletedLinkIds != null) {
            deletedLinkIds = List.copyOf(deletedLinkIds);
        }
    }
}