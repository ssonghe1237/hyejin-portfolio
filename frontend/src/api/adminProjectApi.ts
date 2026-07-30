/**
 * packageName    : frontend.src.api
 * fileName       : adminProjectApi.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 API 요청 모듈
 *                  - 관리자 프로젝트 목록·상세 조회
 *                  - 관리자 프로젝트 등록·수정·삭제
 *                  - 프로젝트 공개 상태 변경
 *                  - 프로젝트 이미지 업로드
 *                  - 프로젝트 미등록 임시 이미지 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-09        Song       관리자 프로젝트 등록 API 추가
 * 2026-07-09        Song       관리자 프로젝트 수정 API 추가
 * 2026-07-24        Song       관리자 프로젝트 삭제 API 추가
 * 2026-07-25        Song       관리자 프로젝트 공개/비공개 API 추가
 * 2026-07-28        Song       관리자 이미지 등록 요청 API 추가
 * 2026-07-30        Song       관리자 임시 이미지 삭제 API 추가
 */

import type {
  AdminProjectCreateRequest,
  AdminProjectDetailResponse,
  AdminProjectListResponse,
  AdminProjectUpdateRequest,
  ImageUploadResponse,
} from '../types/project'

// 프로젝트 목록 전체 조회
export async function getAdminProjects() 
: Promise<AdminProjectListResponse[]> {
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

// 관리자 프로젝트 등록
export async function createAdminProject(
    request:AdminProjectCreateRequest,
): Promise<AdminProjectDetailResponse> {
    const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json'
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

// 관리자 프로젝트 공개/비공개
export async function updateAdminProjectPublication(
  projectId:number,
  published: boolean,
): Promise<AdminProjectDetailResponse> {
  const response = await fetch(`/api/admin/projects/${projectId}/publication`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published })
      }
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
          `관리자 프로젝트 공개 상태 변경 실패: ${response.status}`
    )
  }

  return response.json()
}

// 관리자 프로젝트 삭제
// @param projectId 삭제할 프로젝트 ID
export async function deleteAdminProject(
  projectId: number,
): Promise<void> {
  const response = await fetch(
    `/api/admin/projects/${projectId}`,
    {
      method: 'DELETE',
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
        `관리자 프로젝트 삭제 실패: ${response.status}`,
    )
  }
}

// 관리자 이미지 등록
export async function uploadAdminProjectImage(
  file: File
): Promise<ImageUploadResponse> {
  const formData = new FormData()

  formData.append('file', file)

  const response = await fetch(
    '/api/admin/project-images/upload',
    {
      method: 'POST',
      body: formData,
    },
  )

  if (!response.ok) {
    const errorBody = (await response.json().catch(() => null)) as {
      message?: string
      detail?: string
    } | null

    throw new Error(
      errorBody?.message ??
        errorBody?.detail ??
          `관리자 프로젝트 이미지 업로드 실패: ${response.status}`
    )
  }

  return response.json()
  
}

// 관리자 프로젝트 DB에서 사용하지 않는 임시 이미지 파일 삭제
export async function deleteTemporaryImage(
  imageUrl:string
): Promise<void>{
  const params = new URLSearchParams({
    imageUrl,
  })

  const response = await fetch(
    `/api/admin/project-images/temp?${params.toString()}`,
    {
      method: 'DELETE'
    }
  )

  if(!response.ok) {
    const errorBody = (await response
      .json()
      .catch(() => null)) as {
        message: string
        detail: string
      } | null

      throw new Error(
        errorBody?.message ??
          errorBody?.detail ??
            `관리자 프로젝트 임시 이미지 삭제 실패: ${response.status}`
      )
  }
}