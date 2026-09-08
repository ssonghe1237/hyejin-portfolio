package com.hyejin.portfolio.domain.contact.dto;

import com.hyejin.portfolio.domain.contact.entity.ContactEntity;

import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.dto
 * fileName       : AdminContactDetailResponseDto
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 Contact 상세 응답 DTO
 *                  - Contact 기본 정보 및 공개 상태 제공
 *                  - 현재 등록된 이력서 파일 정보 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record AdminContactDetailResponseDto(

        Long contactId,

        String heading,

        String description,

        String email,

        String githubUrl,

        String linkedinUrl,

        String resumeLabel,

        String resumeFileUrl,

        String resumeOriginalFileName,

        boolean published,

        LocalDateTime createdAt,

        LocalDateTime updatedAt

) {

    public static AdminContactDetailResponseDto from(
            ContactEntity contact
    ) {
        return new AdminContactDetailResponseDto(
                contact.getContactId(),
                contact.getHeading(),
                contact.getDescription(),
                contact.getEmail(),
                contact.getGithubUrl(),
                contact.getLinkedinUrl(),
                contact.getResumeLabel(),
                contact.getResumeFileUrl(),
                contact.getResumeOriginalFileName(),
                contact.isPublished(),
                contact.getCreatedAt(),
                contact.getUpdatedAt()
        );
    }
}