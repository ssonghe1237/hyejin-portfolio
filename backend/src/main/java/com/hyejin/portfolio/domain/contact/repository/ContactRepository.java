package com.hyejin.portfolio.domain.contact.repository;

import com.hyejin.portfolio.domain.contact.entity.ContactEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.repository
 * fileName       : ContactRepository
 * author         : Song
 * date           : 2026-08-07
 * description    : Contact 페이지 Repository
 *                  - 싱글턴 키 기준 관리자 Contact 조회
 *                  - 공개 상태의 사용자 Contact 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */
public interface ContactRepository
        extends JpaRepository<ContactEntity, Long> {

    // 관리자 Contact 조회
    Optional<ContactEntity> findBySingletonKey(
            String singletonKey
    );

    // 사용자 공개 Contact 조회
    Optional<ContactEntity> findBySingletonKeyAndPublishedTrue(
            String singletonKey
    );
}