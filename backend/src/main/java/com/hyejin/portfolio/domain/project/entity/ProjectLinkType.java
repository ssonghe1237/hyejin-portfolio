package com.hyejin.portfolio.domain.project.entity;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectLinkType
 * author         : Song
 * date           : 2026-06-26
 * description    : 프로젝트 링크 유형 정의 Enum
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-26        Song       최초 생성
 */

public enum ProjectLinkType {
    GITHUB,     // GitHub Repository
    DEPLOY,     // 배포 URL
    PDF,        // 포트폴리오 PDF
    NOTION,     // Notion 문서
    RESUME,     // 이력서
    SARAMIN,    // 사람인 링크
    ETC         // 기타 링크
}
