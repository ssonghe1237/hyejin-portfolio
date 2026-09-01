package com.hyejin.portfolio.domain.auth.dto;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.dto
 * fileName       : CsrfTokenResponse.java
 * author         : Song
 * date           : 2026-08-26
 * description    : CSRF Token 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */
public record CsrfTokenResponse(

        String token,

        String headerName,

        String parameterName

) {
}