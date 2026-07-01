import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ProjectDetailResponse } from '../types/project';
import { getProjectDetail } from '../api/projectApi';

function ProjectDetailPage() {
    const { slug } = useParams<{slug: string}>()
    const [project, setProject] = useState<ProjectDetailResponse | null>(null)
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 프로젝트 상세 조회
    useEffect(() => {
        async function fetchProjectDetail() {
            if(!slug) {
                setErrorMessage('프로젝트 식별자가 없습니다.')
                setLoading(false);
                return
            }

            try{
                setLoading(true)

                const result = await getProjectDetail(slug);

                setProject(result)
            }catch(error){
                console.error(error)
                setErrorMessage('프로젝트 상세 정보를 불러오지 못했습니다.')

            }finally{
                setLoading(false)
            }
        }

        fetchProjectDetail()
    }, [slug])

    if(loading) {
        return <main style={{ padding: '40px' }}>Loading...</main>
    }

    if(errorMessage) {
        return (
            <main style={{ padding: '40px' }}>
                <p>{errorMessage}</p>
                <Link to="/work">work 목록으로 돌아가기</Link>
            </main>
        )
    }

    if(!project) {
        return (
            <main style={{ padding: '40px' }}>
                <p>프로젝트 정보가 없습니다.</p>
                <Link to='/work'>Work 목록으로 돌아가기</Link>
            </main> 
        )
    }

    return (
        <main style={{ padding: '40px' }}>
            <Link to="/work">← Work 목록으로 돌아가기</Link>

            {/* =========================================================================
                프로젝트 기본 정보  */}
            <section style={{ marginTop: '32px' }}>
                <h1>{project.title}</h1>
                <p>{project.summary}</p>

                {project.periodText && <p>{project.periodText}</p>}
                {project.teamName && <p>{project.teamName}</p>}
                {project.role && <p>{project.role}</p>}
                {project.description && <p>{project.description}</p>}
            </section>

            {/* =========================================================================
                기술 스택  */}
            <section style={{ marginTop: '40px' }}>
                <h2>Tech Stack</h2>

                {project.techStacks.length === 0 ? (
                    <p>등록된 기술스택이 없습니다.</p>
                ) : (
                    <ul>
                        {project.techStacks.map((tech) => (
                            <li key={tech.projectTechId}>
                                {tech.techName}
                                {tech.techCategory && ` / ${tech.techCategory}`}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* =========================================================================
                이미지  */}
            <section style={{ marginTop: '40px' }}>
                <h2>Image</h2>

                {project.images.length === 0 ? (
                    <p>등록된 이미지가 없습니다.</p>
                ) : (
                    <ul>
                        {project.images.map((image) => (
                            <li key={image.projectImageId}>
                                [{image.imageType}] {image.imageUrl}
                                {image.caption && ` - &{image.caption}`}
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* =========================================================================
                섹션  */}
            <section style={{ marginTop: '40px' }}>
                <h2>Section</h2>

                {project.sections.length === 0 ? (
                    <p>등록된 상세 섹션이 없습니다.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '24px' }}>
                        {project.sections.map((section) => (
                            <article
                                key={section.sectionId}
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '12px',
                                    padding: '20px',
                                }}
                            >
                                <p>{section.sectionType}</p>
                                {section.title && <h3>{section.title}</h3>}
                                {section.content && (
                                    <pre
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            wordBreak: 'break-word',
                                        }}
                                    >
                                        {section.content}
                                    </pre>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {/* =========================================================================
                링크  */}
            <section style={{ marginTop: '40px' }}>
                <h2>Links</h2>

                {project.links.length === 0 ? (
                <p>등록된 링크가 없습니다.</p>
                ) : (
                <ul>
                    {project.links.map((link) => (
                    <li key={link.projectLinkId}>
                        [{link.linkType}]{' '}
                        <a href={link.url} target="_blank" rel="noreferrer">
                        {link.linkName}
                        </a>
                    </li>
                    ))}
                </ul>
                )}
            </section>
        </main>
    )
}

export default ProjectDetailPage;
