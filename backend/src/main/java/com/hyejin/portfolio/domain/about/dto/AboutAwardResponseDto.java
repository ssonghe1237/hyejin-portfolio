package com.hyejin.portfolio.domain.about.dto;

import com.hyejin.portfolio.domain.about.entity.AboutAwardEntity;
import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.about.dto
 * fileName       : AboutAwardResponseDto
 * author         : Song
 * date           : 2026-08-20
 * description    : 사용자 About 수상 이력 응답 DTO
 */
public record AboutAwardResponseDto(
        String title, String issuer, LocalDate awardedDate, String description, Integer displayOrder
) {
    public static AboutAwardResponseDto from(AboutAwardEntity entity) {
        return new AboutAwardResponseDto(entity.getTitle(), entity.getIssuer(), entity.getAwardedDate(),
                entity.getDescription(), entity.getDisplayOrder());
    }
}
