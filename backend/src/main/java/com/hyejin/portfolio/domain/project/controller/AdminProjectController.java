package com.hyejin.portfolio.domain.project.controller;

import com.hyejin.portfolio.domain.project.dto.AdminProjectDetailResponseDto;
import com.hyejin.portfolio.domain.project.dto.AdminProjectListResponseDto;
import com.hyejin.portfolio.domain.project.service.AdminProjectService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
