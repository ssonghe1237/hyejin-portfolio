package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.AboutCompetencyResponseDto;
import com.hyejin.portfolio.domain.about.dto.AboutResponseDto;
import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : AboutService
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 About 조회 Service 인터페이스
 *                  - 공개 상태의 About 콘텐츠 조회
 *                  - 미등록 또는 비공개 About 접근 차단
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */
public interface AboutService {

    // 사용자 공개 About 조회
    AboutResponseDto getAbout();

    // 사용자 공개 핵심 역량 목록 조회
    List<AboutCompetencyResponseDto> getCompetencies();
}