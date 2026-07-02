import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

/**
 * packageName    : frontend.src.components.project.detail
 * fileName       : MermaidRenderer.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : Mermaid 차트 렌더링 컴포넌트
 *                  - Mermaid 문법 문자열을 SVG 차트로 변환
 *                  - WORKFLOW 섹션의 프로세스 흐름 시각화
 *                  - 렌더링 실패 시 원본 Mermaid 텍스트 fallback 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       Mermaid 렌더링 기능 추가
 * 2026-07-02        Song       useId 기반 안정적인 renderId 생성 방식 적용
 */

mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'strict',
})

interface MermaidRendererProps {
  chart: string
}

function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reactId = useId()
  const safeId = reactId.replace(/:/g, '')
  const renderCountRef = useRef(0)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function renderChart() {
      if (!containerRef.current) {
        return
      }

      try {
        setErrorMessage(null)
        renderCountRef.current += 1

        const renderId = `mermaid-${safeId}-${renderCountRef.current}`
        const { svg } = await mermaid.render(renderId, chart)

        if (isMounted && containerRef.current) {
          containerRef.current.innerHTML = svg
        }
      } catch (error) {
        console.error(error)
        setErrorMessage('Mermaid 차트를 렌더링하지 못했습니다.')

        if (containerRef.current) {
          containerRef.current.innerHTML = ''
        }
      }
    }

    renderChart()

    return () => {
      isMounted = false
    }
  }, [chart, safeId])

  if (errorMessage) {
    return (
      <div>
        <p>{errorMessage}</p>
        <pre
          style={{
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            backgroundColor: '#f7f7f7',
            padding: '16px',
            borderRadius: '8px',
          }}
        >
          {chart}
        </pre>
      </div>
    )
  }

  return <div ref={containerRef} />
}

export default MermaidRenderer