package com.hyejin.portfolio.global.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.global.config
 * fileName       : ResumeUploadProperties
 * author         : Song
 * date           : 2026-08-07
 * description    : 이력서 PDF 업로드 설정 Properties
 *                  - PDF 실제 저장 디렉터리 관리
 *                  - 사용자 접근 URL prefix 관리
 *                  - 이력서 최대 업로드 크기 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "app.resume-upload")
public class ResumeUploadProperties {

    // 실제 PDF 저장 디렉터리
    private String directory;

    // 브라우저 접근 URL prefix
    private String urlPrefix;

    // 최대 파일 크기(bytes)
    private long maxSize;


}