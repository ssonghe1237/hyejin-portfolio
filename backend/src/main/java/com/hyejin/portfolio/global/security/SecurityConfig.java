package com.hyejin.portfolio.global.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.session.ChangeSessionIdAuthenticationStrategy;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;

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
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            SecurityContextRepository securityContextRepository
    ) throws Exception {

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
                )

                // Spring Security 체인에서 인증정보(securityContext)를 세선에 어떻게 저장할 것인가를 세부 정의하는 설정 코드
                // securityContext = userDetail 정보를 담은 Authentication을 담은 상자
                .securityContext(securityContext ->
                        securityContext
                                .securityContextRepository(securityContextRepository) // 사용자가 인증에 성공하면 이 저장소를 사용해서 세션에 인증정보를 저장하거나 불러와
                                .requireExplicitSave(true)
                );


        return http.build();

    }

    // 사용자에게 입력 받은 비밀번호를 해싱하여 DB 값과 똑같은지 검증
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 사용자 조회 등 로그인 작업 전체를 지휘하는 최종 인증 처리기(아이디/ 비밀번호 검증)
    // UserDetails가 들어있는 Authentication 객체를 만들어 리턴
    @Bean
    public AuthenticationManager authenticationManager (
            AuthenticationConfiguration authenticationConfiguration
    ) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // 인증 완료된 SecurityContext를 Http 세션에 안전하게 보관하고
    // 다음 요청 시 자동으로 불러오도록 저장소(Repository)를 빈으로 등록
    @Bean
    public SecurityContextRepository securityContextRepository() {
        return new HttpSessionSecurityContextRepository();
    }

    // Session Fixation 방어
    /* 로그인 전

    JSESSIONID = ABC123
        ↓
    로그인 성공
        ↓
    Session ID 교체
        ↓
    JSESSIONID = XYZ789 */
    @Bean
    public SessionAuthenticationStrategy sessionAuthenticationStrategy() {
        return new ChangeSessionIdAuthenticationStrategy();
    }
}
