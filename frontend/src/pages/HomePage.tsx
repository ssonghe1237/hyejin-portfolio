import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ImageWithFallback from '../components/common/ImageWithFallback'
import { getAboutCompetencies } from '../api/aboutApi'
import { getContact } from '../api/contactApi'
import { getAllProjects } from '../api/projectApi'
import type { AboutCompetencyResponse } from '../types/about'
import type { ContactResponse } from '../types/contact'
import type { ProjectListResponse } from '../types/project'
import profileImage from '../assets/profile/song-hyejin-profile.jpg'
import styles from './HomePage.module.css'

const skills = [
  {
    category: 'BACKEND',
    icon: '⚙️',
    items: ['Java', 'Spring Boot', 'JPA', 'REST API'],
  },
  {
    category: 'FRONTEND',
    icon: '🖥️',
    items: ['React', 'TypeScript', 'Vite'],
  },
  {
    category: 'DATABASE & AI',
    icon: '🧠',
    items: ['PostgreSQL', 'pgvector', 'RAG'],
  },
  {
    category: 'INFRA & TOOLS',
    icon: '🛠️',
    items: ['Docker', 'Git', 'Postman'],
  },
]
const tools = [['Photoshop', '이미지 편집'], ['Illustrator', '그래픽 디자인'], ['Figma', 'UI/UX'], ['Notion', '문서·협업']]
const keywords = ['API · DATA · SERVICE', 'UI · STATE · API', 'BUILD · DEPLOY · RUN']
const reasons = [
  ['사용자의 언어를 기능으로 번역합니다.', '요구사항을 기능 단위와 화면 흐름으로 정리해 구현 가능한 구조로 바꿉니다.'],
  ['화면에서 끝내지 않고 구조까지 연결합니다.', '사용자 화면에서 API, 데이터 구조까지 하나의 서비스 흐름으로 이어지도록 만듭니다.'],
  ['구현 이후의 운영과 개선까지 생각합니다.', '관리자 기능, 데이터 생명주기와 배포 이후 운영까지 고려해 구조를 결정합니다.'],
]

