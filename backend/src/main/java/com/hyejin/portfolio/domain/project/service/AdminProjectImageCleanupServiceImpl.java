package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.repository.ProjectImageRepository;
import com.hyejin.portfolio.global.upload.service.ImageStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : AdminProjectImageCleanupServiceImpl
 * author         : Song
 * date           : 2026-07-30
 * description    : 관리자 프로젝트 임시 이미지 정지 Service 구현체
 *                  - project_images 테이블의 imageUrl 사용 여부 확인
 *                  - 프로젝트에서 용하지 않는 실제 이미지 파일 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-30        Song       최초 생성
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminProjectImageCleanupServiceImpl implements AdminProjectImageCleanupService {

    private final ProjectImageRepository imageRepository;
    private final ImageStorageService imageStorageService;

    // 프로젝트 DB에서 사용하지 않는 임시 이미지 파일 삭제
    @Override
    public void deletedTemporaryImage(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "삭제할 이미지 URL은 필수입니다."
            );
        }

        // usedByProject : 프로젝트에서 사용 중인지 이미지 인지 확인
        String normalizedImageUrl = imageUrl.trim();
        boolean usedByProject = imageRepository.existsByImageUrl(normalizedImageUrl);

        // usedByProject(true)인 경우 에러 메시지 송출
        if (usedByProject) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "프로젝트에서 사용 중인 이미지 파일은 임시 삭제할 수 없습니다."
            );
        }

        // usedByProject(false)인 경우 이미지 삭제
        boolean deleted = imageStorageService.delete(
                normalizedImageUrl
        );

        // 파일이 이미 존재하지 않는 경우에도 최종 상태는 '삭제됨'과 동일하므로 예외로 처리하지 않음
        if (!deleted) {
            log.info(
                    "임시 이미지 파일이 이미 존재하지 않습니다. imageUrl={}",
                    normalizedImageUrl
            );
        }
    }
}
