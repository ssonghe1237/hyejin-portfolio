import type {
  AdminResearchCreateRequest,
  AdminResearchDetailResponse,
  AdminResearchListResponse,
  AdminResearchPublicationUpdateRequest,
  AdminResearchUpdateRequest,
} from '../types/research'

/**
 * packageName    : frontend.src.api
 * fileName       : adminResearchApi.ts
 * author         : Song
 * date           : 2026-08-04
 * description    : 관리자 Research API 요청 모듈
 *                  - 관리자 Research 목록 및 상세 조회
 *                  - 관리자 Research 등록 및 수정
 *                  - 관리자 Research 공개 상태 변경
 *                  - 관리자 Research 삭제
 *                  - 백엔드 /api/admin/research 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-04        Song               최초 생성
 */

interface ApiErrorResponse {
  detail?: string
  message?: string
  error?: string
}

/**
 * 실패한 API 응답에서 서버 오류 메시지를 추출한다.
 *
 * Spring Boot 오류 응답의 detail, message, error 값을 우선 확인하고,
 * 응답 본문을 읽지 못한 경우 상태 코드를 포함한 기본 메시지를 반환한다.
 */
async function throwApiError(
  response: Response,
  fallbackMessage: string,
): Promise<never> {
  let errorMessage =
    `${fallbackMessage}: ${response.status}`

  try {
    const errorResponse =
      await response.json() as ApiErrorResponse

    errorMessage =
      errorResponse.detail ??
      errorResponse.message ??
      errorResponse.error ??
      errorMessage
  } catch {
    // JSON 오류 응답이 아니면 상태 코드가 포함된 기본 메시지를 사용한다.
  }

  throw new Error(errorMessage)
}

// =====================================================================================
// 조회
// =====================================================================================

// 관리자 Research 전체 목록 조회
export async function getAdminResearchList():
Promise<AdminResearchListResponse[]> {
  const response = await fetch(
    '/api/admin/research',
  )

  if (!response.ok) {
    return throwApiError(
      response,
      '관리자 Research 목록을 불러오지 못했습니다.',
    )
  }

  return response.json()
}

// 관리자 Research ID 기준 상세 조회
export async function getAdminResearchDetail(
  researchId: number,
): Promise<AdminResearchDetailResponse> {
  const response = await fetch(
    `/api/admin/research/${researchId}`,
  )

  if (!response.ok) {
    return throwApiError(
      response,
      '관리자 Research 상세 정보를 불러오지 못했습니다.',
    )
  }

  return response.json()
}

// =====================================================================================
// 등록
// =====================================================================================

// 관리자 Research 게시글 등록
export async function createAdminResearch(
  request: AdminResearchCreateRequest,
): Promise<AdminResearchDetailResponse> {
  const response = await fetch(
    '/api/admin/research',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    return throwApiError(
      response,
      'Research 게시글을 등록하지 못했습니다.',
    )
  }

  return response.json()
}

// =====================================================================================
// 수정
// =====================================================================================

// 관리자 Research 게시글 수정
export async function updateAdminResearch(
  researchId: number,
  request: AdminResearchUpdateRequest,
): Promise<AdminResearchDetailResponse> {
  const response = await fetch(
    `/api/admin/research/${researchId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    return throwApiError(
      response,
      'Research 게시글을 수정하지 못했습니다.',
    )
  }

  return response.json()
}

// =====================================================================================
// 공개 상태 변경
// =====================================================================================

// 관리자 Research 공개/비공개 상태 변경
export async function updateAdminResearchPublication(
  researchId: number,
  published: boolean,
): Promise<AdminResearchDetailResponse> {
  const request: AdminResearchPublicationUpdateRequest = {
    published,
  }

  const response = await fetch(
    `/api/admin/research/${researchId}/publication`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    return throwApiError(
      response,
      'Research 공개 상태를 변경하지 못했습니다.',
    )
  }

  return response.json()
}

// =====================================================================================
// 삭제
// =====================================================================================

// 관리자 Research 게시글 삭제
export async function deleteAdminResearch(
  researchId: number,
): Promise<void> {
  const response = await fetch(
    `/api/admin/research/${researchId}`,
    {
      method: 'DELETE',
    },
  )

  if (!response.ok) {
    return throwApiError(
      response,
      'Research 게시글을 삭제하지 못했습니다.',
    )
  }
}