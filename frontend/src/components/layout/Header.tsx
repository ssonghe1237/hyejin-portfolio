/**
 * packageName    : frontend.src.components.layout
 * fileName       : Header.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 헤더 전용 컴포넌트
 *                  - 포트폴리오 사이트 상단 브랜드 영역 출력
 *                  - 주요 페이지 네비게이션 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 * 2026-08-03        Song               사용자 페이지 네비게이션 구조 변경
 */

import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

const navigationItems = [
  { label: 'Home', to: '/', end: true },
  { label: 'Work', to: '/work', end: false },
  { label: 'About', to: '/about', end: false },
  { label: 'Get in touch', to: '/contact', end: false },
]

function Header() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !menuRef.current) {
        return
      }

      const focusableElements = Array.from(
        menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      )

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  function closeMenu(restoreFocus = false) {
    setIsMenuOpen(false)

    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        menuButtonRef.current?.focus()
      })
    }
  }

  if (isAdminRoute) {
    return (
      <header className={styles.adminHeader}>
        <div className={styles.adminInner}>
          <NavLink to="/" className={styles.adminBrand}>
            SONG HYEJIN
          </NavLink>

          <nav aria-label="주요 메뉴" className={styles.adminNav}>
            {navigationItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.adminNavLink} ${styles.adminNavLinkActive}`
                    : styles.adminNavLink
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand}>
          SONG HYEJIN
        </NavLink>

        <nav aria-label="주요 메뉴" className={styles.desktopNav}>
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? `${styles.navLink} ${styles.navLinkActive}`
                  : styles.navLink
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className={styles.menuButton}
          aria-expanded={isMenuOpen}
          aria-controls="public-mobile-navigation"
          aria-label="주요 메뉴 열기"
          onClick={() => setIsMenuOpen(true)}
        >
          MENU
        </button>
      </div>

      {isMenuOpen && (
        <div
          ref={menuRef}
          id="public-mobile-navigation"
          className={styles.mobileMenu}
        >
          <div className={styles.mobileMenuHeader}>
            <NavLink
              to="/"
              className={styles.mobileBrand}
              onClick={() => closeMenu()}
            >
              SONG HYEJIN
            </NavLink>

            <button
              ref={closeButtonRef}
              type="button"
              className={styles.closeButton}
              aria-label="주요 메뉴 닫기"
              onClick={() => closeMenu(true)}
            >
              CLOSE
            </button>
          </div>

          <nav aria-label="모바일 주요 메뉴" className={styles.mobileNav}>
            {navigationItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => closeMenu()}
                className={({ isActive }) =>
                  isActive
                    ? `${styles.mobileNavLink} ${styles.mobileNavLinkActive}`
                    : styles.mobileNavLink
                }
              >
                <span className={styles.mobileNavNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
