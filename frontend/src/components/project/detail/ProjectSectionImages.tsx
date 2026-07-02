/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectSectionImages.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 섹션 이미지 목록 컴포넌트
 *                  - 섹션에 연결된 이미지 목록 출력
 *                  - 이미지 로드 실패 시 fallback 컴포넌트 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import ImageWithFallback from '../../common/ImageWithFallback'
import type {
  ProjectImageResponse,
  ProjectSectionType,
} from '../../../types/project'

interface ProjectSectionImagesProps {
  images: ProjectImageResponse[]
  sectionType: ProjectSectionType
}

function ProjectSectionImages({
  images,
  sectionType,
}: ProjectSectionImagesProps) {
  if (images.length === 0) {
    return null
  }

  return (
    <div
      style={{
        display: 'grid',
        gap: '16px',
        marginTop: '20px',
      }}
    >
      {images.map((image) => (
        <figure
          key={image.projectImageId}
          style={{
            margin: 0,
            width: '100%',
          }}
        >
          <ImageWithFallback
            src={image.imageUrl}
            alt={image.caption ?? sectionType}
            fallbackText={`${sectionType} 이미지를 불러올 수 없습니다.`}
            maxWidth="100%"
            objectFit="contain"
          />

          {image.caption && (
            <figcaption
              style={{
                marginTop: '8px',
                color: '#666',
                fontSize: '14px',
              }}
            >
              {image.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  )
}

export default ProjectSectionImages