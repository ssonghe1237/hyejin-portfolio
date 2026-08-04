/**
 * packageName    : frontend.src.pages
 * fileName       : AboutPage.tsx
 * author         : Song
 * date           : 2026-08-03
 * description    : 포트폴리오 사용자 About 페이지
 *                  - 개발자 소개 및 성장 배경 영역 제공
 *                  - 현재 집중 분야 및 기술 역량 영역 제공 예정
 *                  - 교육 과정 및 자격증 정보 영역 제공 예정
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song               최초 생성
 */

function AboutPage() {

    return(
        <div>
            <section aria-labelledby="about-title">
                <p>About</p>

                <h1 id="about-title">
                기획과 디자인 경험을 개발로 연결합니다.
                </h1>

                <p>
                사용자 관점에서 요구사항을 이해하고,
                Java와 Spring Boot를 중심으로 웹 서비스의 구조와 기능을 구현합니다.
                </p>
            </section>

            <section aria-labelledby="background-title">
                <h2 id="background-title">Background</h2>

                <p>
                마케팅, 기획, 디자인 실무 경험을 바탕으로
                화면의 사용성뿐 아니라 API, 데이터 흐름,
                배포 이후의 운영까지 함께 고려하는 개발자를 목표로 합니다.
                </p>
            </section>

            <section aria-labelledby="focus-title">
                <h2 id="focus-title">Current Focus</h2>

                <p>
                Spring Boot와 JPA 기반 백엔드 설계,
                React와 TypeScript를 활용한 관리자 기능,
                Docker 기반 배포 환경을 학습하고 구현하고 있습니다.
                </p>
            </section>
        </div>
    )
}

export default AboutPage