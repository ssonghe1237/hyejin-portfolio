package com.hyejin.portfolio.global.upload.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.global.upload.config
 * fileName       : SkillLogoUploadProperties
 * author         : Song
 * date           : 2026-08-23
 * description    : 기술 로고 업로드 설정 Properties
 *                  - 기술 로고 저장 경로 및 URL prefix 설정 관리
 *                  - 파일 크기 및 고아 파일 정리 관련 설정 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-23        Song               최초 생성
 */
@Component
@ConfigurationProperties(prefix = "app.skill-logo-upload")
public class SkillLogoUploadProperties {
    private String directory;
    private String urlPrefix;
    private long maxSize;
    private boolean orphanCleanupEnabled;
    private long orphanRetentionHours;
    private String orphanCleanupCron;
    private String orphanCleanupZone;
    public String getDirectory() { return directory; }
    public void setDirectory(String directory) { this.directory = directory; }
    public String getUrlPrefix() { return urlPrefix; }
    public void setUrlPrefix(String urlPrefix) { this.urlPrefix = urlPrefix; }
    public long getMaxSize() { return maxSize; }
    public void setMaxSize(long maxSize) { this.maxSize = maxSize; }
    public boolean isOrphanCleanupEnabled() { return orphanCleanupEnabled; }
    public void setOrphanCleanupEnabled(boolean value) { this.orphanCleanupEnabled = value; }
    public long getOrphanRetentionHours() { return orphanRetentionHours; }
    public void setOrphanRetentionHours(long value) { this.orphanRetentionHours = value; }
    public String getOrphanCleanupCron() { return orphanCleanupCron; }
    public void setOrphanCleanupCron(String value) { this.orphanCleanupCron = value; }
    public String getOrphanCleanupZone() { return orphanCleanupZone; }
    public void setOrphanCleanupZone(String value) { this.orphanCleanupZone = value; }
}
