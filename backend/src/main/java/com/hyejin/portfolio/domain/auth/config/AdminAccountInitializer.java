package com.hyejin.portfolio.domain.auth.config;

import com.hyejin.portfolio.domain.auth.entity.AdminRole;
import com.hyejin.portfolio.domain.auth.entity.AdminUserEntity;
import com.hyejin.portfolio.domain.auth.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.domain.auth.config
 * fileName       : AdminAccountInitializer.java
 * author         : Song
 * date           : 2026-08-26
 * description    : 최초 관리자 계정 Bootstrap
 *                  - 환경변수로 전달된 초기 관리자 계정을 생성
 *                  - 이미 동일한 username이 존재하면 생성하지 않음
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */
@Component
@RequiredArgsConstructor
public class AdminAccountInitializer implements ApplicationRunner {

    private final AdminUserRepository adminUserRepository;

    private final PasswordEncoder passwordEncoder;


    @Value("${app.admin.bootstrap.username:}")
    private String bootstrapUsername;


    @Value("${app.admin.bootstrap.password:}")
    private String bootstrapPassword;


    @Override
    public void run(ApplicationArguments args) {

        /*
         * Bootstrap 환경변수가 설정되지 않은 환경에서는
         * 아무 작업도 수행하지 않는다.
         */
        if (bootstrapUsername == null
                || bootstrapUsername.isBlank()
                || bootstrapPassword == null
                || bootstrapPassword.isBlank()) {

            return;
        }


        String username = bootstrapUsername.trim();


        /*
         * 이미 관리자 계정이 존재한다면
         * 비밀번호를 임의로 변경하거나 다시 생성하지 않는다.
         */
        if (adminUserRepository.existsByUsername(username)) {

            return;
        }


        AdminUserEntity adminUser =
                new AdminUserEntity(
                        username,
                        passwordEncoder.encode(bootstrapPassword),
                        AdminRole.ADMIN
                );


        adminUserRepository.save(adminUser);
    }
}