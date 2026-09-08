package com.hyejin.portfolio.domain.contact.controller;

import com.hyejin.portfolio.domain.contact.dto.ContactResponseDto;
import com.hyejin.portfolio.domain.contact.service.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.controller
 * fileName       : ContactController
 * author         : Song
 * date           : 2026-08-07
 * description    : 사용자 Contact 조회 Controller
 *                  - 공개 Contact 콘텐츠 조회 API 제공
 *                  - Contact 연락 정보와 이력서 연결 정보 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    // 사용자 공개 Contact 조회
    @GetMapping
    public ContactResponseDto getContact() {
        return contactService.getContact();
    }
}