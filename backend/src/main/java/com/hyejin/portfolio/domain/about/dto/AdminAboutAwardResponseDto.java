package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutAwardEntity;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AdminAboutAwardResponseDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 관리자 About 수상 이력 응답 DTO
 */
public record AdminAboutAwardResponseDto(
        Long awardId, String title, String issuer, LocalDate awardedDate,
        String description, Integer displayOrder
) {
    public static AdminAboutAwardResponseDto from(AboutAwardEntity entity) {
        return new AdminAboutAwardResponseDto(entity.getAwardId(), entity.getTitle(), entity.getIssuer(),
                entity.getAwardedDate(), entity.getDescription(), entity.getDisplayOrder());
    }
}
