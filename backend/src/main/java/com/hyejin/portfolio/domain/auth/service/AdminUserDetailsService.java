package com.hyejin.portfolio.domain.auth.service;

import com.hyejin.portfolio.domain.auth.entity.AdminUserEntity;
import com.hyejin.portfolio.domain.auth.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.service
 * fileName       : AdminUserDetailsService.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 Spring Security 인증 사용자 조회 Service
 *                  - username 기준 관리자 계정 조회
 *                  - 관리자 Entity를 Spring Security UserDetails로 변환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

@Service
@RequiredArgsConstructor
public class AdminUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;

    // Spring Security가 로그인 인증 과정에서 호출
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        AdminUserEntity adminUser = adminUserRepository
                .findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "관리자 계정을 찾을 수 없습니다."
                        )
                );

        return User.builder()
                .username(adminUser.getUsername())
                .password(adminUser.getPasswordHash())

                /*
                 * roles("ADMIN")을 사용하면
                 * Spring Security가 내부적으로
                 *
                 * ROLE_ADMIN
                 *
                 * 권한으로 변환한다.
                 */
                .roles(adminUser.getRole().name())

                .disabled(!adminUser.isEnabled())

                .build();
    }
}
