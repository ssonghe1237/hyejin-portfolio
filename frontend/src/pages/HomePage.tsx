/**
 * packageName    : frontend.src.pages
 * fileName       : HomePage.tsx
 * author         : Song
 * date           : 2026-07-31
 * description    : 포트폴리오 사용자 홈 페이지
 *                  - 개발자 포지셔닝 영역 제공
 *                  - 대표 프로젝트 및 핵심 역량 영역 제공
 *                  - 성장 배경과 연락 유도 영역 제공
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-31        Song               최초 생성
 * 2026-08-03        Song               홈 페이지 전체 섹션 구조 구성
 * 2026-08-03        Song               홈 페이지 CSS Module 스타일 적용
 */

import { Link } from 'react-router-dom'
import styles from './HomePage.module.css'
import { useEffect, useState } from 'react'
import type { ProjectListResponse } from '../types/project'
import { getAllProjects } from '../api/projectApi'
import ProjectCard from '../components/project/ProjectCard'

function HomePage() {
    // =============================================================================================
    // 1) Hook
    const [selectedProjects, setSelectedProjects] = useState<ProjectListResponse[]>([])
    const [projectLoading, setProjectLoading] = useState(true)
    const [projectErrorMessage, setProjectErrorMessage] = useState<string | null>(null)

    useEffect((() => {
        async function fetchSelectProjects() {
            try {
                setProjectLoading(false)
                setProjectErrorMessage(null)

                const result = await getAllProjects()

                const selectProjects = result.slice(0,3)

                setSelectedProjects(selectProjects)
            } catch(error) {
                console.error(error)
                setProjectErrorMessage('대표 프로젝트를 불러오지 못했습니다.')
            } finally {
                setProjectLoading(false)
            }
        }

        fetchSelectProjects()
    }), [])

    return (
        <div className={styles.page}>
        {/* 개발자 포지셔닝 */}
        <section
            className={`${styles.section} ${styles.hero}`}
            aria-labelledby="home-title"
        >
            <p className={styles.eyebrow}>
            Backend · Full-stack · Product Development
            </p>

            <h1 id="home-title" className={styles.heroTitle}>
            사용자 화면부터
            <br />
            백엔드와 운영 구조까지
            <br />
            연결하는 웹 개발자
            </h1>

            <p className={styles.heroDescription}>
            기획과 디자인 경험을 바탕으로 요구사항을 구조화하고,
            Java와 Spring Boot를 중심으로 실제 동작하는 웹 서비스를 구현합니다.
            </p>

            <div className={styles.heroActions}>
            <Link
                to="/work"
                className={styles.primaryLink}
            >
                View my work
            </Link>

            <Link
                to="/contact"
                className={styles.secondaryLink}
            >
                Get in touch
            </Link>
            </div>
        </section>

        {/* 대표 프로젝트 */}
        <section
            className={styles.section}
            aria-labelledby="selected-work-title"
        >
            <div className={styles.sectionHeader}>
                <div>
                    <p className={styles.eyebrow}>Selected Work</p>

                    <h2
                    id="selected-work-title"
                    className={styles.sectionTitle}
                    >
                    대표 프로젝트
                    </h2>
                </div>

                <Link
                    to="/work"
                    className={styles.textLink}
                >
                    View all work
                </Link>
            </div>

            <p className={styles.sectionDescription}>
                문제 정의부터 구조 설계, 구현과 검증까지 직접 참여한
                대표 프로젝트를 소개합니다.
            </p>

            {projectLoading ? (
                <p>
                    대표 프로젝트를 불러오는 중입니다...
                </p>
            ) : projectErrorMessage ? (
                <p>
                    {projectErrorMessage}
                </p>
            ) : (
                <div>
                    {selectedProjects.map((project) => (
                        <ProjectCard 
                            key={project.projectId}
                            project={project}
                        />
                    ))}
                </div>
            )}
        </section>

        {/* 핵심 역량 */}
        <section
            className={styles.section}
            aria-labelledby="capabilities-title"
        >
            <div className={styles.sectionHeader}>
            <div>
                <p className={styles.eyebrow}>What I Do</p>

                <h2
                id="capabilities-title"
                className={styles.sectionTitle}
                >
                핵심 역량
                </h2>
            </div>
            </div>

            <div className={styles.capabilityGrid}>
            <article className={styles.capabilityCard}>
                <span className={styles.capabilityNumber}>01</span>

                <h3 className={styles.capabilityTitle}>
                Backend Engineering
                </h3>

                <p className={styles.capabilityDescription}>
                Spring Boot, JPA, PostgreSQL을 활용해
                API와 데이터 구조를 설계하고 구현합니다.
                </p>
            </article>

            <article className={styles.capabilityCard}>
                <span className={styles.capabilityNumber}>02</span>

                <h3 className={styles.capabilityTitle}>
                Product Development
                </h3>

                <p className={styles.capabilityDescription}>
                기획과 디자인 경험을 바탕으로
                사용자 요구사항을 실제 웹 기능으로 연결합니다.
                </p>
            </article>

            <article className={styles.capabilityCard}>
                <span className={styles.capabilityNumber}>03</span>

                <h3 className={styles.capabilityTitle}>
                Deployment &amp; Operations
                </h3>

                <p className={styles.capabilityDescription}>
                파일과 데이터의 생명주기,
                Docker 배포와 운영 환경까지 고려합니다.
                </p>
            </article>
            </div>
        </section>

        {/* 성장 배경 */}
        <section
            className={`${styles.section} ${styles.background}`}
            aria-labelledby="background-title"
        >
            <div>
            <p className={styles.eyebrow}>Background</p>

            <h2
                id="background-title"
                className={styles.sectionTitle}
            >
                기획과 디자인 경험을
                <br />
                개발로 확장했습니다.
            </h2>
            </div>

            <div className={styles.backgroundContent}>
            <p>
                마케팅, 기획, 디자인 실무를 경험한 뒤
                Java와 Spring 기반 웹 개발로 업무 영역을 확장했습니다.
            </p>

            <p>
                화면의 사용성뿐 아니라 API, 데이터 흐름,
                배포 이후의 운영까지 하나의 제품 흐름으로 이해합니다.
            </p>

            <Link
                to="/about"
                className={styles.textLink}
            >
                More about me
            </Link>
            </div>
        </section>

        {/* 연락 유도 */}
        <section
            className={styles.contactCta}
            aria-labelledby="contact-cta-title"
        >
            <p className={styles.contactEyebrow}>Get in touch</p>

            <h2
            id="contact-cta-title"
            className={styles.contactTitle}
            >
            함께할 프로젝트와
            <br />
            새로운 기회를 기다리고 있습니다.
            </h2>

            <p className={styles.contactDescription}>
            채용, 프로젝트 협업 또는 포트폴리오에 관한 문의를 남겨주세요.
            </p>

            <Link
            to="/contact"
            className={styles.contactLink}
            >
            Contact me
            </Link>
        </section>
        </div>
    )
}

export default HomePage