/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminProjectUpdatePage.tsx
 * author         : Song
 * date           : 2026-07-09
 * description    : 관리자 프로젝트 수정 페이지
 *                  - URL의 프로젝트 ID 확인
 *                  - 관리자 프로젝트 상세 정보 조회
 *                  - 상세 응답을 공통 프로젝트 폼 상태로 변환
 *                  - 공통 프로젝트 폼 컴포넌트를 사용한 수정 화면 출력
 *                  - 프로젝트 수정 API 호출
 *                  - 수정 완료 후 관리자 프로젝트 상세 페이지 이동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-09        Song       최초 생성
 */

import { useEffect, useState } from 'react'

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom'

import {
  getAdminProjectDetail,
  updateAdminProject,
} from '../../api/adminProjectApi'

import AdminProjectForm from '../../components/admin/project/AdminProjectForm'

import {
  toAdminProjectFormState,
  toAdminProjectUpdateRequest,
} from '../../mappers/adminProjectFormMapper'

import type {
  AdminProjectFormState,
} from '../../types/project'

import styles from './AdminProjectCreatePage.module.css'

function AdminProjectUpdatePage() {
  const navigate = useNavigate()

  const { projectId: projectIdParam } = useParams<{
    projectId: string
  }>()

  const projectId = Number(projectIdParam)

  const [initialForm, setInitialForm] =
    useState<AdminProjectFormState | null>(null)

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null)

  /**
   * 관리자 프로젝트 상세 정보를 조회
   *
   * URL에서 전달받은 projectId를 검증한 뒤
   * 상세 조회 API를 호출한다.
   *
   * 조회된 상세 응답은 공통 폼에서 사용할 수 있도록
   * AdminProjectFormState 타입으로 변환한다.
   */
  useEffect(() => {
    let cancelled = false

    async function loadProject() {
      if (
        !Number.isInteger(projectId) ||
        projectId <= 0
      ) {
        setErrorMessage(
          '유효하지 않은 프로젝트 ID입니다.',
        )
        setInitialForm(null)
        setLoading(false)

        return
      }

      try {
        setLoading(true)
        setErrorMessage(null)
        setInitialForm(null)

        const detail =
          await getAdminProjectDetail(projectId)

        if (cancelled) {
          return
        }

        const formState =
          toAdminProjectFormState(detail)

        setInitialForm(formState)
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(error)

        setErrorMessage(
          error instanceof Error
            ? error.message
            : '프로젝트 정보를 불러오지 못했습니다.',
        )

        setInitialForm(null)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProject()

    return () => {
      cancelled = true
    }
  }, [projectId])

  // 관리자 프로젝트 수정 요청을 처리
  // 공통 폼 상태를 수정 API 요청 형식으로 변환한 뒤 프로젝트 수정 API를 호출
  // 수정 성공 시 수정된 프로젝트의 관리자 상세 페이지로 이동
  async function handleUpdate(
    form: AdminProjectFormState,
  ) {

    if (
      !Number.isInteger(projectId) || projectId <= 0
    ) {
      setErrorMessage('유효하지 않은 프로젝트 ID입니다.',)

      return
    }

    try {
      setSubmitting(true)
      setErrorMessage(null)

      const request = toAdminProjectUpdateRequest(form)

      const result = await updateAdminProject(
        projectId,
        request,
      )

      navigate(
        `/admin/projects/${result.projectId}`,
      )
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : '프로젝트를 수정하지 못했습니다.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  // 프로젝트 상세 정보를 조회 중인 화면
  if (loading) {
    return (
      <div className={styles.page}>
        <p>프로젝트 정보를 불러오는 중입니다.</p>
      </div>
    )
  }

  // 프로젝트 상세 정보를 불러오지 못한 화면
  if (!initialForm) {
    return (
      <div className={styles.page}>
        <Link
          to="/admin/projects"
          className={styles.backLink}
        >
          ← 관리자 프로젝트 목록으로 돌아가기
        </Link>

        <header>
          <h1 className={styles.title}>
            Update Project
          </h1>

          <p className={styles.description}>
            프로젝트 정보를 불러올 수 없습니다.
          </p>
        </header>

        {errorMessage && (
          <div className={styles.error}>
            {errorMessage}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link
        to={`/admin/projects/${projectId}`}
        className={styles.backLink}
      >
        ← 관리자 프로젝트 상세로 돌아가기
      </Link>

      <header>
        <h1 className={styles.title}>
          Update Project
        </h1>

        <p className={styles.description}>
          프로젝트 기본 정보와 상세 콘텐츠를
          수정합니다.
        </p>
      </header>

      {errorMessage && (
        <div className={styles.error}>
          {errorMessage}
        </div>
      )}

      <AdminProjectForm
        key={projectId}
        mode="update"
        initialValue={initialForm}
        submitting={submitting}
        cancelTo={`/admin/projects/${projectId}`}
        onSubmit={handleUpdate}
      />
    </div>
  )
}

export default AdminProjectUpdatePage