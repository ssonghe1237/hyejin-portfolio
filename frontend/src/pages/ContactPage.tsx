/**
 * packageName    : frontend.src.pages
 * fileName       : ContactPage.tsx
 * author         : Song
 * date           : 2026-08-03
 * description    : 포트폴리오 사용자 연락처 페이지
 *                  - 이메일 및 외부 프로필 링크 제공 예정
 *                  - 이력서 PDF 열람 링크 제공 예정
 *                  - 빠른 배포를 위해 메시지 전송 폼은 제외
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song               최초 생성
 */

function ContactPage() {
    return(
        <div>
            <section aria-labelledby="contact-title">
                <p>Get in touch</p>

                <h1 id="contact-title">
                함께할 프로젝트와 새로운 기회를 기다리고 있습니다.
                </h1>

                <p>
                채용, 프로젝트 협업 또는 포트폴리오에 관한 문의는
                이메일과 외부 프로필을 통해 전달해 주세요.
                </p>
            </section>

            <section aria-labelledby="contact-links-title">
                <h2 id="contact-links-title">Contact</h2>

                <p>
                이메일, GitHub, LinkedIn 및 이력서 링크를 제공할 예정입니다.
                </p>
            </section>
        </div>
    )
}

export default ContactPage