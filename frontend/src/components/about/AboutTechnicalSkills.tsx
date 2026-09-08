/**
 * packageName    : frontend.src.components.about
 * fileName       : AboutTechnicalSkills.tsx
 * author         : Song
 * date           : 2026-08-23
 * description    : About 기술 역량 컴포넌트
 *                  - 기술 카테고리별 보유 기술 목록 출력
 *                  - 기술 로고와 기술명 및 설명 정보 제공
 *                  - Supporting Tools 영역 출력
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-23        Song       최초 생성
 */

import { useState } from 'react'
import type { AboutSectionResponse, AboutSkillCategoryResponse } from '../../types/about'
import RichTextContent from '../common/RichTextContent'
import styles from './AboutTechnicalSkills.module.css'

interface AboutTechnicalSkillsProps {
  skillCategories: AboutSkillCategoryResponse[] | null | undefined
  fallbackSection: AboutSectionResponse | undefined
}

const supportingTools = [
  { name: 'Photoshop', description: '이미지 편집' },
  { name: 'Illustrator', description: '그래픽 디자인' },
  { name: 'Figma', description: 'UI/UX' },
  { name: 'Notion', description: '문서·협업' },
]

function fallbackLabel(name: string) {
  const compactName = name.replace(/[^a-zA-Z0-9가-힣]/g, '')
  return (compactName || 'SKILL').slice(0, 4).toUpperCase()
}

function AboutTechnicalSkills({ skillCategories, fallbackSection }: AboutTechnicalSkillsProps) {
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})
  const usableCategories = (skillCategories ?? []).filter((category) => category.skills.length > 0)

  if (usableCategories.length === 0 && !fallbackSection) return null

  return (
    <section className={styles.section} aria-labelledby="about-technical-skills-title">
      <header className={styles.header}>
        <p className={styles.kicker}>03 · TECHNICAL SKILLS</p>
        <h2 id="about-technical-skills-title">활용하는 기술과 도구</h2>
      </header>

      {usableCategories.length > 0 ? (
        <>
        <div className={styles.categoryGrid}>
          {usableCategories.map((category, categoryIndex) => {
            const categoryKey = `${category.displayOrder}-${category.title}`
            return (
              <article className={styles.categoryCard} key={categoryKey}>
                <span className={styles.categoryNumber}>{String(categoryIndex + 1).padStart(2, '0')}</span>
                <h3>{category.title}</h3>
                {category.description && <p className={styles.categoryDescription}>{category.description}</p>}

                <div className={styles.skillGrid}>
                  {category.skills.map((skill) => {
                    const skillKey = `${categoryKey}-${skill.displayOrder}-${skill.name}`
                    const showLogo = Boolean(skill.logoUrl) && !logoErrors[skillKey]
                    return (
                      <div className={styles.skillTile} key={skillKey}>
                        <div className={styles.logoHolder}>
                          {showLogo ? (
                            <img
                              src={skill.logoUrl ?? undefined}
                              alt={`${skill.name} logo`}
                              loading="lazy"
                              onError={() => setLogoErrors((current) => ({ ...current, [skillKey]: true }))}
                            />
                          ) : (
                            <span aria-hidden="true">{fallbackLabel(skill.name)}</span>
                          )}
                        </div>
                        <h4>{skill.name}</h4>
                        {skill.description && <p>{skill.description}</p>}
                      </div>
                    )
                  })}
                </div>
              </article>
            )
          })}
        </div>
        <section className={styles.supportingTools} aria-labelledby="about-supporting-tools-title">
          <div className={styles.supportingToolsHeader}>
            <p>SUPPORTING TOOLS</p>
            <h3 id="about-supporting-tools-title">개발 과정에 함께 사용하는 도구</h3>
          </div>
          <ul className={styles.supportingToolsList}>
            {supportingTools.map((tool) => (
              <li key={tool.name}>
                <strong>{tool.name}</strong>
                <span>{tool.description}</span>
              </li>
            ))}
          </ul>
        </section>
        </>
      ) : (
        <RichTextContent html={fallbackSection?.contentHtml ?? ''} className={styles.legacyContent} />
      )}
    </section>
  )
}

export default AboutTechnicalSkills
