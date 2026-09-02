/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminLoginPage.tsx
 * author         : Song
 * date           : 2026-08-26
 * description    : 관리자 로그인 페이지
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-26        Song               최초 생성
 */

import {
  useState,
  type FormEvent,
} from 'react'

import {
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'

import useAuth from '../../auth/useAuth'
import styles from './AdminLoginPage.module.css'


interface LoginLocationState {
  from?: string
}


function AdminLoginPage() {

  const navigate = useNavigate()
  const location = useLocation()

  const { status, login, } = useAuth()

  const [username, setUsername] = useState('')

  const [password, setPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const locationState = location.state as LoginLocationState | null

  const redirectPath = locationState?.from ?? '/admin/projects'


  if (status === 'authenticated') {
    return (
      <Navigate
        to="/admin/projects"
        replace
      />
    )
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {

    event.preventDefault()

    if (!username.trim() || !password) {

      setErrorMessage(
        '아이디와 비밀번호를 입력해주세요.',
      )

      return
    }


    try {

      setSubmitting(true)
      setErrorMessage('')

      await login({
        username: username.trim(),
        password,
      })

      navigate(
        redirectPath,
        {
          replace: true,
        },
      )

    } catch (error) {

      setErrorMessage(
        error instanceof Error
          ? error.message
          : '로그인에 실패했습니다.',
      )

    } finally {

      setSubmitting(false)
    }
  }


  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <p className={styles.brand}>
          SONG HYEJIN <span>/ ADMIN</span>
        </p>

        <h1 className={styles.title}>Admin Login</h1>

        <form
          className={styles.form}
          onSubmit={handleSubmit}
        >

          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="admin-username"
            >
              ID
            </label>

            <input
              className={styles.input}
              id="admin-username"
              type="text"
              value={username}
              autoComplete="username"
              onChange={(event) =>
                setUsername(event.target.value)
              }
            />
          </div>


          <div className={styles.field}>
            <label
              className={styles.label}
              htmlFor="admin-password"
            >
              PASSWORD
            </label>

            <input
              className={styles.input}
              id="admin-password"
              type="password"
              value={password}
              autoComplete="current-password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
            />
          </div>


          {errorMessage && (
            <p
              className={styles.error}
              role="alert"
            >
              {errorMessage}
            </p>
          )}


          <button
            className={styles.submitButton}
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'LOGIN...'
              : 'LOGIN'}
          </button>

        </form>
      </section>
    </main>
  )
}

export default AdminLoginPage
