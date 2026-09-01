package com.hyejin.portfolio.domain.auth.controller;

import com.hyejin.portfolio.domain.auth.dto.AdminAuthResponse;
import com.hyejin.portfolio.domain.auth.dto.AdminLoginRequest;
import com.hyejin.portfolio.domain.auth.dto.CsrfTokenResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.controller
 * fileName       : AuthController.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 인증 Controller
 *                  - 관리자 로그인
 *                  - 현재 로그인 상태 조회
 *                  - 관리자 로그아웃
 *                  - CSRF Token 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final SecurityContextRepository securityContextRepository;

    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;

    // CSRF 토큰 조회
    @GetMapping("/csrf")
    public CsrfTokenResponse getCsrfToken(CsrfToken csrfToken) {

        return new CsrfTokenResponse(
                csrfToken.getToken(),
                csrfToken.getHeaderName(),
                csrfToken.getParameterName()
        );
    }

    // 관리자 로그인
    @PostMapping("/login")
    public ResponseEntity<AdminAuthResponse> login(
            @RequestBody AdminLoginRequest requestbody,
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        // Null/ Blank 입력 차단
        if (requestbody == null
            || requestbody.username() == null
            || requestbody.username().isBlank()
            || requestbody.password() == null
            || requestbody.password().isBlank()
        ) {
            return ResponseEntity
                    .badRequest()
                    .build();
        }

        try {
            // 아직 인증되지 않은 로그인 요청 Token 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                    UsernamePasswordAuthenticationToken.unauthenticated(
                            requestbody.username().trim(),
                            requestbody.password()
                    );

            /*
             * AuthenticationManager가 실제 인증 수행
             * 내부 흐름:
             *
             * [1] AuthenticationManager
             *      ↓
             * [2] UserDetailsService
             *      ↓
             * [3] AdminUserRepository
             *      ↓
             * [4] BCryptPasswordEncoder
             */

            // [1] AuthenticationManager
            // 입력 받은 평문 비밀번호와 db의 BCrypt 비밀번호를 자동으로 비교
            Authentication authentication =
                    authenticationManager.authenticate(authenticationToken);

            // 로그인 성공 후 SessionId 변경
            sessionAuthenticationStrategy.onAuthentication(
                    authentication,
                    request,
                    response
            );

            // [2] UserDetailsService
            // 인증 정보를 담은 새로운 SecurityContext 생성
            SecurityContext securityContext =
                    SecurityContextHolder.createEmptyContext();

            securityContext.setAuthentication(authentication);

            SecurityContextHolder.setContext(securityContext);

            // [3] AdminUserRepository
            // SecurityContext를 HttpSession에 명시적으로 저장
            // 다음 요청에서도 로그인 상태를 유지하기 위해 필요
            securityContextRepository.saveContext(
                    securityContext,
                    request,
                    response
            );

            return ResponseEntity.ok(
                    new AdminAuthResponse(
                            true,
                            authentication.getName(),
                            "ADMIN"
                    )
            );
        } catch (AuthenticationException exception) {

            // 원인 확인을 위한 로그 추가
            log.error("로그인 실패 원인: {}", exception.getMessage(), exception);
            /*
             * ID 존재 여부 / Password 오류 여부를
             * 외부에 구분해서 알려주지 않는다.
             *
             * 둘 다 동일하게 401 반환.
             */
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }
    }


    // 현재 관리자 인증 상태 조회
    @GetMapping("/me")
    public ResponseEntity<AdminAuthResponse> me(
            Authentication authentication
    ) {

        if (authentication == null
                || authentication instanceof AnonymousAuthenticationToken
                || !authentication.isAuthenticated()) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .build();
        }

        boolean isAdmin = authentication
                .getAuthorities()
                .stream()
                .anyMatch(authority ->
                        Objects.equals(
                                authority.getAuthority(),
                                "ROLE_ADMIN"
                        )
                );

        if (!isAdmin) {

            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .build();
        }

        return ResponseEntity.ok(
                new AdminAuthResponse(
                        true,
                        authentication.getName(),
                        "ADMIN"
                )
        );
    }


    // 관리자 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {

        SecurityContextLogoutHandler logoutHandler =
                new SecurityContextLogoutHandler();

        logoutHandler.logout(
                request,
                response,
                authentication
        );

        return ResponseEntity.noContent().build();
    }

}
