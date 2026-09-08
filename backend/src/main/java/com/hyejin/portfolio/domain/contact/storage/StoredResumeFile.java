package com.hyejin.portfolio.domain.contact.storage;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.storage
 * fileName       : StoredResumeFile
 * author         : Song
 * date           : 2026-08-07
 * description    : 저장 완료된 이력서 PDF 정보
 *                  - 사용자 접근 URL 제공
 *                  - 원본 및 실제 저장 파일명 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public record StoredResumeFile(

        String fileUrl,

        String originalFileName,

        String storedFileName

) {
}