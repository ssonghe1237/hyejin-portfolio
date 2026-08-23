/**
 * packageName    : frontend.src.components.work
 * fileName       : WorkIntroSection.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : Work 페이지 소개 섹션 컴포넌트
 *                  - 포트폴리오 프로젝트 목록 상단 소개 문구 출력
 *                  - 백엔드 중심 역량 키워드 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       CSS Module 스타일 분리
 */
import styles from './WorkIntroSection.module.css'
import workPageIntroImage from '../../assets/work/work-page-intro.png'

function WorkIntroSection() {
    return (
        <section className={styles.intro}>
            <div className={styles.introContent}>
                <div className={styles.copy}>
                    <p className={styles.label}>PROJECT</p>

                    <h1 className={styles.title}>Selected Work</h1>

                    <p className={styles.description}>
                        Java/Spring 기반 백엔드 구현을 중심으로, 데이터 모델링, API 설계,
                        관리자 기능, AI RAG 검색 흐름까지 실제 프로젝트에서 맡았던 기능을
                        정리했습니다.
                    </p>
                </div>

                <div className={styles.visual}>
                    <img
                        src={workPageIntroImage}
                        alt="프로젝트 작업을 표현한 일러스트"
                        className={styles.image}
                    />
                </div>
            </div>
        </section>
    )
}

export default WorkIntroSection
