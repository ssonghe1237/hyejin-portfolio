package com.hyejin.portfolio.global.upload.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/** About Skill Logo 전용 저장소와 고아 파일 정리 설정. @author Song */
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
