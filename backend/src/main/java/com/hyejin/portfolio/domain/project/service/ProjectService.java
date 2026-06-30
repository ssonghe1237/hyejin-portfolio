package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.dto.ProjectDetailResponseDto;
import com.hyejin.portfolio.domain.project.dto.ProjectListResponseDto;
import com.hyejin.portfolio.domain.project.entity.ProjectType;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : ProjectService
 * author         : Song
 * date           : 2026-06-25
 * description    : 프로젝트 사용자 조회 Service
 *                  - 사용자 화면에서 필요한 프로젝트 목록/상세 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 * 2026-06-30        Song       목록/ 상세 조회 메서드 생성
 */
public interface ProjectService {

    // 프로젝트 유형별 공개 프로젝트 목록 조회
    public List<ProjectListResponseDto> getProjects(ProjectType projectType);

    // slug 기준 공개 프로젝트 상세 조회
    public ProjectDetailResponseDto getProjectDetail(String slug);

}
