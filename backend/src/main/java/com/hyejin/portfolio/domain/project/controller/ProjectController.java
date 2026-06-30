package com.hyejin.portfolio.domain.project.controller;

import com.hyejin.portfolio.domain.project.dto.ProjectDetailResponseDto;
import com.hyejin.portfolio.domain.project.dto.ProjectListResponseDto;
import com.hyejin.portfolio.domain.project.entity.ProjectType;
import com.hyejin.portfolio.domain.project.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.controller
 * fileName       : ProjectController
 * author         : Song
 * date           : 2026-06-25
 * description    : 프로젝트 사용자 조회 API Controller
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 * 2026-06-25        Song       service 연결
 */

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    // service 선언
    private final ProjectService projectService;

    // 프로젝트 유형별 목록 조회
    // 예) GET /api/projects?projectType=TEAM
    @GetMapping
    public List<ProjectListResponseDto> getProjects(
            @RequestParam ProjectType projectType
    ) {
        return projectService.getProjects(projectType);
    }

    // 프로젝트 상세 조회
    // 예) GET /api/projects/corework
    @GetMapping("/{slug}")
    public ProjectDetailResponseDto getProjectDetail(
            @PathVariable String slug
    ) {
        return projectService.getProjectDetail(slug);
    }

}
