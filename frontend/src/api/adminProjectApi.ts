/**
 * packageName    : frontend.src.api
 * fileName       : adminProjectApi.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 API 요청 모듈
 *                  - 관리자 프로젝트 목록 조회 API 호출
 *                  - 관리자 프로젝트 상세 조회 API 호출
 *                  - 관리자 프로젝트 등록 API 호출
 *                  - 관리자 프로젝트 수정 API 호출
 *                  - 백엔드 /api/admin/projects 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-09        Song       관리자 프로젝트 등록 API 추가
 * 2026-07-09        Song       관리자 프로젝트 수정 API 추가
 */


import type {
  AdminProjectCreateRequest,
  AdminProjectDetailResponse,
  AdminProjectListResponse,
  AdminProjectUpdateRequest,
} from '../types/project'

// 프로젝트 목록 전체 조회
export async function getAdminProjects() 
: Promise<AdminProjectListResponse> {
    const response = await fetch('/api/admin/projects')

    if(!response.ok) {
        throw new Error(
            `관리자 프로젝트 목록 조회 실패: ${response.status}`
        )
    }

    return response.json()
}

// 프로젝트 id 기준 프로젝트 상세 정보 조회
export async function getAdminProjectDetail (projectId: number)
: Promise<AdminProjectDetailResponse> {
    const response = await fetch(`/api/admin/projects/${projectId}`)

    if(!response.ok) {
        throw new Error(
            `관리자 프로젝트 상세 조회 실패: ${response.status}`
        )
    }

    return response.json()
}

// 프로젝트 등록
export async function createAdminProject(
    request:AdminProjectCreateRequest
): Promise<AdminProjectDetailResponse> {
    const response = await fetch('/api/admin/projects/', {
        method: 'POST',
        headers: {
            'Content-type' : 'aplication/json'
        },
        body: JSON.stringify(request),
    })

    if (!response.ok) {
        const errorBody = (await response
        .json()
        .catch(() => null)) as {
        message?: string
        detail?: string
    } | null

    throw new Error(
      errorBody?.message ??
        errorBody?.detail ??
        `관리자 프로젝트 등록 실패: ${response.status}`,
    )
  }

  return response.json()
}

// 관리자 프로젝트 수정
// @param projectId 수정할 프로젝트 ID
// @param request 프로젝트 수정 요청 데이터
// @returns 수정된 프로젝트 상세 정보
export async function updateAdminProject(
  projectId: number,
  request: AdminProjectUpdateRequest,
): Promise<AdminProjectDetailResponse> {
  const response = await fetch(`/api/admin/projects/${projectId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as {
      message?: string
      detail?: string
    } | null

    throw new Error(
      errorBody?.message ??
        errorBody?.detail ??
        `관리자 프로젝트 수정 실패: ${response.status}`,
    )
  }

  return response.json()
}