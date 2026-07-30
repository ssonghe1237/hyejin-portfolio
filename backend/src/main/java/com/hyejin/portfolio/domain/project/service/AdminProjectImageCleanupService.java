package com.hyejin.portfolio.domain.project.service;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : AdminProjectImageCleanupService
 * author         : Song
 * date           : 2026-07-30
 * description    : 관리자 프로젝트 임시 이미지 정리 Service
 *                  - 프로젝트 DB에 등록되지 않은 임시 이미지 파일 삭제
 *                  - 프로젝트에서 사용 중인 이미지 파일 삭제 방지
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-30        Song       최초 생성
 */

public interface AdminProjectImageCleanupService {

    //프로젝트 DB에서 사용하지 않는 임시 이미지 파일 삭제
    // : @param imageUrl 이미지 업로드 API가 반환한 관리 이미지 URL
    void deletedTemporaryImage (
            String imageUrl
    );

}
