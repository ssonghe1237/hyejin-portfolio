import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAbout } from '../api/aboutApi'
import { getContact } from '../api/contactApi'
import AboutTechnicalSkills from '../components/about/AboutTechnicalSkills'
import RichTextContent from '../components/common/RichTextContent'
import type {
  AboutEducationType,
  AboutResponse,
} from '../types/about'
import type { ContactResponse } from '../types/contact'
import styles from './AboutPage.module.css'

function isHttpUrl(url: string) {
  return url.startsWith('http://') || url.startsWith('https://')
}

function formatDate(date: string) {
  return date.replaceAll('-', '.')
}

function formatMonth(date: string) {
  return date.slice(0, 7).replace('-', '.')
}

function formatPeriod(startDate: string, endDate: string | null) {
  return `${formatMonth(startDate)} — ${endDate ? formatMonth(endDate) : 'PRESENT'}`
}

function educationTypeLabel(type: AboutEducationType) {
  return type === 'SCHOOL' ? 'SCHOOL' : 'TRAINING'
}

function AboutPage() {
  const [about, setAbout] = useState<AboutResponse | null>(null)
  const [contact, setContact] = useState<ContactResponse | null>(null)
  const [profileImageError, setProfileImageError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchAbout() {
      try {
        setLoading(true)
        setErrorMessage(null)
        const result = await getAbout()
        if (!cancelled) setAbout(result)
      } catch (error) {
        if (cancelled) return
        console.error(error)
        setErrorMessage('About 콘텐츠를 준비하고 있습니다.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchAbout()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    let cancelled = false
    getContact()
      .then((result) => { if (!cancelled) setContact(result) })
      .catch((error) => console.error(error))
    return () => { cancelled = true }
  }, [])

  if (loading) {
    return <main className={styles.statusPage}>About 콘텐츠를 불러오는 중입니다...</main>
  }

  if (errorMessage || !about) {
    return (
      <main className={styles.statusPage}>
        <h1 className={styles.statusTitle}>About / Profile</h1>
        <p className={styles.statusMessage}>
          {errorMessage ?? 'About 콘텐츠를 찾을 수 없습니다.'}
        </p>
        <Link to="/" className={styles.backLink}>Home으로 돌아가기</Link>
      </main>
    )
  }

  const technicalStackSection = about.sections.find(
    (section) => section.sectionType === 'TECHNICAL_STACK',
  )
  const troubleshootingSection = about.sections.find(
    (section) => section.sectionType === 'TROUBLESHOOTING',
  )
  const storySections = about.sections.filter(
    // Legacy rows created before sectionType existed remain editorial stories.
    (section) => section.sectionType === 'STORY' || section.sectionType == null,
  )

  const profileName = about.nameKo ?? about.nameEn ?? 'Profile'
  const profileMetadata = [
    about.birthDate && ['BIRTH', formatDate(about.birthDate)],
    contact?.email && ['EMAIL', contact.email],
    about.location && ['LOCATION', about.location],
    about.interests && ['INTERESTS', about.interests],
  ].filter((item): item is string[] => Boolean(item))
  const profileFocus = [
    about.background && ['BACKGROUND', about.background],
    about.currentFocus && ['CURRENT FOCUS', about.currentFocus],
  ].filter((item): item is string[] => Boolean(item))
  const hasBackgroundSnapshot = about.educations.length > 0 || about.awards.length > 0

  return (
    <main className={styles.page}>
      <div className={styles.contentInner}>
      <section className={styles.intro} aria-labelledby="about-title">
        <div className={styles.introCopy}>
          <h1 id="about-title" className={styles.heroTitle}>{about.heading}</h1>
          <p className={styles.introSummary}>{about.summary}</p>
          <div className={styles.introMeta}>
            {[
              'ABOUT',
              'PROFILE',
              about.position,
              about.background,
              about.currentFocus,
            ].filter(Boolean).join(' | ')}
          </div>
        </div>

        <article className={styles.profileWindow} aria-label={`${profileName} 프로필 정보`}>
          <div className={styles.windowBar}>
            <span className={styles.windowControls} aria-hidden="true"><i /><i /><i /></span>
            <span>profile.json — Visual Studio Code</span>
            <span>UTF-8</span>
          </div>
          <div className={styles.profilePanel}>
            <div className={styles.profileVisual}>
              {about.profileImageUrl && !profileImageError ? (
                <img
                  src={about.profileImageUrl}
                  alt={`${profileName} 프로필`}
                  onError={() => setProfileImageError(true)}
                />
              ) : (
                <div className={styles.profilePlaceholder} role="img" aria-label={`${profileName} 프로필 이미지 없음`}>
                  <span>PROFILE IMAGE</span>
                </div>
              )}
              <span>PROFILE / {about.nameEn ?? about.nameKo ?? 'ABOUT'}</span>
            </div>
            <div className={styles.profileIdentityPanel}>
              <p className={styles.profileLabel}>PROFILE · IDENTITY</p>
              {(about.nameKo || about.nameEn) && (
                <div className={styles.profileIdentity}>
                  {about.nameKo && <h2>{about.nameKo}</h2>}
                  {about.nameEn && <p>{about.nameEn}</p>}
                </div>
              )}
              {about.position && <p className={styles.profilePosition}>{about.position}</p>}
            </div>
            {profileFocus.length > 0 && (
              <dl className={styles.profileFocus}>
                {profileFocus.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            )}
            {profileMetadata.length > 0 && (
              <div className={styles.profileMetadata}>
                <dl>
                {profileMetadata.map(([label, value]) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
                </dl>
              </div>
            )}
          </div>

          {hasBackgroundSnapshot && (
            <section className={styles.profileHistory} aria-labelledby="background-snapshot-title">
            <h2 id="background-snapshot-title" className={styles.visuallyHidden}>학력 및 수상 정보</h2>
            <div className={styles.historyColumns}>
              {about.educations.length > 0 && (
                <section className={styles.historyGroup} aria-labelledby="education-title">
                  <h3 id="education-title" className={styles.historyLabel}>EDUCATION</h3>
                  <div className={styles.historyList}>
                    {about.educations.map((education, index) => (
                      <article className={styles.historyItem} key={`${education.displayOrder}-${education.institutionName}-${index}`}>
                        <p className={styles.historyType}>{educationTypeLabel(education.educationType)}</p>
                        <h4>{education.institutionName}</h4>
                        <p className={styles.historyPrimary}>{education.courseName}</p>
                        <p className={styles.historyMeta}>{formatPeriod(education.startDate, education.endDate)}{education.status && ` · ${education.status}`}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
              {about.awards.length > 0 && (
                <section className={styles.historyGroup} aria-labelledby="awards-title">
                  <h3 id="awards-title" className={styles.historyLabel}>AWARDS</h3>
                  <div className={styles.historyList}>
                    {about.awards.map((award, index) => (
                      <article className={styles.historyItem} key={`${award.displayOrder}-${award.title}-${index}`}>
                        <p className={styles.historyType}>AWARD</p>
                        <h4>{award.title}</h4>
                        <p className={styles.historyPrimary}>{award.issuer}</p>
                        <p className={styles.historyMeta}>{formatMonth(award.awardedDate)}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </section>
          )}

          {about.workExperiences.length > 0 && (
            <section className={styles.experienceSection} aria-labelledby="experience-title">
              <p className={styles.historyLabel}>PREVIOUS EXPERIENCE</p>
              <h2 id="experience-title" className={styles.visuallyHidden}>이전 근무 이력</h2>
              <div className={styles.experienceList}>
                {about.workExperiences.map((experience, index) => (
                  <article className={styles.experienceItem} key={`${experience.displayOrder}-${experience.companyName}-${index}`}>
                    <p className={styles.experiencePeriod}>{formatPeriod(experience.startDate, experience.endDate)}</p>
                    <div className={styles.experienceBody}>
                      <h3>{experience.companyName}</h3>
                      <p className={styles.experiencePosition}>{experience.positionTitle}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </article>
      </section>

      {about.competencies.length > 0 && (
        <section className={styles.competencies} aria-labelledby="about-competencies-title">
          <header className={styles.sectionHeader}>
            <p className={styles.kicker}>02 · CORE COMPETENCIES</p>
            <h2 id="about-competencies-title">무엇을 잘하는가</h2>
          </header>
          <div className={styles.competencyList}>
            {about.competencies.map((competency, index) => (
              <article
                key={`${competency.displayOrder}-${competency.title}-${index}`}
                className={styles.competencyItem}
              >
                <span className={styles.itemNumber}>{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{competency.title}</h3>
                  <p>{competency.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <AboutTechnicalSkills
        skillCategories={about.skillCategories}
        fallbackSection={technicalStackSection}
      />

      {troubleshootingSection && (
        <section className={styles.troubleshooting} aria-labelledby="about-troubleshooting-title">
          <header className={styles.sectionHeader}>
            <p className={styles.kicker}>04 · TROUBLESHOOTING</p>
            <h2 id="about-troubleshooting-title">{troubleshootingSection.title}</h2>
          </header>
          <RichTextContent
            html={troubleshootingSection.contentHtml}
            className={styles.troubleshootingContent}
          />
        </section>
      )}

      {storySections.length > 0 && (
        <section className={styles.stories} aria-labelledby="about-stories-title">
          <header className={styles.sectionHeader}>
            <p className={styles.kicker}>05 · MY STORY</p>
            <h2 id="about-stories-title">지금의 개발 방식을 만든 경험들</h2>
          </header>
          <div className={styles.storyList}>
            {storySections.map((section, index) => (
              <article
                key={`${section.displayOrder}-${section.title}-${index}`}
                className={styles.story}
                aria-labelledby={`about-story-${index}`}
              >
                <p className={styles.storyMeta}>
                  05.{String(index + 1).padStart(2, '0')} / STORY
                </p>
                <div className={styles.storyBody}>
                  <h3 id={`about-story-${index}`} className={styles.storyTitle}>{section.title}</h3>
                  <RichTextContent html={section.contentHtml} className={styles.storyContent} />
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
      </div>

      <section className={styles.resumeSection} aria-labelledby="about-resume-title">
        <div className={styles.resumeInner}>
          <div className={styles.resumeCopy}>
            <p className={styles.kicker}>06 · RESUME</p>
            <h2 id="about-resume-title">더 자세한 경험과<br />프로젝트를 확인해 주세요.</h2>
          </div>
          {contact?.resumeFileUrl && (
            <a
              href={contact.resumeFileUrl}
              className={styles.resumeLink}
              target={isHttpUrl(contact.resumeFileUrl) ? '_blank' : undefined}
              rel={isHttpUrl(contact.resumeFileUrl) ? 'noreferrer' : undefined}
            >
              <span>{contact.resumeLabel}</span><span aria-hidden="true">↗</span>
            </a>
          )}
        </div>
      </section>
    </main>
  )
}

export default AboutPage
