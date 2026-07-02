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
 */

function WorkIntroSection() {
    return(
        <section
            style={{
                padding: '48px 0 56px'
            }}
        >
            <p
                style={{
                    margin: '0 0 12px',
                    color: '#777',
                    fontSize: '16px',
                    fontWeight: 600,
                }}
            >
                Backend Portfolio
            </p>

            <h1
                style={{
                margin: 0,
                fontSize: '56px',
                lineHeight: 1.05,
                letterSpacing: '-0.06em',
                }}
            >
                문제를 구조화하고,
                <br />
                동작하는 서비스로 구현합니다.
            </h1>

            <p
                style={{
                maxWidth: '720px',
                margin: '24px 0 0',
                color: '#555',
                fontSize: '18px',
                lineHeight: 1.7,
                }}
            >
                Java/Spring 기반 백엔드 구현을 중심으로, 데이터 모델링, API 설계,
                관리자 기능, AI RAG 검색 흐름까지 실제 프로젝트에서 맡았던 기능을
                정리했습니다.
            </p>

            <div
                style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '28px',
                }}
            >
                {['Java', 'Spring Boot', 'JPA', 'PostgreSQL', 'React', 'AI RAG'].map(
                (keyword) => (
                    <span
                    key={keyword}
                    style={{
                        padding: '8px 14px',
                        borderRadius: '999px',
                        backgroundColor: '#f4f4f4',
                        color: '#333',
                        fontSize: '14px',
                        fontWeight: 600,
                    }}
                    >
                    {keyword}
                    </span>
                ),
                )}
            </div>
        </section>
    )
}

export default WorkIntroSection;
