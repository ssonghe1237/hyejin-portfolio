import { useEffect, useMemo, useState } from 'react'
import type { ProjectImageResponse } from '../../../types/project'

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
 */

interface ProjectHeroImagesProps {
  images: ProjectImageResponse[]
}

function ProjectHeroImages({ images }: ProjectHeroImagesProps) {
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.displayOrder - b.displayOrder),
    [images],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [errorImageIds, setErrorImageIds] = useState<number[]>([])

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
      <section
        style={{
          height: '360px',
          borderRadius: '24px',
          backgroundColor: '#f3f3f3',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#777',
        }}
      >
        대표 이미지가 없습니다.
      </section>
    )
  }

  const currentImage = sortedImages[currentIndex]
  const hasImageError = errorImageIds.includes(currentImage.projectImageId)

  return (
    <section
      style={{
        position: 'relative',
        height: '360px',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: '#f3f3f3',
      }}
    >
      {hasImageError ? (
        <div
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#777',
            padding: '24px',
            textAlign: 'center',
          }}
        >
          <p>대표 이미지를 불러올 수 없습니다.</p>
          <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>
            {currentImage.imageUrl}
          </p>
        </div>
      ) : (
        <img
          src={currentImage.imageUrl}
          alt={currentImage.caption ?? '프로젝트 대표 이미지'}
          onError={() => {
            setErrorImageIds((prevIds) => [
              ...prevIds,
              currentImage.projectImageId,
            ])
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}

      {currentImage.caption && (
        <p
          style={{
            position: 'absolute',
            left: '24px',
            bottom: '24px',
            margin: 0,
            padding: '8px 12px',
            borderRadius: '999px',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            color: '#fff',
            fontSize: '14px',
          }}
        >
          {currentImage.caption}
        </p>
      )}

      {sortedImages.length > 1 && (
        <div
          style={{
            position: 'absolute',
            right: '24px',
            bottom: '24px',
            display: 'flex',
            gap: '8px',
          }}
        >
          {sortedImages.map((image, index) => (
            <button
              key={image.projectImageId}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`${index + 1}번째 대표 이미지 보기`}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 0,
                cursor: 'pointer',
                backgroundColor:
                  index === currentIndex ? '#111' : 'rgba(255, 255, 255, 0.8)',
              }}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default ProjectHeroImages