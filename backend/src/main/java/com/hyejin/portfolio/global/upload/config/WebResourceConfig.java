package com.hyejin.portfolio.global.upload.config;

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
 *                  - /uploads/projects/** 요청을 실제 업로드 디렉토리와 연결
 *                  - 로컬 개발 및 Spring 단독 실행 환경에서 업로드 이미지 접근 지원
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 */


@Configuration
@RequiredArgsConstructor
public class WebResourceConfig implements WebMvcConfigurer {

    private final UploadProperties uploadProperties;


    /**
     * WebMvcConfigurer의 정적 리소스 핸들러 설정 메서드 재정의
     * 브라우저의 URL 요청 패턴과 실제 서버 하드디스크의 파일 경로를 1:1로 매핑
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry){
        // 브라우저 접근 URL 패턴 정규화
        String resourceHandler =
                normalizeResourceHandler(
                        uploadProperties.getImageUrlPrefix()
                );

        // 서버의 실제 물리적 디렉토리 경로 정규화
        String resourceLocation =
                normalizedResourceLocation(
                        uploadProperties.getImageDirectory()
                );

        // 리소스 핸들러 등록
        // : 지정한 URL 패턴으로 요청이 들어오면 해당 물리적 경로에서 파일을 찾아 반환
        registry.addResourceHandler(resourceHandler)
                .addResourceLocations(resourceLocation);
    }

    // 헬퍼 메서드 =====================================================================
    // 브라우저 접근 URL 패턴 정규화
    // 요청 URL: uploads/projects/2026/07/uuid.png => /uploads/projects/** 로 정규화
    private String normalizeResourceHandler(String imageUrlPrefix) {
        String normalizedPrefix = imageUrlPrefix.endsWith("/")
                ? imageUrlPrefix.substring(0, imageUrlPrefix.length()-1)
                : imageUrlPrefix;

        // /** : 스프링의 패턴 매칭 기호
        return normalizedPrefix + "/**";
    }

    // 서버의 실제 물리적 디렉토리 경로 정규화
    // 실제 파일: 프로젝트실행경로/uploads/projects/2026/07/uuid.png => file:/.../uploads/projects/
    private String normalizedResourceLocation(String imageDirectory) {
        String resourceLocation = Path.of(imageDirectory)
                .toAbsolutePath() // 상대 경로를 서버 전체 절대 경로로 변환
                .normalize()      // 폴더 기호 정리
                .toUri()          // 파일 시스템 경로를 URI 프로토콜 형태로 변환 (e.g., file:///...)
                .toString();

        return resourceLocation.endsWith("/")
                ? resourceLocation
                : resourceLocation + "/";
    }

}
