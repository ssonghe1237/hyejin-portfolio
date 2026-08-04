/**
 * packageName    : frontend.src.pages
 * fileName       : WorkPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 목록 페이지
 *                  - 전체 공개 프로젝트 목록 조회
 *                  - Selected Work 및 More Work 구분
 *                  - 프로젝트 카드 컴포넌트를 통한 목록 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 유형별 목록 API 연동
 * 2026-07-02        Song       ProjectCard 컴포넌트 분리 적용
 * 2026-07-02        Song       Work 페이지 소개 및 섹션 레이아웃 정리
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-08-03        Song       Selected Work 및 More Work 구조로 변경
 */

import { useEffect, useState } from 'react'
import { getAllProjects } from '../api/projectApi'
import { getRecentResearchList } from '../api/researchApi'
import WorkIntroSection from '../components/work/WorkIntroSection'
import WorkProjectSection from '../components/work/WorkProjectSection'
import type { ProjectListResponse } from '../types/project'
import type { ResearchListResponse } from '../types/research'
import styles from './WorkPage.module.css'
import WorkResearchSection from '../components/work/WorkResearchSection'

function WorkPage() {

  // ================================================================
  // hook
  // ----------------------------------------------------------------
  const [projects, setProjects] = useState<ProjectListResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [researchPosts, setResearchPosts] = useState<ResearchListResponse[]>([])
  const [researchLoading, setResearchLoading] = useState(true)
  const [researchErrorMessage, setResearchErrorMessage] = useState<string | null>(null)


  // ================================================================
  // useEffect
  // ----------------------------------------------------------------
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true)
        setErrorMessage(null)

        const result = await getAllProjects()

        setProjects(result)
      } catch (error) {
        console.error(error)
        setErrorMessage('프로젝트 목록을 불러오지 못했습니다.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect((() => {
    async function fetchResearchPosts() {
      try {
        setResearchLoading(true)
        setResearchErrorMessage(null)

        const response = await getRecentResearchList()

        setResearchPosts(response)
      }catch(error) {
        console.error(error)

        setResearchErrorMessage(
          'Researt 목록을 불러오지 못했습니다.'
        )
      } finally {
        setResearchLoading(false)
      }
    }

    fetchResearchPosts()
  }), [])

  const selectProjects = projects.slice(0,3)
  const moreProjects = projects.slice(3)

  if (loading) {
    return (
      <div className={styles.status}>
        프로젝트 목록을 불러오는 중입니다...
      </div>
    )
  }

  if (errorMessage) {
    return (
      <div className={styles.error}>
        {errorMessage}
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <WorkIntroSection />

      <WorkProjectSection
        title="Selected Work"
        description="문제 정의부터 구조 설계, 구현과 검증까지 직접 참여한 대표 프로젝트입니다."
        projects={selectProjects}
        emptyMessage="등록된 대표 프로젝트가 없습니다."
        columns={1}
      />

      <WorkResearchSection
        researchPosts={researchPosts}
        loading={researchLoading}
        errorMessage={researchErrorMessage}
      />

      <WorkProjectSection
        title="More Work"
        description="그 외 개인 프로젝트와 팀 프로젝트, 학습 과정에서 구현한 작업을 소개합니다."
        projects={moreProjects}
        emptyMessage="등록된 추가 프로젝트가 없습니다."
        columns={2}
      />
    </div>
  )
}

export default WorkPage