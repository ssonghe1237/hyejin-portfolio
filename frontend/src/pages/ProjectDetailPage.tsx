import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { ProjectDetailResponse } from '../types/project';
import { getProjectDetail } from '../api/projectApi';
import ProjectBasicInfo from '../components/project/detail/ProjectBasicInfo';
import ProjectTechStackSection from '../components/project/detail/ProjectTechStackSection';
import ProjectImageSection from '../components/project/detail/ProjectImageSection';
import ProjectContentSection from '../components/project/detail/ProjectContentSection';
import ProjectLinkSection from '../components/project/detail/ProjectLinkSection';

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
            <ProjectBasicInfo project={project}/>

            {/* 기술 스택 =================================== */}    
            <ProjectTechStackSection techStacks={project.techStacks}/>

            {/* 이미지 =================================== */}
            <ProjectImageSection images={project.images} />

            {/* 섹션  =================================== */}
            <ProjectContentSection sections={project.sections} />

            {/* 링크  =================================== */}    
            <ProjectLinkSection links={project.links} />
        </main>
    )
}

export default ProjectDetailPage;
