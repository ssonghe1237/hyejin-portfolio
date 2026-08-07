package com.hyejin.portfolio.domain.about.repository;

import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.about.repository
 * fileName       : AboutRepository
 * author         : Song
 * date           : 2026-08-04
 * description    : About 콘텐츠 Repository
 *                  - 싱글턴 키 기준 관리자 About 조회
 *                  - 공개 상태의 사용자 About 조회
 *                  - About 조회 시 하위 섹션 함께 로딩
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song       최초 생성
 */
public interface AboutRepository extends JpaRepository<AboutEntity, Long> {

    // 관리자 About 및 하위 섹션 조회
    @EntityGraph(attributePaths = "sections")
    Optional<AboutEntity> findBySingletonKey(
            String singletonKey
    );

    // 사용자 공개 About 및 하위 섹션 조회
    @EntityGraph(attributePaths = "sections")
    Optional<AboutEntity> findBySingletonKeyAndPublishedTrue(
            String singletonKey
    );
}