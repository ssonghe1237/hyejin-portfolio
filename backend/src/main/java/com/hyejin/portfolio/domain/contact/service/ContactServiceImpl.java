package com.hyejin.portfolio.domain.contact.service;

import com.hyejin.portfolio.domain.contact.dto.ContactResponseDto;
import com.hyejin.portfolio.domain.contact.entity.ContactEntity;
import com.hyejin.portfolio.domain.contact.repository.ContactRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.service
 * fileName       : ContactServiceImpl
 * author         : Song
 * date           : 2026-08-07
 * description    : 사용자 Contact 조회 Service
 *                  - 싱글턴 키와 공개 상태 기준 Contact 조회
 *                  - Contact 미등록 및 비공개 상태 404 처리
 *                  - 사용자 공개 Contact 응답 DTO 변환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContactServiceImpl
        implements ContactService {

    private final ContactRepository contactRepository;

    // 사용자 공개 Contact 조회
    @Override
    public ContactResponseDto getContact() {
        ContactEntity contact =
                contactRepository
                        .findBySingletonKeyAndPublishedTrue(
                                ContactEntity.SINGLETON_KEY
                        )
                        .orElseThrow(() ->
                                new ResponseStatusException(
                                        HttpStatus.NOT_FOUND,
                                        "Contact 콘텐츠를 찾을 수 없습니다."
                                )
                        );

        return ContactResponseDto.from(
                contact
        );
    }
}