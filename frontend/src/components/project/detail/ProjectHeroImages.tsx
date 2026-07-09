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

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    setCurrentIndex(0)
  }, [sortedImages.length])

  useEffect(() => {
    if (sortedImages.length <= 1) {
      return
    }

    const timerId = window.setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % sortedImages.length)
    }, 3500)

    return () => {
      window.clearInterval(timerId)
    }
  }, [sortedImages.length])

  if (sortedImages.length === 0) {
    return (
      <section className={styles.empty}>
        대표 이미지가 없습니다.
      </section>
    )
  }

  const currentImage = sortedImages[currentIndex]

  return (
    <section className={styles.hero}>
      <ImageWithFallback
        src={currentImage.imageUrl}
        alt={currentImage.caption ?? '프로젝트 대표 이미지'}
        fallbackText="대표 이미지를 불러올 수 없습니다."
        height="360px"
        objectFit="cover"
      />

      {currentImage.caption && (
        <p className={styles.caption}>{currentImage.caption}</p>
      )}

      {sortedImages.length > 1 && (
        <div className={styles.dots}>
          {sortedImages.map((image, index) => (
            <button
              key={image.imageId}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 대표 이미지 보기`}
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