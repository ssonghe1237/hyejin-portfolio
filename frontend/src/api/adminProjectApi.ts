/**
 * packageName    : frontend.src.api
 * fileName       : adminProjectApi.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 API 요청 모듈
 *                  - 관리자 프로젝트 목록 조회 API 호출
 *                  - 관리자 프로젝트 상세 조회 API 호출
 *                  - 백엔드 /api/admin/projects 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import type { AdminProjectDetailResponse, AdminProjectListResponse } from "../types/project";

// 프로젝트 리스트 전체 조회
export async function getAdminProjects(): Promise<AdminProjectListResponse[]> {
    const response = await fetch("/api/admin/projects")
    
    if(!response.ok) {
        throw new Error(`관리자 프로젝트 목록 조회 실패 ${response.status}`)
    }

    return response.json()
}

// 프로젝트 ID 기준 프로젝트 상세 정보 조회
export async function getAdminProjectDetail(projectId : number): Promise<AdminProjectDetailResponse> {
    const response = await fetch(`/api/admin/projects/${projectId}`)

    if(!response.ok) {
        throw new Error(`관리자 프로젝트 상세 조회 실패: ${response.status}`)
    }

    return response.json()
}