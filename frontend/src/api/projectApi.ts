/**
 * packageName    : frontend.src.api
 * fileName       : projectApi.ts
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 API 요청 모듈
 *                  - 프로젝트 유형별 목록 조회 API 호출
 *                  - 전체 공개 프로젝트 목록 조회 처리
 *                  - 프로젝트 상세 조회 API 호출
 *                  - 백엔드 /api/projects 엔드포인트와 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 목록/상세 조회 API 함수 추가
 * 2026-08-03        Song       전체 공개 프로젝트 목록 조회 함수 추가
 */

import type {
    ProjectDetailResponse,
    ProjectListResponse,
    ProjectType,
} from '../types/project'


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

// 전체 공ㄱ애 프로젝트 목록 조회
export async function getAllProjects() {
    const [teamProjects, personalProjects] = await Promise.all([
        getProjects('TEAM'),
        getProjects('PERSONAL')
    ])

    return [...teamProjects, ...personalProjects].sort(
        (firstProject, secondProject) => {
            const displayOrderComparison = 
            firstProject.displayOrder - secondProject.displayOrder

            if(displayOrderComparison !== 0) {
                return displayOrderComparison
            }

            return firstProject.projectId - secondProject.projectId
        }
    )
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