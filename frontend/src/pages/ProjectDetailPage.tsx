import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ProjectDetailResponse } from '../types/project';
import { getProjectDetail } from '../api/projectApi';
import ProjectTechStackSection from '../components/project/detail/ProjectTechStackSection';
import ProjectContentSection from '../components/project/detail/ProjectContentSection';
import ProjectLinkSection from '../components/project/detail/ProjectLinkSection';
import ProjectDetailHeader from '../components/project/detail/ProjectDetailHeader';

/**
 * packageName    : frontend.src.pages
 * fileName       : ProjectDetailPage.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 프로젝트 상세 페이지
 *                  - slug 기준 프로젝트 상세 조회
 *                  - 프로젝트 기본 정보, 기술스택, 상세 섹션, 링크 출력
 *                  - heroImages 및 섹션 별 images 응답 구조 연동
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       프로젝트 상세 API 연동
 * 2026-07-02        Song       상세 페이지 컴포넌트 분리 적용
 * 2026-07-02        Song       heroImages 및 섹션 별 images 구조 반영
 */

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

            {/* 프로젝트 기본 정보 =========================== */}
            <ProjectDetailHeader project={project}/>

            {/* 기술 스택 =================================== */}    
            <ProjectTechStackSection techStacks={project.techStacks}/>

            {/* 섹션  =================================== */}
            <ProjectContentSection sections={project.sections} />

            {/* 링크  =================================== */}    
            <ProjectLinkSection links={project.links} />
        </main>
    )
}

export default ProjectDetailPage;
