import type { ProjectImageResponse } from '../../../types/project'

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : ProjectImageSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 이미지 섹션 컴포넌트
 *                  - 기존 프로젝트 상세 이미지 목록 출력용 컴포넌트
 *                  - 현재는 heroImages 및 sections[].images 구조로 변경되어 사용 축소
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 이미지 목록 출력 추가
 * 2026-07-02        Song       섹션 별 이미지 구조 도입으로 사용 축소
 */

interface ProjectImageSectionProps {
    images : ProjectImageResponse[]
}

function ProjectImageSection ({ images } : ProjectImageSectionProps){
    return (
        <section style={{ marginTop: '40px' }}>
        <h2>Images</h2>

        {images.length === 0 ? (
            <p>등록된 이미지가 없습니다.</p>
        ) : (
            <ul>
            {images.map((image) => (
                <li key={image.projectImageId}>
                [{image.imageType}] {image.imageUrl}
                {image.caption && ` - ${image.caption}`}
                </li>
            ))}
            </ul>
        )}
        </section>
    )
}

export default ProjectImageSection