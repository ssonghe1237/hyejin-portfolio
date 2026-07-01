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