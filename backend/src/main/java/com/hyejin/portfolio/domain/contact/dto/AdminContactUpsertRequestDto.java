package com.hyejin.portfolio.domain.contact.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.dto
 * fileName       : AdminContactUpsertRequestDto
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 Contact 생성·수정 요청 DTO
 *                  - Contact 기본 소개 정보 저장
 *                  - 이메일 및 외부 프로필 링크 저장
 *                  - 이력서 버튼 문구와 공개 상태 저장
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record AdminContactUpsertRequestDto(

        @NotBlank(
                message = "Contact 메인 제목은 필수입니다."
        )
        @Size(
                max = 200,
                message = "Contact 메인 제목은 200자 이하여야 합니다."
        )
        String heading,

        @NotBlank(
                message = "Contact 소개 문구는 필수입니다."
        )
        @Size(
                max = 1000,
                message = "Contact 소개 문구는 1000자 이하여야 합니다."
        )
        String description,

        @NotBlank(
                message = "이메일은 필수입니다."
        )
        @Email(
                message = "올바른 이메일 형식을 입력해 주세요."
        )
        @Size(
                max = 255,
                message = "이메일은 255자 이하여야 합니다."
        )
        String email,

        @NotBlank(
                message = "GitHub 주소는 필수입니다."
        )
        @Size(
                max = 500,
                message = "GitHub 주소는 500자 이하여야 합니다."
        )
        String githubUrl,

        @Size(
                max = 500,
                message = "LinkedIn 주소는 500자 이하여야 합니다."
        )
        String linkedinUrl,

        @NotBlank(
                message = "이력서 버튼 문구는 필수입니다."
        )
        @Size(
                max = 100,
                message = "이력서 버튼 문구는 100자 이하여야 합니다."
        )
        String resumeLabel,

        @NotNull(
                message = "Contact 공개 여부는 필수입니다."
        )
        Boolean published

) {
}