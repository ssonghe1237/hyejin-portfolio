package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.AdminAboutDetailResponseDto;
import com.hyejin.portfolio.domain.about.dto.AdminAboutUpsertRequestDto;

import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : AdminAboutService
 * author         : Song
 * date           : 2026-08-05
 * description    : 관리자 About 콘텐츠 Service 인터페이스
 *                  - 관리자 About 상세 조회
 *                  - About 기본 정보와 전체 섹션 생성·수정
 *                  - About 싱글턴 콘텐츠 upsert 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */
public interface AdminAboutService {

    // 관리자 About 상세 조회
    Optional<AdminAboutDetailResponseDto> getAbout();

    // 관리자 About 생성.수정
     AdminAboutDetailResponseDto upsertAbout (
             AdminAboutUpsertRequestDto request
    );

}