function HomePage() {
  const [projects, setProjects] = useState<ProjectListResponse[]>([])
  const [projectState, setProjectState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [competencies, setCompetencies] = useState<AboutCompetencyResponse[]>([])
  const [competencyState, setCompetencyState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [contact, setContact] = useState<ContactResponse | null>(null)

  useEffect(() => {
    let active = true
    getAllProjects().then((data) => { if (active) { setProjects(data.slice(0, 3)); setProjectState('ready') } }).catch((error) => { console.error(error); if (active) setProjectState('error') })
    return () => { active = false }
  }, [])

  useEffect(() => {
    let active = true
    getAboutCompetencies().then((data) => { if (active) { setCompetencies(data); setCompetencyState('ready') } }).catch((error) => { console.error(error); if (active) setCompetencyState('error') })
    return () => { active = false }
  }, [])
  
  useEffect(() => {
    let active = true
    getContact().then((data) => { if (active) setContact(data) }).catch(console.error)
    return () => { active = false }
  }, [])

  const email = contact?.email.trim() || 'ssonghe1237@gmail.com'

  return<div className={styles.page}>
    {/* 00 · 최상위 히어로 배너 */}
    <div className={styles.heroWrap}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>BACKEND · FULL-STACK · PRODUCT DEVELOPMENT</p>
          
          <h1 id="home-title" className={styles.heroTitle}>
            <span className={styles.heroTitleMedium}>
              사용자 화면부터 백엔드와 운영 구조까지
            </span>

            <span className={styles.heroTitleMedium}>
              연결하는 웹 개발자
            </span>
            
            <span className={styles.heroTitleBold}>
              송혜진 입니다:D
            </span>
          </h1>
          
          <p className={styles.heroDescription}>
            기획과 디자인 경험을 개발로 확장해, 요구사항을 구조화하고 실제 동작하는 서비스로 구현합니다.<br />
            Java/Spring Boot 기반 백엔드를 중심으로<br />
            React 사용자 화면, 데이터 구조, 관리자 기능과 운영까지 연결합니다.
          </p>
          
          <div className={styles.heroActions}>
            <Link to="/work" className={styles.primaryButton}>프로젝트 보기 →</Link>
            <Link to="/about" className={styles.lightButton}>About me</Link>
          </div>
        </div>
        
        {/* 꾸미기용 상자 디자인 요소 */}
        <div className={styles.heroVisual} aria-hidden="true">
          <div className={`${styles.deviceCard} ${styles.profileDevice}`}>
            <div className={styles.deviceTop}>
              <span>PROFILE.JSON</span>
              
              <span>2026</span>
            </div>
            
            <div className={styles.deviceBody}>
              <strong className={styles.deviceTitle}>
                Backend-centered<br />
                Web Developer
              </strong>
              
              <pre className={styles.codeBox}>
                {`{\n  "name": "Song Hyejin",\n  "stack": ["Java", "Spring Boot", "React"],\n  "status": "open to work"\n}`}
              </pre>
              
              <p className={styles.deviceMeta}>
                FOCUS <b>Backend / Product</b><br />
                DB <b>PostgreSQL</b>
              </p>
            </div>
          </div>
          
          <div className={`${styles.deviceCard} ${styles.opsDevice}`}>
            <div className={styles.deviceTop}>
              <span>ADMIN / SYSTEM</span>
              
              <span>● LIVE</span>
            </div>
            
          <div className={styles.deviceBody}>
            <strong className={styles.opsTitle}>Operations</strong>
            
            <div className={styles.chart} />
              <div className={styles.statusRow}>
                <span>API STATUS<b>200 OK</b></span>
                
                <span>BUILD<b>PASS</b></span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    {/* 01 · ABOUT */}
    <section className={`${styles.section} ${styles.about}`} aria-labelledby="about-title">
      <div>
        <p className={styles.kicker}>01 · ABOUT</p>
        
        <h2 id="about-title">
          기획에서 시작해<br />
          구현과 운영까지 봅니다.
        </h2>
        
        <p className={styles.lead}>
          사용자가 보는 화면뿐 아니라 API, 데이터 구조와 운영 이후까지 함께 고민합니다. 화면의 완성도와 백엔드 구조를 따로 보지 않고, 하나의 제품 흐름으로 연결하는 개발을 지향합니다.
        </p>

        <a
          href="/uploads/resumes/2026/08/d637a91a-65c0-4cde-916e-8b359a1e3668.pdf"
          target="_blank"
          rel="noreferrer"
          className={styles.resumeLink}
        >
          이력서 보기 →
        </a>  
      </div>
      
      {/* 이력서 느낌의 박스 */}
      <article className={styles.profileCard}>
        <div className={styles.profileTop}>
          <span>PROFILE / 2026</span>
          
          <span className={styles.profileIcon} aria-hidden="true">↗</span>
        </div>
        
        <div className={styles.profileBody}>
          <div className={styles.identity}>
            <img src={profileImage} alt="송혜진 프로필 사진" />
            
            <div>
              <h3>송혜진</h3>
              
              <p>SONG HYE JIN</p> 
            </div>
          </div>

          <p className={styles.profileDescription}>
            기획과 디자인 실무 경험을 바탕으로 사용자의 요구를 화면과 기능으로 구조화하고, 이를 실제 서비스로 구현하는 개발자로 확장했습니다.
          </p>
        </div>
        
        <dl className={styles.profileDetails}>
          <div>
            <dt>BIRTH</dt>
            <dd>1997.05.09</dd>
          </div>
          
          <div>
            <dt>EMAIL</dt>
            <dd>{email}</dd>
          </div>
          
          <div>
            <dt>LOCATION</dt>
            <dd>서울 양천구 목동</dd>
          </div>
          
          <div>
            <dt>INTERESTS</dt>
            <dd>
              트렌드 서칭 · 여기저기 ·<br />
              팝업 관람 · 등산
            </dd>
          </div>  
        </dl>
      </article>
    </section>

    {/* 02 · CORE COMPETENCIES */}
    <section className={styles.section} aria-labelledby="competencies-title">
      <p className={styles.kicker}>02 · CORE COMPETENCIES</p>
      
      <h2 id="competencies-title">무엇을 잘하는가</h2>
      
      {competencyState === 'loading' 
        ? <p className={styles.state}>핵심 역량을 불러오는 중입니다...</p> 
        : competencyState === 'error' 
          ? <p className={styles.state} role="alert">핵심 역량을 불러오지 못했습니다.</p> 
          : <div className={styles.competencyGrid}>{competencies.map((item, index) =>
              <article key={`${item.displayOrder}-${item.title}`} className={styles.competencyCard}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                
                <small>{keywords[index] || 'SERVICE · SYSTEM'}</small>
                
                <h3>{item.title}</h3>
                
                <p>{item.description}</p>
              </article>)}
            </div>}
    </section>

    {/* 03 · SELECTED WORK */}
    <section className={styles.section} aria-labelledby="work-title">
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.kicker}>03 · SELECTED WORK</p>
          
          <h2 id="work-title">대표 프로젝트</h2>
          
          <p className={styles.lead}>문제 정의부터 구조 설계, 구현과 검증까지 직접 참여한 대표 프로젝트를 소개합니다.</p>
        </div>
        
        <Link to="/work" className={styles.moreLink}>View all work →</Link>
      </div>
      
      {projectState === 'loading'
        ? <p className={styles.state}>대표 프로젝트를 불러오는 중입니다...</p>
        : projectState === 'error'
          ? <p className={styles.state} role="alert">대표 프로젝트를 불러오지 못했습니다.</p>
          : projects.length === 0
            ? <p className={styles.state}>등록된 대표 프로젝트가 없습니다.</p>
            : <div className={styles.projectList}>{projects.map((project) =>
                <article key={project.projectId} className={styles.projectWindow}>
                  <div className={styles.projectBar}>
                    <span className={styles.dots}>
                      <i /><i /><i />
                    </span>
                    
                    <span>work/{project.slug}</span>
                  </div>
                  
                  <div className={styles.projectBody}>
                    <Link to={`/work/${project.slug}`} className={styles.projectVisual} aria-label={`${project.title} 상세 보기`}>
                      {project.thumbnailUrl
                        ? <ImageWithFallback src={project.thumbnailUrl} alt={`${project.title} 썸네일`} fallbackText="프로젝트 썸네일을 불러올 수 없습니다." height="100%" objectFit="cover" borderRadius="0" />
                        : <span>등록된 썸네일이 없습니다.</span>}
                    </Link>
                      
                    <div className={styles.projectInfo}>
                      <p className={styles.projectMeta}>{project.periodText} · {project.projectType}</p>
                      
                      <h3>
                        <Link to={`/work/${project.slug}`}>{project.title}</Link>
                      </h3>
                      
                      <p>{project.summary}</p>
                      
                      {(project.role || project.techCategories.length > 0) && <small>{project.role || project.techCategories.join(' · ')}</small>}
                      
                      <Link to={`/work/${project.slug}`} className={styles.projectLink}>상세 보기 →</Link>
                    </div>
                  </div>
                </article>)}
              </div>}
    </section>

    {/* 04 · TECHNICAL SKILLS */}
    <section className={`${styles.section} ${styles.skills}`} aria-labelledby="skills-title">
      <p className={styles.kicker}>04 · TECHNICAL SKILLS</p>
      
      <h2 id="skills-title">어떤 기술로 구현하는가</h2>
      
      <div className={styles.codeFrame}>
        <div className={styles.codeTop}>
          <span className={styles.dots}>
            <i /><i /><i />
          </span>
          
          <span>skills.json — Visual Studio Code</span>
          
          <span>UTF-8</span>
        </div>
        
        <div className={styles.codeBody}>
          <div className={styles.skillsGrid}>
            {skills.map(({ category, icon, items }) => (
              <article key={category}>
                <h3>
                  <span className={styles.skillIcon} aria-hidden="true">
                    {icon}
                  </span>
                  {category}
                </h3>
                
                <ul>{items.map((item) =>
                  <li key={item}>{item}</li>)}
                </ul>
              </article>
            ))}
          </div>
          
          <p className={styles.toolsLabel}>SUPPORTING TOOLS</p>
          
          <ul className={styles.tools}>{tools.map(([name, description]) =>
            <li key={name}>
              <i /><b>{name}</b>
            
              <span>{description}</span>
            </li>)}
          </ul>
        </div>
      </div>
    </section>

    {/* 05 · WHY ME */}
    <div className={styles.whyTopBand}>
      <section className={`${styles.why} ${styles.whyTop}`} aria-labelledby="why-title">
        <p className={styles.kicker}>05 · WHY ME</p>
        
        <h2 id="why-title">디자인 경험을 개발의 강점으로<br />확장했습니다.</h2>
        
        <p>기획과 디자인에서 익힌 사용자 관점과 구조화 경험을 개발 과정의 강점으로 연결하고 있습니다.</p>
      </section>
    </div>
    
    <div className={styles.whyLowerBand}>
      <section className={`${styles.why} ${styles.whyBottom}`}>
        <div className={styles.whyGrid}>
          {reasons.map(([title, description], index) =>
          <article key={title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            
            <h3>{title}</h3>
            
            <p>{description}</p>
          </article>)}
        </div>
      </section>
    </div>

    {/* 06 · CONTACT */}
    <section id="contact" className={styles.contact} aria-labelledby="contact-title">
      <div className={styles.contactTop}>
        <div>
          <p className={styles.kicker}>06 · CONTACT</p>
          
          <h2 id="contact-title">똑똑,<br />지금도 여기 있습니다!</h2>
        </div>
        
        <a href={`mailto:${email}`}>{email}</a>
      </div>
      
      <div className={styles.contactGrid}>
        <article>
          <small>EMAIL</small>

          <p>편하게 메일 주세요.<br />협업과 새로운 기회에 열려 있습니다.</p>
          
          <a href={`mailto:${email}`}>메일 보내기 →</a>
        </article>
        
        <article>
          <small>GITHUB</small>
          
          <p>더 자세한 개발과 프로젝트를<br />확인해 보세요.</p>
          
          {contact?.githubUrl &&
          <a href={contact.githubUrl} target="_blank" rel="noreferrer">GitHub 살펴보기 →</a>}
        </article>
      </div>
    </section>
  </div>
}

export default HomePage
