package com.hyejin.portfolio.global.security.html;

import org.owasp.html.HtmlPolicyBuilder;
import org.owasp.html.PolicyFactory;
import org.springframework.stereotype.Component;

/**
 * packageName    : com.hyejin.portfolio.global.security.html
 * fileName       : RichTextHtmlSanitizer
 * author         : Song
 * date           : 2026-08-03
 * description    : Tiptap 기반 공통 Rich Text HTML 정제 컴포넌트
 *                  - Research, About 등 장문 게시 콘텐츠 HTML 정제
 *                  - 허용 태그와 링크 프로토콜을 제한하여 XSS 방지
 *                  - script, iframe, style 및 이벤트 속성 제거
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-03        Song       최초 생성
 */
@Component
public class RichTextHtmlSanitizer {

    // Tiptap 공통 본문에서 허용할 HTML 정책
    /*
     * 허용 태그
     * - 문단: p, br
     * - 제목: h2, h3
     * - 글자 서식: strong, em, s
     * - 인용문: blockquote
     * - 목록: ul, ol, li
     * - 코드: pre, code
     * - 구분선: hr
     * - 링크: a
     *
     * 현재 허용하지 않는 항목
     * - img: 게시글 이미지 업로드 기능 미구현
     * - iframe: 외부 콘텐츠 삽입 미지원
     * - style, class: 임의 스타일 삽입 방지
     * - onclick 등의 이벤트 속성
     */
    private static final PolicyFactory RICH_TEXT_HTML_POLICY =
            new HtmlPolicyBuilder()
                    .allowElements(
                            "p",
                            "br",
                            "h2",
                            "h3",
                            "strong",
                            "em",
                            "s",
                            "blockquote",
                            "ul",
                            "ol",
                            "li",
                            "pre",
                            "code",
                            "hr",
                            "a"
                    )
                    .allowUrlProtocols(
                            "http",
                            "https",
                            "mailto"
                    )
                    .allowAttributes(
                            "href",
                            "title"
                    )
                    .onElements("a")
                    .requireRelNofollowOnLinks()
                    .toFactory();

    // 허용 목록 정책을 적용하여 안전한 HTML 반환
    // @param contentHtml Tiptap에서 전달 된 HTML
    // @return 허용되지 않은 태그와 속성이 제거된 HTML
    public String sanitize(
            String contentHtml
    ) {
        if (contentHtml == null
                || contentHtml.isBlank()) {
            return "";
        }

        return RICH_TEXT_HTML_POLICY.sanitize(
                contentHtml.trim()
        );
    }

    // 정제된 HTML에 실제 표시 가능한 텍스트가 존재하는지 확인
    // <p></p>, <p><br></p>처럼 에디터 구조만 존재하는 입력을 유효한 본문으로 처리하지 않기 위해 사용
    // @param sanitizedHtml 정제 완료된 HTML
    // @return 실제 텍스트가 존재하면 true
    public boolean hasVisibleContent(
            String sanitizedHtml
    ){
        if (sanitizedHtml == null
                || sanitizedHtml.isBlank()) {
            return false;
        }

        // 이 정규식은 HTML 보안 정제에 사용하지 않음
        // OWSAP Sanitizer 처리 이후 실제 텍스트 존재 여부만 검사
        String textContent = sanitizedHtml
                .replaceAll("<[^>]*>", "")
                .replace("&nbsp;", "")
                .replace("&#160;", "")
                .trim();

        return !textContent.isEmpty();
    }
}
