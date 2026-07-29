package com.hyejin.portfolio.domain.project.event;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.event
 * fileName       : ProjectImageFilesDeleteEvent
 * author         : Song
 * date           : 2026-07-29
 * description    : 프로젝트 이미지 실제 파일 삭제 이벤트
 *                  - DB 트랜잭션 커밋 후 삭제할 imageUrl 전달
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-29        Song       최초 생성
 */
public record ProjectImageFilesDeleteEvent(
        List<String> imageUrls
) {
    public ProjectImageFilesDeleteEvent {
        imageUrls = imageUrls == null
                ? List.of()
                : List.copyOf(imageUrls);
    }
}