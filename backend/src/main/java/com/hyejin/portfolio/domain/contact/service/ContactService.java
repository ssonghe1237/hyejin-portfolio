package com.hyejin.portfolio.domain.contact.service;

import com.hyejin.portfolio.domain.contact.dto.ContactResponseDto;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.service
 * fileName       : ContactService
 * author         : Song
 * date           : 2026-08-07
 * description    : 사용자 Contact 조회 Service 인터페이스
 *                  - 공개 상태의 Contact 콘텐츠 조회
 *                  - 미등록 또는 비공개 Contact 접근 차단
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public interface ContactService {

    // 사용자 공개 Contact 조회
    ContactResponseDto getContact();
}