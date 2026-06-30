package com.hyejin.portfolio.domain.project.entity;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectImageType
 * author         : Song
 * date           : 2026-06-26
 * description    : 프로젝트 이미지 유형 정의 Enum 클래스
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-26        Song       최초 생성
 */

public enum ProjectImageType {
    THUMBNAIL,      // work 메인 카드 썸네일
    MAIN,           // 상세 페이지 대표 이미지
    DETAIL,         // 상세 설명용 일반 이미지
    ERD,            // ERD 이미지
    ARCHITECTURE,   // 아키텍처 이미지
    SCREENSHOT      // 화면 캡쳐 이미지
}
