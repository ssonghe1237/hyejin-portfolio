import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { getAbout } from '../api/aboutApi'
import { getAllProjects, getProjectDetail } from '../api/projectApi'
import type { AboutResponse } from '../types/about'
import type { ProjectLinkResponse, ProjectListResponse } from '../types/project'
import profileImage from '../assets/profile/song-hyejin-profile.jpg'
import styles from './HomePage.module.css'

const skills = [
  ['BACKEND', 'Java', 'Spring Boot', 'JPA', 'REST API'],
  ['FRONTEND', 'React', 'TypeScript', 'Vite', 'API Integration'],
  ['DATABASE & AI', 'PostgreSQL', 'pgvector', 'RAG', 'Embedding'],
  ['INFRA & TOOLS', 'Docker', 'Git', 'Postman', 'Figma'],
]
const tools = [['Photoshop', '이미지 편집'], ['Illustrator', '그래픽 디자인'], ['Figma', 'UI/UX'], ['Notion', '문서·협업']]
const buildCards = [
  ['SERVICE BACKEND', '01', '서비스의 중심을\n견고하게 구현합니다.', 'REST API와 데이터 구조를 설계하고\nSpring Boot 기반 비즈니스 로직을 구현합니다.', 'Spring Boot · JPA · REST API'],
  ['DATA & AI', '02', '데이터를 검색과\n업무 경험으로 연결합니다.', 'PostgreSQL 기반 데이터 구조와\n검색·RAG 기능을 실제 서비스에 연결합니다.', 'PostgreSQL · pgvector · RAG'],
  ['FULL SERVICE FLOW', '03', 'API에서 화면까지\n흐름을 완성합니다.', '백엔드 API부터 React 사용자 화면과\n관리자 기능까지 이어지는 흐름을 구현합니다.', 'React · TypeScript · Admin'],
]
const processCards = [['요구사항 분석', '사용자 요구와 서비스 흐름 정의'], ['설계', 'DB · API · UI Flow 설계'], ['개발', 'Backend · Frontend 기능 구현'], ['검증과 개선', 'API 테스트 · 예외 처리 · 사용성 개선']]
const reasons = [
  ['기능보다 사용 흐름부터 생각합니다.', '사용자의 언어를 개발 요구사항으로 바꿉니다.'],
  ['설계를 실제 동작까지 연결합니다.', '맡은 기능을 끝까지 구현하고 검증합니다.'],
  ['서로 다른 직무의 언어를 이해합니다.', '기획·디자인·개발 사이를 연결합니다.'],
]

