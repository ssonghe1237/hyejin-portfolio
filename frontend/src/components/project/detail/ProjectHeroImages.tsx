/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectHeroImages.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 대표 이미지 컴포넌트
 *                  - heroImages 목록 출력
 *                  - 대표 이미지 자동 롤링 처리
 *                  - 이미지 로드 실패 시 대체 UI 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       대표 이미지 롤링 기능 추가
 * 2026-07-02        Song       이미지 로드 실패 대응 추가
 * 2026-07-02        Song       CSS Module 스타일 분리
 */

import { useEffect, useMemo, useState } from 'react'
import type { ProjectImageResponse } from '../../../types/project'
import ImageWithFallback from '../../common/ImageWithFallback'
import styles from './ProjectHeroImages.module.css'

interface ProjectHeroImagesProps {
  images: ProjectImageResponse[]
}

function ProjectHeroImages({ images }: ProjectHeroImagesProps) {
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.displayOrder - b.displayOrder),
    [images],
  )

  return <ProjectHeroImagesContent key={sortedImages.length} images={sortedImages} />
}

interface ProjectHeroImagesContentProps {
  images: ProjectImageResponse[]
}

function ProjectHeroImagesContent({ images }: ProjectHeroImagesContentProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (images.length <= 1 || prefersReducedMotion) {
      return
    }

    const timerId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 3500)

    return () => {
      window.clearInterval(timerId)
    }
  }, [images.length])

  if (images.length === 0) {
    return (
      <section className={styles.empty} aria-hidden="true" />
    )
  }

  const currentImage = images[currentIndex]

  return (
    <section className={styles.hero}>
      <div className={styles.imageViewport}>
        <ImageWithFallback
          src={currentImage.imageUrl}
          alt={currentImage.caption ?? '프로젝트 대표 이미지'}
          fallbackText="대표 이미지를 불러올 수 없습니다."
          height="100%"
          objectFit="cover"
          borderRadius="0"
        />
      </div>

      {currentImage.caption && (
        <p className={styles.heroCaption}>{currentImage.caption}</p>
      )}

      {images.length > 1 && (
        <div className={styles.heroIndicators}>
          {images.map((image, index) => (
            <button
              key={image.projectImageId}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 대표 이미지 보기`}
              aria-current={index === currentIndex ? 'true' : undefined}
              className={
                index === currentIndex
                  ? `${styles.dot} ${styles.dotActive}`
                  : styles.dot
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectHeroImages
