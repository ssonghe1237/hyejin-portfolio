package com.hyejin.portfolio.domain.auth.dto;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.dto
 * fileName       : AdminLoginRequest.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 로그인 요청 DTO
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */
public record AdminLoginRequest(

        String username,

        String password

) {
}