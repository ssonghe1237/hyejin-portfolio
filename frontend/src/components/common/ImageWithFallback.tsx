/**
 * packageName    : frontend.src.components.common
 * fileName       : ImageWithFallback.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 이미지 fallback 공통 컴포넌트
 *                  - 이미지 로드 실패 시 대체 UI 출력
 *                  - 깨진 이미지 아이콘 대신 안내 영역 제공
 *                  - 프로젝트 썸네일, 대표 이미지, 섹션 이미지에서 공통 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       이미지 로드 실패 fallback 처리 추가
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import { useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './ImageWithFallback.module.css'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fallbackText?: string
  height?: string
  maxWidth?: string
  objectFit?: 'cover' | 'contain'
  borderRadius?: string
}

type ImageStyleVariables = CSSProperties & {
  '--image-height': string
  '--image-max-width': string
  '--image-object-fit': string
  '--image-border-radius': string
}

function ImageWithFallback({
  src,
  alt,
  fallbackText = '이미지를 불러올 수 없습니다.',
  height = 'auto',
  maxWidth = '100%',
  objectFit = 'cover',
  borderRadius = '16px',
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false)

  const imageStyleVariables: ImageStyleVariables = {
    '--image-height': height,
    '--image-max-width': maxWidth,
    '--image-object-fit': objectFit,
    '--image-border-radius': borderRadius,
  }

  if (hasError) {
    return (
      <div className={styles.fallback} style={imageStyleVariables}>
        <p className={styles.message}>{fallbackText}</p>
        <p className={styles.path}>{src}</p>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={styles.image}
      style={imageStyleVariables}
    />
  )
}

export default ImageWithFallback