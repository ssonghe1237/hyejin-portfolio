package com.hyejin.portfolio.domain.auth.dto;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.dto
 * fileName       : AdminAuthResponse.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 인증 상태 응답 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */
public record AdminAuthResponse(

        boolean authenticated,

        String username,

        String role

) {
}