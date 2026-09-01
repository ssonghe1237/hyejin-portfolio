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
    <main>
      <section>
        <p>SONG HYEJIN / ADMIN</p>

        <h1>Admin Login</h1>

        <form onSubmit={handleSubmit}>

          <div>
            <label htmlFor="admin-username">
              ID
            </label>

            <input
              id="admin-username"
              type="text"
              value={username}
              autoComplete="username"
              onChange={(event) =>
                setUsername(event.target.value)
              }
            />
          </div>


          <div>
            <label htmlFor="admin-password">
              PASSWORD
            </label>

            <input
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
            <p role="alert">
              {errorMessage}
            </p>
          )}


          <button
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