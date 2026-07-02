/**
 * packageName    : frontend.src.pages
 * fileName       : WorkPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 목록 페이지
 *                  - 팀 프로젝트 목록 조회
 *                  - 개인 프로젝트 목록 조회
 *                  - 프로젝트 카드 컴포넌트를 통한 목록 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 유형별 목록 API 연동
 * 2026-07-02        Song       ProjectCard 컴포넌트 분리 적용
 * 2026-07-02        Song       Work 페이지 소개 및 섹션 레이아웃 정리
 */

import { useEffect, useState } from 'react'
import { getProjects } from '../api/projectApi'
import WorkIntroSection from '../components/work/WorkIntroSection'
import WorkProjectSection from '../components/work/WorkProjectSection'
import type { ProjectListResponse } from '../types/project'

function WorkPage() {
  const [teamProjects, setTeamProjects] = useState<ProjectListResponse[]>([])
  const [personalProjects, setPersonalProjects] = useState<ProjectListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const [teamResult, personalResult] = await Promise.all([
          getProjects('TEAM'),
          getProjects('PERSONAL'),
        ])

        setTeamProjects(teamResult)
        setPersonalProjects(personalResult)
      } catch (error) {
        console.error(error)
        setErrorMessage('프로젝트 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          padding: '80px 0',
          color: '#777',
        }}
      >
        프로젝트 목록을 불러오는 중입니다...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div
        style={{
          padding: '80px 0',
          color: '#c0392b',
        }}
      >
        {errorMessage}
      </div>
    )
  }

  return (
    <div>
      <WorkIntroSection />

      <WorkProjectSection
        title="Team Project"
        description="교육 과정에서 팀 단위로 구현한 프로젝트입니다. 담당 기능과 백엔드 흐름을 중심으로 정리했습니다."
        projects={teamProjects}
        emptyMessage="등록된 팀 프로젝트가 없습니다."
      />

      <WorkProjectSection
        title="More stuff I made"
        description="개인적으로 설계하고 구현한 사이드 프로젝트와 실험적인 작업을 정리하는 영역입니다."
        projects={personalProjects}
        emptyMessage="등록된 개인 프로젝트가 없습니다."
      />
    </div>
  )
}

export default WorkPage