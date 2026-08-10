package com.hyejin.portfolio.domain.contact.storage;

import org.springframework.web.multipart.MultipartFile;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.storage
 * fileName       : ResumeStorageService
 * author         : Song
 * date           : 2026-08-07
 * description    : 이력서 PDF 파일 저장 Service 인터페이스
 *                  - PDF 검증 및 외부 디렉터리 저장
 *                  - 관리 대상 이력서 URL 검증
 *                  - 저장된 PDF 파일 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public interface ResumeStorageService {

    // 이력서 PDF 저장
    StoredResumeFile store(
            MultipartFile file
    );

    // 관리 대상 URL 검증
    void validateManagedResumeUrl(
            String fileUrl
    );

    // 이력서 PDF 삭제
    void delete(
            String fileUrl
    );
}