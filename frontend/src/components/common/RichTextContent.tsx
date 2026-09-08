/**
 * packageName    : frontend.src.components.common
 * fileName       : RichTextContent.tsx
 * author         : Song
 * date           : 2026-08-20
 * description    : 공통 Rich Text HTML 렌더링 컴포넌트
 *                  - 백엔드 RichTextHtmlSanitizer를 거친 HTML 문자열 렌더링
 *                  - 공통 Rich Text 스타일 적용
 *                  - dangerouslySetInnerHTML 사용 범위를 공통 컴포넌트 내부로 제한
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-20        Song               최초 생성
 */

import styles from './RichTextContent.module.css'

/**
 * RichTextContent 컴포넌트 Props
 *
 * @property html
 * 백엔드 RichTextHtmlSanitizer를 통해 정제된 HTML 문자열
 *
 * @property className
 * 기본 Rich Text 스타일 외에 추가로 적용할 CSS className
 */
interface RichTextContentProps {
  html: string
  className?: string
}

/**
 * 백엔드에서 sanitize된 Rich Text HTML을 사용자 화면에 렌더링합니다.
 *
 * `dangerouslySetInnerHTML`을 사용하는 공통 렌더러이며,
 * 반드시 Backend의 RichTextHtmlSanitizer를 거친 HTML만 전달해야 합니다.
 *
 * 클라이언트에서 직접 작성했거나 sanitize되지 않은 HTML을
 * 이 컴포넌트에 전달하면 XSS 위험이 있으므로 사용하지 않습니다.
 *
 * @param html 백엔드에서 sanitize된 Rich Text HTML 문자열
 * @param className 추가로 적용할 선택적 CSS className
 * @returns Rich Text HTML을 출력하는 JSX Element
 */
function RichTextContent({
  html,
  className,
}: RichTextContentProps) {
  const classNames = className
    ? `${styles.content} ${className}`
    : styles.content

  return (
    <div
      className={classNames}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default RichTextContent