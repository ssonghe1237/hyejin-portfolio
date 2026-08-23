package com.hyejin.portfolio.global.upload.config;

import com.hyejin.portfolio.global.config.ResumeUploadProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * packageName    : com.hyejin.portfolio.global.upload.config
 * fileName       : WebResourceConfig
 * author         : Song
 * date           : 2026-07-28
 * description    : 업로드 파일 정적 리소스 매핑 설정
 *                  - /uploads/projects/** 요청을 실제 이미지 업로드 디렉토리와 연결
 *                  - /uploads/resumes/** 요청을 실제 이력서 업로드 디렉토리와 연결
 *                  - 로컬 개발 및 Spring 단독 실행 환경에서 업로드 파일 접근 지원
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 * 2026-08-09        Song       이력서 PDF 정적 리소스 매핑 추가
 */

// WebMvcComfigurer
// : Spring Boot(Spring MVC)에서 기본 웹 MVC 설정을 커스텀(재정의)할 때 사용하는 인터페이스
// Spring가 해당 파일이 설정 클래스임을 인식하도록 선언
@Configuration
@RequiredArgsConstructor
public class WebResourceConfig implements WebMvcConfigurer {

    // 이미지 업로드 디렉토리와 연결
    private final UploadProperties uploadProperties;

    private final ProfileUploadProperties profileUploadProperties;

    private final SkillLogoUploadProperties skillLogoUploadProperties;

    // 이력서 업로드 디렉토리와 연결
    private final ResumeUploadProperties resumeUploadProperties;

    // 브라우저의 URL 요청 패턴과 실제 서버 하드디스크의 파일 경로를 매핑
    @Override
    public void addResourceHandlers(
            // ResourceHandlerRegistry
            // : [브라우저가 접근할 URL 패턴] 과 [실제 파일이 위치한 서버 내부/클래스패스/외부 경로]을 1:1 매핑
            ResourceHandlerRegistry registry
    ){
        // 프로젝트 이미지 정적 리소스 매핑
        registerResourceHandler(
                registry,
                uploadProperties.getImageUrlPrefix(),
                uploadProperties.getImageDirectory()
        );

        registerResourceHandler(
                registry,
                profileUploadProperties.getImageUrlPrefix(),
                profileUploadProperties.getImageDirectory()
        );

        registerResourceHandler(
                registry,
                skillLogoUploadProperties.getUrlPrefix(),
                skillLogoUploadProperties.getDirectory()
        );

        // 이력서 정적 리소스 매핑
        registerResourceHandler(
                registry,
                resumeUploadProperties.getUrlPrefix(),
                resumeUploadProperties.getDirectory()
        );
    }

    // =====================================================================
    // 헬퍼 메서드
    // ---------------------------------------------------------------------

    // 정적 리소스 매핑
    private void registerResourceHandler(
            ResourceHandlerRegistry registry,
            String urlPrefix,
            String directory
    ) {
        // 브라우저 접근 URL 패턴 정규화
        String resourceHandler =
                normalizeResourceHandler(
                        urlPrefix
                );

        // 서버의 실제 물리적 디렉토리 경로 정규화
        String resourceLocation =
                normalizeResourceLocation(
                        directory
                );

        registry.addResourceHandler(resourceHandler)
                .addResourceLocations(resourceLocation);
    }

    // 브라우저 접근 URL 패턴 정규화
    // : /uploads/projects/ => /uploads/projects/**
    private String normalizeResourceHandler(
            String urlPrefix
    ) {

        String normalizedPrefix =
                urlPrefix.endsWith("/")
                    ? urlPrefix.substring(
                            // /uploads/projects/ => /uploads/projects (마지막 / 제거)
                            0,
                            urlPrefix.length() -1
                      )
                    : urlPrefix;

        // /**
        // : 모든 하위 폴더와 파일 포함(N단계)
        return normalizedPrefix + "/**";
    }

    // 서버의 실제 물리적 디렉토리 경로 정규화
    private String normalizeResourceLocation(
            String directory
    ) {
        String resourceLocation =
                Path.of(directory)
                        .toAbsolutePath()
                        .normalize()
                        .toUri()
                        .toString();

        return resourceLocation.endsWith("/")
                ? resourceLocation
                : resourceLocation + "/";
    }

}
