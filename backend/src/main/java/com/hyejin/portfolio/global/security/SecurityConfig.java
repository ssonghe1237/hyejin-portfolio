package com.hyejin.portfolio.global.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * packageName    : com.hyejin.portfolio.global.security
 * fileName       : SecurityConfig.java
 * author         : Song
 * date           : 2026-08-25
 * description    : Spring Security 공통 설정
 *                  - 사용자 공개 API 접근 허용
 *                  - 관리자 API 인증/인가 적용
 *                  - Session 기반 관리자 인증 구조 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-25        Song               최초 생성
 */

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
                // 관리자 로그인은 Session 기반 -> 인증 정보가 필요할 시에만 session 생성
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                )

                .authorizeHttpRequests(auth -> auth
                        // 로그인/ 로그아웃/ 인증 상태 api
                        .requestMatchers("/api/auth/**").permitAll()

                        // 서버 상태 확인
                        .requestMatchers("/api/health").permitAll()

                        // 사용자에게 공개되는 업로드 이미지 / 파일
                        .requestMatchers("/uploads/**").permitAll()

                        // 관리자 API
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // 일반 사용자 API
                        .requestMatchers("/api/**").permitAll()

                        // Backend에 남아 있는 기타 요청
                        .anyRequest().permitAll()
                )

                // React에서 자체 로그인 화면을 만들 예정이므로 Spring Security 기본 HTML 로그인 화면을 사용하지 않음
                .formLogin(form -> form.disable())

                // HTTP Basic 인증 사용 안함
                .httpBasic(basic -> basic.disable())

                /*
                 * 인증되지 않은 요청
                 * → 401 Unauthorized
                 *
                 * 권한이 부족한 요청
                 * → 403 Forbidden
                 *
                 * 브라우저 HTML redirect가 아니라
                 * REST API에 맞는 HTTP Status를 반환한다.
                 */
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) ->
                                response.sendError(
                                        HttpServletResponse.SC_UNAUTHORIZED
                                )
                        )
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                response.sendError(
                                        HttpServletResponse.SC_FORBIDDEN
                                )
                        )
                );


        return http.build();

    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
