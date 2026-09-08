package com.hyejin.portfolio.domain.project.service;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : ProjectImageOrphanCleanupService
 * author         : Song
 * date           : 2026-07-30
 * description    : 프로젝트 고아 이미지 정리 Service
 *                  - 보관 시간을 초과한 이미지 파일 조회
 *                  - project_images DB 미참조 이미지 파일 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-30        Song       최초 생성
 */
public interface ProjectImageOrphanCleanupService {

    /**
     * 설정된 보관 시간을 초과한 이미지 중
     * project_images 테이블에서 참조하지 않는 파일을 삭제합니다.
     */
    void cleanupOrphanImages();
}