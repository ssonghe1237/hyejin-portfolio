import type {
    ProjectDetailResponse,
    ProjectListResponse,
    ProjectType,
} from '../types/project'

/**
 * packageName    : frontend.src.api
 * fileName       : projectApi.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 API 요청 모듈
 *                  - 프로젝트 목록 조회 API 호출
 *                  - 프로젝트 상세 조회 API 호출
 *                  - 백엔드 /api/projects 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 목록/상세 조회 API 함수 추가
 */

// 프로젝트 유형별 목록 조회
export async function getProjects(
    projectType:ProjectType,
) : Promise<ProjectListResponse[]> {
    const response = await fetch(`/api/projects?projectType=${projectType}`)

    if(!response.ok) {
        throw new Error(`프로젝트 목록 조회 실패: ${response.status}`)
    }

    return response.json()
}

// 프로젝트 상세 조회
export async function getProjectDetail(
    slug : string
) : Promise<ProjectDetailResponse> {
    const response = await fetch(`/api/projects/${slug}`)

    if(!response.ok) {
        throw new Error(`프로젝트 상세 조회 실패: ${response.status}`)
    }

    return response.json()
}