function HomePage() {
  const [projects, setProjects] = useState<ProjectListResponse[]>([])
  const [projectLinks, setProjectLinks] = useState<Record<number, ProjectLinkResponse[]>>({})
  const [projectStacks, setProjectStacks] = useState<Record<number, string>>({})
  const [projectState, setProjectState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [about, setAbout] = useState<AboutResponse | null>(null)

  useEffect(() => {
    let active = true
    getAllProjects().then(async (data) => {
      const selectedProjects = data.slice(0, 3)
      if (active) { setProjects(selectedProjects); setProjectState('ready') }
      const detailResults = await Promise.allSettled(selectedProjects.map((project) => getProjectDetail(project.slug)))
      if (!active) return
      const linksByProject = detailResults.reduce<Record<number, ProjectLinkResponse[]>>((links, result, index) => {
        if (result.status === 'fulfilled') links[selectedProjects[index].projectId] = result.value.links
        return links
      }, {})
      const stacksByProject = detailResults.reduce<Record<number, string>>((stacks, result, index) => {
        if (result.status === 'fulfilled') stacks[selectedProjects[index].projectId] = result.value.techStacks.map((stack) => stack.techName).join(' · ')
        return stacks
      }, {})
      setProjectLinks(linksByProject)
      setProjectStacks(stacksByProject)
    }).catch((error) => { console.error(error); if (active) setProjectState('error') })
    return () => { active = false }
  }, [])
  useEffect(() => {
    let active = true
    getAbout().then((data) => { if (active) setAbout(data) }).catch((error) => { console.error(error) })
    return () => { active = false }
  }, [])
  const email = 'ssonghe1237@gmail.com'
  const buildContent = buildCards
  return <div className={styles.page}>
    <div className={styles.heroWrap}><section className={styles.hero} aria-labelledby="home-title"><div className={styles.heroCopy}><p className={styles.eyebrow}>BACKEND · FULL-STACK · PRODUCT DEVELOPMENT</p><h1 id="home-title" className={styles.heroTitle}>사용자의 경험을<br />서비스의 구조로 만드는<br />개발자 송혜진입니다.</h1><p className={styles.heroDescription}>백엔드를 중심으로 API와 데이터 구조를 설계하고,<br />React 화면까지 하나의 서비스 흐름으로 구현합니다.</p><div className={styles.heroActions}><Link to="/work" className={styles.primaryButton}>대표 프로젝트 보기 ↗</Link><Link to="/about" className={styles.lightButton}>About me</Link></div></div><div className={styles.heroVisual} aria-hidden="true"><div className={`${styles.deviceCard} ${styles.profileDevice}`}><div className={styles.deviceTop}><span>PROFILE.JSON</span><span>2026</span></div><div className={styles.deviceBody}><strong className={styles.deviceTitle}>Backend-centered<br />Web Developer</strong><pre className={styles.codeBox}>{`{\n  "name": "Song Hyejin",\n  "stack": ["Java", "Spring Boot", "React"],\n  "status": "open to work"\n}`}</pre><p className={styles.deviceMeta}>FOCUS <b>Backend / Product</b><br />DB <b>PostgreSQL</b></p></div></div><div className={`${styles.deviceCard} ${styles.opsDevice}`}><div className={styles.deviceTop}><span>ADMIN / SYSTEM</span><span>● LIVE</span></div><div className={styles.deviceBody}><strong className={styles.opsTitle}>Operations</strong><div className={styles.chart} /><div className={styles.statusRow}><span>API STATUS<b>200 OK</b></span><span>BUILD<b>PASS</b></span></div></div></div></div></section></div>

    <section className={`${styles.section} ${styles.about}`} aria-labelledby="about-title"><div><p className={styles.kicker}>01 · ABOUT ME</p><h2 id="about-title">코드로 경험을 설계하고,<br />가치를 전달합니다.</h2><p className={styles.lead}>사용자 중심의 사고와 명확한 요구사항 분석을 바탕으로, 보이는 화면과 내부의 데이터 흐름을 함께 설계합니다.</p><Link to="/about" className={styles.resumeLink}>더 알아보기 →</Link></div><article className={styles.profileCard}><div className={styles.profileTop}><span>PROFILE</span><span className={styles.profileIcon} aria-hidden="true">↗</span></div><div className={styles.profileBody}><div className={styles.identity}><img src={profileImage} alt="송혜진 프로필 사진" /><div><h3>송혜진</h3><p>BACKEND · FULL-STACK DEVELOPER</p></div></div><p className={styles.profileDescription}>기획과 디자인 실무 경험을 개발의 강점으로 전환해, 서비스의 목적과 사용자 흐름을 이해하는 개발자입니다.</p></div><dl className={styles.profileDetails}><div><dt>POSITIONING</dt><dd>{about?.position ?? <>Backend-centered<br />Full-stack Developer</>}</dd></div><div><dt>LOCATION</dt><dd>{about?.location ?? 'Seoul, Korea'}</dd></div><div><dt>EMAIL</dt><dd>{email}</dd></div>{about?.interests && <div><dt>HOBBY</dt><dd>{about.interests}</dd></div>}</dl></article></section>

    <section className={`${styles.section} ${styles.buildSection}`} aria-labelledby="build-title"><div className={styles.sectionHead}><div><p className={styles.kicker}>02 · WHAT I BUILD</p><h2 id="build-title">어떤 개발이 가능한가</h2></div><p className={styles.lead}>사용자와 서비스에 대한 이해를 바탕으로, 실제로 맡아 구현할 수 있는 범위를 보여드립니다.</p></div><div className={styles.buildGrid}>{buildContent.map(([label, number, title, description, stack]) => <article className={styles.buildCard} key={label}><small>{label}</small><strong>{number}</strong><h3>{title}</h3><p>{description}</p><footer>{stack}</footer></article>)}</div></section>

    <section className={`${styles.section} ${styles.selectedWorkSection}`} aria-labelledby="work-title"><div className={styles.sectionHead}><div><p className={styles.kicker}>03 · SELECTED WORK</p><h2 id="work-title">실제로 구현한<br />대표 프로젝트</h2></div><p className={styles.lead}>아이디어가 실제 서비스가 되기까지, 기획부터 설계와 구현까지 연결한 결과물입니다.</p></div>{projectState === 'loading' ? <p className={styles.state}>대표 프로젝트를 불러오는 중입니다...</p> : projectState === 'error' ? <p className={styles.state} role="alert">대표 프로젝트를 불러오지 못했습니다.</p> : projects.length === 0 ? <p className={styles.state}>등록된 대표 프로젝트가 없습니다.</p> : <div className={styles.projectList}>{projects.map((project, index) => { const links = projectLinks[project.projectId] ?? []; const role = project.role ?? project.myRoleTitles.join(' · '); const stack = projectStacks[project.projectId] ?? project.techCategories.join(' · '); return <article key={project.projectId} className={styles.projectWindow}>{index === 0 && <span className={styles.featuredProjectNumber} aria-hidden="true">01</span>}<div className={styles.projectBar}><span className={styles.dots}><i /><i /><i /></span><span>work/{project.slug}</span></div><div className={styles.projectBody}><Link to={`/work/${project.slug}`} className={styles.projectVisual} aria-label={`${project.title} 상세 보기`}>{project.thumbnailUrl ? <ImageWithFallback src={project.thumbnailUrl} alt={`${project.title} 썸네일`} fallbackText="프로젝트 썸네일을 불러올 수 없습니다." height="100%" objectFit="cover" borderRadius="0" /> : <span>등록된 썸네일이 없습니다.</span>}</Link><div className={styles.projectInfo}><p className={styles.projectMeta}>{project.periodText} · {project.projectType}</p><h3><Link to={`/work/${project.slug}`}>{project.title}</Link></h3><p>{project.summary}</p><dl className={styles.projectFacts}>{role && <div><dt>ROLE</dt><dd>{role}</dd></div>}{stack && <div><dt>STACK</dt><dd>{stack}</dd></div>}</dl><Link to={`/work/${project.slug}`} className={styles.projectLink}>상세 보기 →</Link>{links.length > 0 && <div className={styles.projectExternalLinks}>{links.map((link) => <a key={link.projectLinkId} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.projectExternalLink}>{link.linkName} ↗</a>)}</div>}</div></div></article> })}</div>}</section>

    <section className={`${styles.section} ${styles.skills}`} aria-labelledby="skills-title"><div className={styles.sectionHead}><div><p className={styles.kicker}>04 · HOW I BUILD</p><h2 id="skills-title">아이디어를 실제 서비스로 구현하는 방법</h2></div><p className={styles.lead}>사용자의 요구를 이해하는 것에서 시작해 서비스 구조를 설계하고,<br />적절한 기술을 선택해 실제 동작하는 결과물까지 완성합니다.</p></div><div className={styles.howBuildContainer}><article className={styles.howBuildCard}><div className={styles.howBuildIntro}><p className={styles.kicker}>01 · DEVELOPMENT PROCESS</p><h3>이해하고, 설계하고, 구현한 뒤 검증합니다.</h3><p>요구사항을 정리하고 구조를 설계한 뒤,<br />구현과 검증을 반복하며 완성도를 높입니다.</p></div><div className={styles.processGrid}>{processCards.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><i aria-hidden="true">→</i><h4>{title}</h4><p>{description}</p></article>)}</div></article><article className={styles.howBuildCard}><div className={styles.howBuildIntro}><p className={styles.kicker}>02 · DEVELOPMENT STACK</p><h3>설계를 구현으로 옮기는 기술</h3><p>각 기술은 독립된 목록이 아니라,<br />서비스의 전체 흐름을 완성하기 위해 사용합니다.</p></div><div className={styles.codeFrame}><div className={styles.codeTop}><span className={styles.dots}><i /><i /><i /></span><span>skills.json — Visual Studio Code</span><span>UTF-8</span></div><div className={styles.codeBody}><div className={styles.skillsGrid}>{skills.map(([category, ...items]) => <article key={category}><h3>{category}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div><p className={styles.toolsLabel}>SUPPORTING TOOLS</p><ul className={styles.tools}>{tools.map(([name, description]) => <li key={name}><i /><b>{name}</b><span>{description}</span></li>)}</ul></div></div></article><article className={`${styles.howBuildCard} ${styles.designBuild}`}><div className={styles.howBuildIntro}><p className={styles.kicker}>03 · DESIGN TO DEVELOPMENT</p><h3>디자인 경험을 개발의 강점으로 확장했습니다.</h3><p>기획과 디자인에서 익힌 사용자 관점과 구조화 경험을<br />개발 과정의 강점으로 연결합니다.</p></div><div className={styles.capabilityGrid}>{['Product Planning','UI / UX','Visual Design','Documentation'].map((item) => <span key={item}>{item}</span>)}</div></article></div></section>

    <section className={`${styles.why} ${styles.whyCombined}`} aria-labelledby="why-title"><div className={styles.whyIntro}><p className={styles.kicker}>05 · LET’S WORK TOGETHER</p><h2 id="why-title">결국, 함께 일할<br />사람을 찾는 일이니까.</h2><p>사용자 관점과 구현력을 함께 가진 개발자를 찾고 있다면, 저와 다음 이야기를 시작해 주세요.</p><Link to="/contact" className={styles.lightButton}>이력서 보기 →</Link></div><div className={styles.whyGrid}>{reasons.map(([title, description], index) => <article key={title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section>
  </div>
}

export default HomePage
