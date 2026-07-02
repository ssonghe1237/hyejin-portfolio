import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'

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