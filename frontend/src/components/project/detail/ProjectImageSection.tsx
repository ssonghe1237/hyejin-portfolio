import type { ProjectImageResponse } from '../../../types/project'

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