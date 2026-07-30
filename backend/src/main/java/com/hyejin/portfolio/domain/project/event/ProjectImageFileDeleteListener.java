package com.hyejin.portfolio.domain.project.event;

import com.hyejin.portfolio.global.upload.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/**
 * packageName    : com.hyejin.portfolio.domain.project.event
 * fileName       : ProjectImageFileDeleteListener
 * author         : Song
 * date           : 2026-07-29
 * description    : 프로젝트 이미지 실제 파일 삭제 이벤트 Listener
 *                  - DB 트랜잭션 커밋 성공 후 실제 로컬 파일 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-29        Song       최초 생성
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class ProjectImageFileDeleteListener {

    private final ImageStorageService imageStorageService;

    @TransactionalEventListener(
            phase = TransactionPhase.AFTER_COMMIT
    )
    public void deleteImageFiles(
            ProjectImageFilesDeleteEvent event
    ){
        for (String imageUrl : event.imageUrls()) {
            try {
                boolean deleted = imageStorageService.delete(
                        imageUrl
                );

                if (!deleted) {
                    log.warn(
                            "삭제할 이미지 파일이 존재하지 않습니다. imageUrl={ }",
                            imageUrl
                    );
                }
            } catch (RuntimeException exception) {
                /* DB 트랜젝션은 이미 커밋됐으므로 파일 하나의 삭제 실패가
                * 나머지 파일 삭제를 중단하지 않도록 예외를 기록하고 계속 진행한다 */
                log.error(
                        "프로젝트 이미지 실제 파일 삭제에 실패했습니다. imageUrl={ }",
                        imageUrl,
                        exception
                );
            }
        }
    }
}
