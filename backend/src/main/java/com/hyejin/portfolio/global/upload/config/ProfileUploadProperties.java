package com.hyejin.portfolio.global.upload.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.global.upload.config
 * fileName       : ProfileUploadProperties
 * author         : Song
 * date           : 2026-08-21
 * description    : 프로필 이미지 업로드 설정 Properties
 *                  - 업로드 이미지 저장 디렉토리 관리
 *                  - 업로드 이미지 공개 URL prefix 관리
 *                  - 업로드 이미지 최대 크기 관리
 *                  - DB 미참조 고아 이미지 정리 정책 관리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-21        Song       최초 생성
 */

@Component
@ConfigurationProperties(prefix = "app.profile-upload")
public class ProfileUploadProperties {

    private String imageDirectory;
    private String imageUrlPrefix;
    private long maxImageSize;
    private boolean orphanCleanupEnabled;
    private long orphanRetentionHours;
    private String orphanCleanupCron;
    private String orphanCleanupZone;

    // Getter Setter
    public String getImageDirectory() { return imageDirectory; }
    public void setImageDirectory(String imageDirectory) {this.imageDirectory = imageDirectory;}

    public String getImageUrlPrefix() { return imageUrlPrefix; }
    public void setImageUrlPrefix(String imageUrlPrefix) { this.imageUrlPrefix = imageUrlPrefix; }

    public long getMaxImageSize() { return maxImageSize; }
    public void setMaxImageSize(long maxImageSize) { this.maxImageSize = maxImageSize; }

    public boolean isOrphanCleanupEnabled() { return orphanCleanupEnabled; }
    public void setOrphanCleanupEnabled(boolean orphanCleanupEnabled) { this.orphanCleanupEnabled = orphanCleanupEnabled; }

    public long getOrphanRetentionHours() { return orphanRetentionHours; }
    public void setOrphanRetentionHours(long orphanRetentionHours) { this.orphanRetentionHours = orphanRetentionHours; }

    public String getOrphanCleanupCron() { return orphanCleanupCron; }
    public void setOrphanCleanupCron(String orphanCleanupCron) { this.orphanCleanupCron = orphanCleanupCron; }

    public String getOrphanCleanupZone() { return orphanCleanupZone; }
    public void setOrphanCleanupZone(String orphanCleanupZone) { this.orphanCleanupZone = orphanCleanupZone; }
}
