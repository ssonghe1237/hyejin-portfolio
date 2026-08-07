package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.domain.about.dto.AboutCompetencyResponseDto;
import com.hyejin.portfolio.domain.about.dto.AboutResponseDto;
import com.hyejin.portfolio.domain.about.entity.AboutCompetencyEntity;
import com.hyejin.portfolio.domain.about.entity.AboutEntity;
import com.hyejin.portfolio.domain.about.repository.AboutCompetencyRepository;
import com.hyejin.portfolio.domain.about.repository.AboutRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : AboutServiceImpl
 * author         : Song
 * date           : 2026-08-05
 * description    : 사용자 About 조회 Service
 *                  - 싱글턴 키와 공개 상태 기준 About 조회
 *                  - About 미등록 및 비공개 상태 404 처리
 *                  - 사용자 응답 DTO 변환
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-05        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
@Transactional (readOnly = true)
public class AboutServiceImpl implements AboutService {

    private final AboutRepository aboutRepository;
    private final AboutCompetencyRepository aboutCompetencyRepository;

    // 사용자 공개 About 조회
    @Override
    public AboutResponseDto getAbout() {
        AboutEntity about = aboutRepository
                .findBySingletonKeyAndPublishedTrue(
                AboutEntity.SINGLETON_KEY
                )
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "About 콘텐츠를 찾을 수 없습니다."
                        )
                );

        return AboutResponseDto.from(about);
    }

    // 사용자 공개 핵심 역량 목록 조회
    @Override
    public List<AboutCompetencyResponseDto> getCompetencies() {

        return aboutCompetencyRepository
                .findByAbout_SingletonKeyAndAbout_PublishedTrueOrderByDisplayOrderAscCompetencyIdAsc(AboutEntity.SINGLETON_KEY)
                .stream()
                .map(AboutCompetencyResponseDto::from)
                .toList();

    }
}
