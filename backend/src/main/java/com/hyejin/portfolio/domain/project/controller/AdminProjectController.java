package com.hyejin.portfolio.domain.project.controller;

import com.hyejin.portfolio.domain.project.dto.*;
import com.hyejin.portfolio.domain.project.service.AdminProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.controller
 * fileName       : AdminProjectController
 * author         : Song
 * date           : 2026-07-03
 * description    : 관리자 프로젝트 Controller
 *                  - 관리자 프로젝트 목록 조회
 *                  - 관리자 프로젝트 상세 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-03        Song       최초 생성
 * 2026-07-07        Song       프로젝트 등록 API 추가
 * 2026-07-09        Song       프로젝트 수정 API 추가
 * 2026-07-24        Song       프로젝트 삭제 API 추가
 * 2026-07-25        Song       프로젝트 공개/비공개 API 추가
 */

@RestController
@RequestMapping("/api/admin/projects")
@RequiredArgsConstructor
public class AdminProjectController {

    private final AdminProjectService adminProjectService;

    // 프로젝트 리스트 전체 조회
    @GetMapping
    public List<AdminProjectListResponseDto> getProjects() {
        return adminProjectService.getProjectList();
    }

    // 프로젝트 ID 기준 프로젝트 상세 정보 조회
    @GetMapping("/{projectId}")
    public AdminProjectDetailResponseDto getProjectDetail(
            @PathVariable Long projectId
    ) {
        return adminProjectService.getProjectDetail(projectId);
    }

    // 프로젝트 생성
    @PostMapping
    public ResponseEntity<AdminProjectDetailResponseDto> createProject(
            @Valid @RequestBody AdminProjectCreateRequestDto request
    ){
        AdminProjectDetailResponseDto response = adminProjectService.createProject(request);

        URI location = URI.create(
                "api/admin/projects/" + response.projectId()
        );

        return ResponseEntity
                .created(location)
                .body(response);

    }

    // 관리자 프로젝트 수정
    @PutMapping("/{projectId}")
    public ResponseEntity<AdminProjectDetailResponseDto> updateProject(
            @PathVariable Long projectId,
            @Valid @RequestBody AdminProjectUpdateRequestDto request
    ) {
        AdminProjectDetailResponseDto response =
                adminProjectService.updateProject(
                        projectId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // 프로젝트 공개/비공개 처리
    @PatchMapping("/{projectId}/publication")
    public ResponseEntity<AdminProjectDetailResponseDto> updateProjectPublication(
            @PathVariable Long projectId,
            @Valid @RequestBody AdminProjectPublicationUpdateRequestDto request
    ) {
        AdminProjectDetailResponseDto response =
                adminProjectService.updateProjectPublication(
                        projectId,
                        request
                );

        return ResponseEntity.ok(response);
    }

    // 관리자 프로젝트 삭제
    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(
            @PathVariable Long projectId
    ){
        adminProjectService.deleteProject(projectId);

        return ResponseEntity.noContent().build();
    }
}
