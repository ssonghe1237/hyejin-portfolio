/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminProjectDetailPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 관리자 프로젝트 상세 페이지
 *                  - projectId 기준 관리자 프로젝트 상세 조회
 *                  - 프로젝트 기본 정보, 이미지, 기술스택, 섹션, 링크 확인
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 */

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAdminProjectDetail } from '../../api/adminProjectApi';
import type { AdminProjectDetailResponse } from '../../types/project';
import styles from './AdminProjectDetailPage.module.css';

function AdminProjectDetailPage() {
    
    const { projectId } = useParams<{ projectId : string }>()
    const [project, setProject] = useState<AdminProjectDetailResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProjectDetail() {
            
            if(!projectId) {
                setErrorMessage('프로젝트 ID가 없습니다.')
                setLoading(false)
                return
            }

            const parsedProjectId = Number(projectId)

            if(Number.isNaN(parsedProjectId)) {
                setErrorMessage('올바르지 않은 프로젝트 ID입니다.')
                setLoading(false)
                return
            }

            try {
                setLoading(true)
                setErrorMessage(null)

                const result = await getAdminProjectDetail(parsedProjectId)

                setProject(result)
            } catch(error) {
                console.error(error)
                setErrorMessage('관리자 프로젝트 상세 정보를 불러오지 못했습니다.')
            } finally {
                setLoading(false)
            }
        }

        fetchProjectDetail()
    }, [projectId])

    if(loading) {
        return <div className={styles.status}>관리자 프로젝트 상세 정보를 불러오는 중입니다...</div>
    }

    if (errorMessage) {
        return (
            <div className={styles.error}>
                <p>{errorMessage}</p>
                <Link to="/admin/projects" className={styles.backLink}>
                    관리자 프로젝트 목록으로 돌아가기
                </Link>
            </div>
        )
    }

    if(!project) {
        return (
            <div className={styles.error}>
                <p>프로젝트 정보가 없습니다.</p>
                <Link to="/admin/projects" className={styles.backLink}>
                관리자 프로젝트 목록으로 돌아가기
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.page}>
        <Link to="/admin/projects" className={styles.backLink}>
            ← 관리자 프로젝트 목록으로 돌아가기
        </Link>

        <section className={styles.card}>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.summary}>{project.summary}</p>

            <div className={styles.metaGrid}>
            <div className={styles.metaItem}>
                <span className={styles.label}>ID</span>
                <span className={styles.value}>{project.projectId}</span>
            </div>

            <div className={styles.metaItem}>
                <span className={styles.label}>Slug</span>
                <span className={styles.value}>{project.slug}</span>
            </div>

            <div className={styles.metaItem}>
                <span className={styles.label}>유형</span>
                <span className={styles.value}>{project.projectType}</span>
            </div>

            <div className={styles.metaItem}>
                <span className={styles.label}>공개 여부</span>
                <span className={styles.value}>
                {project.published ? '공개' : '비공개'}
                </span>
            </div>

            <div className={styles.metaItem}>
                <span className={styles.label}>정렬 순서</span>
                <span className={styles.value}>{project.displayOrder}</span>
            </div>

            <div className={styles.metaItem}>
                <span className={styles.label}>생성일</span>
                <span className={styles.value}>{project.createdAt.slice(0, 10)}</span>
            </div>
            </div>
        </section>

        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Hero Images</h2>
            <ul className={styles.list}>
            {project.heroImages.map((image) => (
                <li key={image.projectImageId} className={styles.listItem}>
                [{image.imageType}] {image.imageUrl}
                </li>
            ))}
            </ul>
        </section>

        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Tech Stacks</h2>
            <ul className={styles.list}>
            {project.techStacks.map((tech) => (
                <li key={tech.projectTechId} className={styles.listItem}>
                {tech.techName} / {tech.techCategory}
                </li>
            ))}
            </ul>
        </section>

        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Sections</h2>
            <ul className={styles.list}>
            {project.sections.map((section) => (
                <li key={section.sectionId} className={styles.listItem}>
                <strong>{section.sectionType}</strong>
                {section.title && ` - ${section.title}`}
                <br />
                이미지 {section.images.length}개
                </li>
            ))}
            </ul>
        </section>

        <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Links</h2>
            <ul className={styles.list}>
            {project.links.map((link) => (
                <li key={link.projectLinkId} className={styles.listItem}>
                [{link.linkType}] {link.linkName} - {link.url}
                </li>
            ))}
            </ul>
        </section>
        </div>
    )
}

export default AdminProjectDetailPage;

