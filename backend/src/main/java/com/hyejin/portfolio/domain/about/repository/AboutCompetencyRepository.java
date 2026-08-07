package com.hyejin.portfolio.domain.about.repository;

import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.repository
 * fileName       : AboutCompetencyRepository
 * author         : Song
 * date           : 2026-08-07
 * description    : About 핵심 역량 Repository
 *                  - 공개 About에 속한 핵심 역량 목록 조회
 *                  - Home 전용 경량 핵심 역량 조회에 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public interface AboutCompetencyRepository extends JpaRepository<AboutCompetencyEntity, Long> {

    List<AboutCompetencyEntity>
    findByAbout_SingletonKeyAndAbout_PublishedTrueOrderByDisplayOrderAscCompetencyIdAsc(
            String singletonKey
    );
}