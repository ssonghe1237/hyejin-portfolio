/**
 * packageName    : frontend.src.components.common
 * fileName       : ImageWithFallback.tsx
 * author         : Song
 * date           : 2026-07-02
 * description    : 이미지 fallback 공통 컴포넌트
 *                  - 이미지 로드 실패 시 대체 UI 출력
 *                  - 깨진 이미지 아이콘 대신 안내 영역 제공
 *                  - 프로젝트 썸네일, 대표 이미지, 섹션 이미지에서 공통 사용
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-02        Song       최초 생성
 * 2026-07-02        Song       이미지 로드 실패 fallback 처리 추가
 */

import { useState } from "react"

// 참고) ?가 붙는 애들은 필수 값이 아닌거, 없으면 필수 값
interface ImageWithFallbackProps {
    src: string
    alt: string
    fallbackText?: string
    height?: string
    maxWidth?: string
    objectFit?: 'cover' | 'contain'

}

function ImageWithFallback({
    src,
    alt,
    fallbackText = '이미지를 불러올 수 없습니다.',
    height = 'auto',
    maxWidth = '100%',
    objectFit = 'cover',
} : ImageWithFallbackProps) {
    const [hasError, setHasError] = useState(false)

    if(hasError) {
        return(
            <div
                style={{
                    width: '100%',
                    maxWidth,
                    height,
                    minHeight: height === 'auto' ? '180px' : undefined,
                    border: '1px dashed #bbb',
                    borderRadius: '16px',
                    backgroundColor: '#f7f7f7',
                    color: '#666',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                }} 
            >
                <p>{fallbackText}</p>
                <p style={{ fontSize: '12px', wordBreak: 'break-all' }}>{src}</p>
            </div>
        )
    }

    return(
        <img 
            src={src}
            alt={alt}
            onError={() => setHasError(true)}
            style={{
                width: '100%',
                maxWidth,
                height,
                objectFit,
                borderRadius: '16px',
                display: 'block',
            }}
        />
    )
}

export default ImageWithFallback