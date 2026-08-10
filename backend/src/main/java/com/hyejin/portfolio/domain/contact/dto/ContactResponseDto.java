package com.hyejin.portfolio.domain.contact.dto;

import com.hyejin.portfolio.domain.contact.entity.ContactEntity;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.dto
 * fileName       : ContactResponseDto
 * author         : Song
 * date           : 2026-08-07
 * description    : 사용자 공개 Contact 응답 DTO
 *                  - Contact 소개 정보 제공
 *                  - 이메일 및 외부 프로필 링크 제공
 *                  - 공개 이력서 PDF 연결 정보 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record ContactResponseDto(

        String heading,

        String description,

        String email,

        String githubUrl,

        String linkedinUrl,

        String resumeLabel,

        String resumeFileUrl

) {

    public static ContactResponseDto from(
            ContactEntity contact
    ) {
        return new ContactResponseDto(
                contact.getHeading(),
                contact.getDescription(),
                contact.getEmail(),
                contact.getGithubUrl(),
                contact.getLinkedinUrl(),
                contact.getResumeLabel(),
                contact.getResumeFileUrl()
        );
    }
}