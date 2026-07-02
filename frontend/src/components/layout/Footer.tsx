/**
 * packageName    : frontend.src.components.layout
 * fileName       : Footer.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 공통 푸터 컴포넌트
 *                  - 포트폴리오 사이트 하단 정보 출력
 *                  - 저작권 및 간단한 소개 문구 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid #eee',
        marginTop: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '1120px',
          margin: '0 auto',
          padding: '32px 24px',
          color: '#777',
          fontSize: '14px',
        }}
      >
        <p style={{ margin: 0 }}>
          © 2026 Song Hyejin. Backend-focused portfolio.
        </p>
      </div>
    </footer>
  )
}

export default Footer