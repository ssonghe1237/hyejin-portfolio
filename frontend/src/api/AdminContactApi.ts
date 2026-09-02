/**
 * packageName    : frontend.src.api
 * fileName       : adminContactApi.ts
 * author         : Song
 * date           : 2026-08-09
 * description    : 관리자 Contact API
 *                  - 관리자 Contact 상세 조회
 *                  - Contact 기본 정보 생성·수정
 *                  - 이력서 PDF 업로드·교체·삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-09        Song               최초 생성
 */

import type {
    AdminContactDetailResponse,
    AdminContactUpsertRequest
} from '../types/contact';

import { apiFetch } from './apiClient'

interface ApiErrorResponse {
    message?: string
    detail?: string
    error?: string
}

async function throwApiError(
    response: Response,
    defaultMessage: string
): Promise<never> {
    let errorMessage = defaultMessage

    try {
        const errorBody =
            (await response.json()) as ApiErrorResponse

        errorMessage =
            errorBody.message ??
                errorBody.detail ??
                    errorBody.error ??
                        defaultMessage
    } catch {
        // 응답 Body가 json이 아닌 경우 기본 메시지 사용
    }

    throw new Error(errorMessage)
}

// 관리자 Contact 상세 조회
// : contact가 아직ㄷ 생성되지 않은 경우 Backend에서 204를 반환하므로 null 처리
export async function getAdminContact():
Promise<AdminContactDetailResponse | null> {
  const response = await fetch('/api/admin/contact')

  if (response.status === 204) {
    return null
  }

  if (!response.ok) {
    throwApiError(
      response,
      'Contact 정보를 불러오지 못했습니다.',
    )
  }

  return response.json()
}

// 관리자 Contact 생성·수정
export async function upsertAdminContact(
  request: AdminContactUpsertRequest,
): Promise<AdminContactDetailResponse> {
  const response = await apiFetch(
    '/api/admin/contact',
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
  )

  if (!response.ok) {
    throwApiError(
      response,
      'Contact 정보를 저장하지 못했습니다.',
    )
  }

  return response.json()
}

// 관리자 이력서 PDF 업로드·교체
export async function uploadContactResume(
  file:File
): Promise<AdminContactDetailResponse> {
  const formData = new FormData()

  formData.append(
    'file',
    file
  )

  const response = await apiFetch(
    '/api/admin/contact/resume',
    {
      method: 'POST',
      body: formData
    }
  )

  if(!response.ok) {
    throwApiError(
      response,
      '이력서 PDF를 업로드하지 못했습니다.',
    )
  }

  return response.json()
}

// 관리자 이력서 PDF 삭제
export async function deleteContactResume():Promise<void> {
  const response = await apiFetch(
    '/api/admin/contact/resume',
    {
      method: 'DELETE'
    }
  )

  if(!response.ok) {
    throwApiError(
      response,
      '이력서 PDF를 삭제하지 못했습니다.'
    )
  }
  
}