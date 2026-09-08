package com.hyejin.portfolio.global.upload.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.global.upload.config
 * fileName       : UploadProperties
 * author         : Song
 * date           : 2026-07-28
 * description    : 이미지 업로드 설정 Properties
 *                  - 업로드 이미지 저장 디렉토리 관리
 *                  - 업로드 이미지 공개 URL prefix 관리
 *                  - 업로드 이미지 최대 크기 관리
 *                  - DB 미참조 고아 이미지 정리 정책 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 * 2026-07-30        Song       고아 이미지 정리 설정 추가
 */

@Component
@ConfigurationProperties(prefix = "app.upload")
public class UploadProperties {
    /* 실제 파일 저장 경로
        예시)
        개발: C:/portfolio/uploads/
        배포: /opt/portfolio/uploads/
        => 사용 위치 Service에서 file.transferTo() 호출 시 위치 지정
    * **/
    // ${IMAGE_UPLOAD_DIR:./upload/projects}
    private String imageDirectory;

    /* 브라우저 접근용 이미지 URL Prefix
        예시) /uploads/projects
        => 웹 브라우저에서 <img src="/uploads/projects/2026/07/uuid.jpg" /> 형태로 접근할 때 사용
     */
    private String imageUrlPrefix;

    /* 업로드 허용 최대 파일 크기
        서비스단에서 업로드된 파일의 크기(file.getSize())를 검증할 때 사용하는 최대 바이트 단위 값
    * */
    private long maxImageSize;

    // ==========================================================================
    // 고아 이미지
    // --------------------------------------------------------------------------
    // 고아 이미지 정리 스케줄러 활성화 여부
    private boolean orphanCleanupEnabled;

    // 업로드 후 DB에 참조되지 않은 상태로 유지할 최소 시간 => 단위 hour
    private long orphanRetentionHours;

    // 고아 이미지 정리 실행 주기
    private String orphanCleanupCron;

    // 고아 이미지 정리 스케줄러 시간대 => 예시) Asian/Seoul
    private String orphanCleanupZone;

    // ==================== Getter / Setter 메서드 ====================
    // Spring Boot가 application.yml 값을 필드에 넣어줄 때(Setter)와  => @ConfigurationProperties(prefix = "app.upload") 선언으로 1:1매핑
    // 외부 Service/Config 클래스에서 설정값을 가져와 쓸 때(Getter) 사용됩니다. => @Component을 통해 Bean으로 등록되어 다른 곳에서 사용 가능

    public String getImageDirectory() {
        return imageDirectory;
    }

    public void setImageDirectory(String imageDirectory) {
        this.imageDirectory = imageDirectory;
    }

    public String getImageUrlPrefix() {
        return imageUrlPrefix;
    }

    public void setImageUrlPrefix(String imageUrlPrefix) {
        this.imageUrlPrefix = imageUrlPrefix;
    }

    public long getMaxImageSize() {
        return maxImageSize;
    }

    public void setMaxImageSize(long maxImageSize) {
        this.maxImageSize = maxImageSize;
    }

    public boolean isOrphanCleanupEnabled() {
        return orphanCleanupEnabled;
    }

    public void setOrphanCleanupEnabled(boolean orphanCleanupEnabled) {
        this.orphanCleanupEnabled = orphanCleanupEnabled;
    }

    public long getOrphanRetentionHours() {
        return orphanRetentionHours;
    }

    public void setOrphanRetentionHours(long orphanRetentionHours) {
        this.orphanRetentionHours = orphanRetentionHours;
    }

    public String getOrphanCleanupCron() {
        return orphanCleanupCron;
    }

    public void setOrphanCleanupCron(String orphanCleanupCron) {
        this.orphanCleanupCron = orphanCleanupCron;
    }

    public String getOrphanCleanupZone() {
        return orphanCleanupZone;
    }

    public void setOrphanCleanupZone(String orphanCleanupZone) {
        this.orphanCleanupZone = orphanCleanupZone;
    }
}
