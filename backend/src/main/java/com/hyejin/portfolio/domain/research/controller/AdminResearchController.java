package com.hyejin.portfolio.domain.research.controller;

import com.hyejin.portfolio.domain.research.dto.*;
import com.hyejin.portfolio.domain.research.service.AdminResearchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.plaf.PanelUI;
import java.net.URI;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.research.controller
 * fileName       : AdminResearchController
 * author         : Song
 * date           : 2026-08-03
 * description    : 관리자 Research 게시글 관리 ControllerfindResearch
 *                  - 관리자 Research 전체 목록 조회
 *                  - 관리자 Research 상세 조회
 *                  - 관리자 Research 게시글 등록
 *                  - 관리자 Research 게시글 수정
 *                  - 관리자 Research 공개/비공개 처리
 *                  - 관리자 Research 게시글 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 * 2026-08-03        Song       관리자 목록 및 상세 조회 API 추가
 * 2026-08-03        Song       관리자 Research 수정 API 추가
 * 2026-08-03        Song       공개 상태 변경 및 삭제 API 추가
 */

@RestController
@RequestMapping("/api/admin/research")
@RequiredArgsConstructor
public class AdminResearchController {

    private final AdminResearchService adminResearchService;

    // 관리자 Research 전체 목록 조회
    @GetMapping
    public List<AdminResearchListResponseDto> getResearchList() {
        return adminResearchService.getResearchList();
    }

    // 관리자 Research ID 기준 게시글 상세 조회
    @GetMapping("/{researchId}")
    public AdminResearchDetailResponseDto getResearchDetail(
        @PathVariable Long researchId
    ) {
        return adminResearchService.getResearchDetail(
                researchId
        );
    }

    // 관리자 Research 게시글 등록
    @PostMapping
    public ResponseEntity<AdminResearchDetailResponseDto> createResearch (
            @Valid @RequestBody AdminResearchCreateRequestDto request
    ) {
        AdminResearchDetailResponseDto response =
                adminResearchService.createResearch(request);

        URI location = URI.create(
                "/api/admin/research/" + response.researchId()
        );

        return ResponseEntity
                .created(location)
                .body(response);
    }

    // 관리자 Research 게시글 수정
    @PutMapping("/{researchId}")
    public ResponseEntity<AdminResearchDetailResponseDto> updateResearch(
            @PathVariable Long researchId,
            @Valid @RequestBody AdminResearchUpdateRequestDto request
    ) {
        AdminResearchDetailResponseDto response =
                adminResearchService.updateResearch(researchId, request);

        return ResponseEntity.ok(response);
    }

    // 관리자 Research 공개.비공개 빠른 변경
    // 관리자 Research 공개/비공개 처리
    @PatchMapping("/{researchId}/publication")
    public ResponseEntity<AdminResearchDetailResponseDto> updateResearchPublication(
            @PathVariable Long researchId,
            @Valid @RequestBody AdminResearchPublicationUpdateRequestDto request
    ) {
        AdminResearchDetailResponseDto response =
                adminResearchService.updateResearchPublication(
                        researchId,
                        request
                );

        return ResponseEntity.ok(
                response
        );
    }

    // 관리자 Research 삭제
    // 관리자 Research 게시글 삭제
    @DeleteMapping("/{researchId}")
    public ResponseEntity<Void> deleteResearch(
            @PathVariable Long researchId
    ) {
        adminResearchService.deleteResearch(
                researchId
        );

        return ResponseEntity
                .noContent()
                .build();
    }

}
