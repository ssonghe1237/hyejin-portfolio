package com.hyejin.portfolio.domain.contact.service;

import com.hyejin.portfolio.domain.contact.dto.AdminContactDetailResponseDto;
import com.hyejin.portfolio.domain.contact.dto.AdminContactUpsertRequestDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.service
 * fileName       : AdminContactService
 * author         : Song
 * date           : 2026-08-07
 * description    : 관리자 Contact 콘텐츠 Service 인터페이스
 *                  - 관리자 Contact 상세 조회
 *                  - Contact 기본 정보 생성·수정
 *                  - Contact 싱글턴 콘텐츠 upsert 처리
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public interface AdminContactService {

    // 관리자 Contact 상세 조회
    Optional<AdminContactDetailResponseDto> getContact();

    // 관리자 Contact 생성·수정
    AdminContactDetailResponseDto upsertContact(
            AdminContactUpsertRequestDto request
    );

    // 관리자 이력서 PDF 업로드·교체
    AdminContactDetailResponseDto uploadResume(
            MultipartFile file
    );

    // 관리자 이력서 PDF 삭제
    void deleteResume();
}