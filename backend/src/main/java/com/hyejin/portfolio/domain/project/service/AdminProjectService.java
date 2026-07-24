package com.hyejin.portfolio.domain.project.service;

import com.hyejin.portfolio.domain.project.dto.AdminProjectCreateRequestDto;
import com.hyejin.portfolio.domain.project.dto.AdminProjectDetailResponseDto;
import com.hyejin.portfolio.domain.project.dto.AdminProjectListResponseDto;
import com.hyejin.portfolio.domain.project.dto.AdminProjectUpdateRequestDto;

import java.util.List;

/**
 * packageName    : com.hyejin.portfolio.domain.project.service
 * fileName       : AdminProjectService
 * author         : Song
 * date           : 2026-07-03
 * description    : 관리자 프로젝트 Service
 *                  - 관리자 프로젝트 목록/상세 조회 기능 정의
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-03        Song       최초 생성
 * 2026-07-07        Song       프로젝트 등록 기능 추가
 * 2026-07-09        Song       프로젝트 수정 기능 추가
 * 2026-07-24        Song       프로젝트 삭제 기능 추가
 */

public interface AdminProjectService {

    // 프로젝트 리스트 전체 조회
    List<AdminProjectListResponseDto> getProjectList();

    // 프로젝트 ID 기준 프로젝트 상세 정보 조회
    AdminProjectDetailResponseDto getProjectDetail(Long projectId);

    // 프로젝트 등록
    AdminProjectDetailResponseDto createProject(
        AdminProjectCreateRequestDto request
    );

    // 프로젝트 수정
    AdminProjectDetailResponseDto updateProject(
            Long projectId,
            AdminProjectUpdateRequestDto request
    );

    // 프로젝트 삭제
    void deleteProject(Long projectId);


}
