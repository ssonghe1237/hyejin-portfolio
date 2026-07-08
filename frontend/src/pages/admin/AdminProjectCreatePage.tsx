/**
 * packageName    : frontend.src.pages.admin
 * fileName       : AdminProjectCreatePage.tsx
 * author         : Song
 * date           : 2026-07-07
 * description    : 관리자 프로젝트 등록 페이지
 *                  - 프로젝트 기본 정보 등록
 *                  - 썸네일, Hero 이미지, 기술스택 등록
 *                  - 상세 섹션, 섹션별 이미지, 관련 링크 등록
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-07        Song       최초 생성
 */

import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createAdminProject } from '../../api/adminProjectApi'
import type {
  AdminProjectCreateRequest,
  AdminProjectImageRequest,
  AdminProjectLinkRequest,
  AdminProjectSectionRequest,
  AdminProjectTechRequest,
  ProjectImageType,
  ProjectLinkType,
  ProjectSectionType,
} from '../../types/project'
import styles from './AdminProjectCreatePage.module.css'

const SECTION_TYPES: ProjectSectionType[] = [
  'CONTENTS',
  'OVERVIEW',
  'MY_ROLE',
  'TECH_STACK',
  'KEY_FEATURES',
  'ARCHITECTURE',
  'DATABASE_ERD',
  'WORKFLOW',
  'TROUBLESHOOTING',
  'RESULT',
  'LINKS',
]

const SECTION_IMAGE_TYPES: ProjectImageType[] = [
  'DETAIL',
  'ERD',
  'ARCHITECTURE',
  'SCREENSHOT',
]

const LINK_TYPES: ProjectLinkType[] = [
  'GITHUB',
  'DEPLOY',
  'PDF',
  'NOTION',
  'RESUME',
  'SARAMIN',
  'ETC',
]

const initialForm: AdminProjectCreateRequest = {
  title: '',
  slug: '',
  summary: '',
  description: null,
  projectType: 'TEAM',
  startDate: null,
  endDate: null,
  teamName: null,
  role: null,
  displayOrder: 0,
  published: false,
  thumbnailImage: null,
  heroImages: [],
  techStacks: [],
  sections: [],
  links: [],
}

function AdminProjectCreatePage() {
  const navigate = useNavigate()

  const [form, setForm] =
    useState<AdminProjectCreateRequest>(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function updateField<K extends keyof AdminProjectCreateRequest>(
    field: K,
    value: AdminProjectCreateRequest[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function addThumbnail() {
    updateField('thumbnailImage', {
      imageType: 'THUMBNAIL',
      imageUrl: '',
      caption: null,
      displayOrder: 1,
    })
  }

  function updateThumbnail(
    patch: Partial<AdminProjectImageRequest>,
  ) {
    setForm((previous) => ({
      ...previous,
      thumbnailImage: previous.thumbnailImage
        ? {
            ...previous.thumbnailImage,
            ...patch,
          }
        : null,
    }))
  }

  function addHeroImage() {
    const image: AdminProjectImageRequest = {
      imageType: 'MAIN',
      imageUrl: '',
      caption: null,
      displayOrder: form.heroImages.length + 1,
    }

    updateField('heroImages', [...form.heroImages, image])
  }

  function updateHeroImage(
    index: number,
    patch: Partial<AdminProjectImageRequest>,
  ) {
    updateField(
      'heroImages',
      form.heroImages.map((image, imageIndex) =>
        imageIndex === index ? { ...image, ...patch } : image,
      ),
    )
  }

  function removeHeroImage(index: number) {
    updateField(
      'heroImages',
      form.heroImages.filter((_, imageIndex) => imageIndex !== index),
    )
  }

  function addTechStack() {
    const tech: AdminProjectTechRequest = {
      techName: '',
      techCategory: null,
      displayOrder: form.techStacks.length + 1,
    }

    updateField('techStacks', [...form.techStacks, tech])
  }

  function updateTechStack(
    index: number,
    patch: Partial<AdminProjectTechRequest>,
  ) {
    updateField(
      'techStacks',
      form.techStacks.map((tech, techIndex) =>
        techIndex === index ? { ...tech, ...patch } : tech,
      ),
    )
  }

  function removeTechStack(index: number) {
    updateField(
      'techStacks',
      form.techStacks.filter((_, techIndex) => techIndex !== index),
    )
  }

  function addSection() {
    const section: AdminProjectSectionRequest = {
      sectionType: 'OVERVIEW',
      title: null,
      content: null,
      displayOrder: form.sections.length + 1,
      images: [],
    }

    updateField('sections', [...form.sections, section])
  }

  function updateSection(
    index: number,
    patch: Partial<AdminProjectSectionRequest>,
  ) {
    updateField(
      'sections',
      form.sections.map((section, sectionIndex) =>
        sectionIndex === index
          ? { ...section, ...patch }
          : section,
      ),
    )
  }

  function removeSection(index: number) {
    updateField(
      'sections',
      form.sections.filter(
        (_, sectionIndex) => sectionIndex !== index,
      ),
    )
  }

  function addSectionImage(sectionIndex: number) {
    const section = form.sections[sectionIndex]

    const image: AdminProjectImageRequest = {
      imageType: 'SCREENSHOT',
      imageUrl: '',
      caption: null,
      displayOrder: section.images.length + 1,
    }

    updateSection(sectionIndex, {
      images: [...section.images, image],
    })
  }

  function updateSectionImage(
    sectionIndex: number,
    imageIndex: number,
    patch: Partial<AdminProjectImageRequest>,
  ) {
    const section = form.sections[sectionIndex]

    updateSection(sectionIndex, {
      images: section.images.map((image, currentImageIndex) =>
        currentImageIndex === imageIndex
          ? { ...image, ...patch }
          : image,
      ),
    })
  }

  function removeSectionImage(
    sectionIndex: number,
    imageIndex: number,
  ) {
    const section = form.sections[sectionIndex]

    updateSection(sectionIndex, {
      images: section.images.filter(
        (_, currentImageIndex) => currentImageIndex !== imageIndex,
      ),
    })
  }

  function addLink() {
    const link: AdminProjectLinkRequest = {
      linkType: 'GITHUB',
      linkName: '',
      url: '',
      displayOrder: form.links.length + 1,
    }

    updateField('links', [...form.links, link])
  }

  function updateLink(
    index: number,
    patch: Partial<AdminProjectLinkRequest>,
  ) {
    updateField(
      'links',
      form.links.map((link, linkIndex) =>
        linkIndex === index ? { ...link, ...patch } : link,
      ),
    )
  }

  function removeLink(index: number) {
    updateField(
      'links',
      form.links.filter((_, linkIndex) => linkIndex !== index),
    )
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    try {
      setSubmitting(true)
      setErrorMessage(null)

      const result = await createAdminProject(form)

      navigate(`/admin/projects/${result.projectId}`)
    } catch (error) {
      console.error(error)

      setErrorMessage(
        error instanceof Error
          ? error.message
          : '프로젝트를 등록하지 못했습니다.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Link to="/admin/projects" className={styles.backLink}>
        ← 관리자 프로젝트 목록으로 돌아가기
      </Link>

      <header>
        <h1 className={styles.title}>Create Project</h1>
        <p className={styles.description}>
          프로젝트 기본 정보와 상세 콘텐츠를 등록합니다.
        </p>
      </header>

      {errorMessage && (
        <div className={styles.error}>{errorMessage}</div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.card}>
          <legend>기본 정보</legend>

          <div className={styles.grid}>
            <label className={styles.field}>
              <span>프로젝트명</span>
              <input
                required
                value={form.title}
                onChange={(event) =>
                  updateField('title', event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>Slug</span>
              <input
                required
                value={form.slug}
                placeholder="personal-portfolio"
                onChange={(event) =>
                  updateField('slug', event.target.value)
                }
              />
            </label>

            <label className={styles.field}>
              <span>프로젝트 유형</span>
              <select
                value={form.projectType}
                onChange={(event) =>
                  updateField(
                    'projectType',
                    event.target.value as 'TEAM' | 'PERSONAL',
                  )
                }
              >
                <option value="TEAM">TEAM</option>
                <option value="PERSONAL">PERSONAL</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>표시 순서</span>
              <input
                type="number"
                min="0"
                value={form.displayOrder}
                onChange={(event) =>
                  updateField(
                    'displayOrder',
                    Number(event.target.value),
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>시작일</span>
              <input
                type="date"
                value={form.startDate ?? ''}
                onChange={(event) =>
                  updateField(
                    'startDate',
                    event.target.value || null,
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>종료일</span>
              <input
                type="date"
                value={form.endDate ?? ''}
                onChange={(event) =>
                  updateField(
                    'endDate',
                    event.target.value || null,
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>팀명</span>
              <input
                value={form.teamName ?? ''}
                onChange={(event) =>
                  updateField(
                    'teamName',
                    event.target.value || null,
                  )
                }
              />
            </label>

            <label className={styles.field}>
              <span>담당 역할</span>
              <input
                value={form.role ?? ''}
                onChange={(event) =>
                  updateField('role', event.target.value || null)
                }
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>요약</span>
            <textarea
              required
              rows={3}
              value={form.summary}
              onChange={(event) =>
                updateField('summary', event.target.value)
              }
            />
          </label>

          <label className={styles.field}>
            <span>상세 설명</span>
            <textarea
              rows={5}
              value={form.description ?? ''}
              onChange={(event) =>
                updateField(
                  'description',
                  event.target.value || null,
                )
              }
            />
          </label>

          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) =>
                updateField('published', event.target.checked)
              }
            />
            사용자 화면에 공개
          </label>
        </fieldset>

        <fieldset className={styles.card}>
          <div className={styles.sectionHeader}>
            <legend>목록 썸네일</legend>

            {!form.thumbnailImage && (
              <button type="button" onClick={addThumbnail}>
                썸네일 추가
              </button>
            )}
          </div>

          {form.thumbnailImage && (
            <div className={styles.arrayItem}>
              <label className={styles.field}>
                <span>이미지 URL</span>
                <input
                  required
                  value={form.thumbnailImage.imageUrl}
                  onChange={(event) =>
                    updateThumbnail({
                      imageUrl: event.target.value,
                    })
                  }
                />
              </label>

              <label className={styles.field}>
                <span>설명</span>
                <input
                  value={form.thumbnailImage.caption ?? ''}
                  onChange={(event) =>
                    updateThumbnail({
                      caption: event.target.value || null,
                    })
                  }
                />
              </label>

              <button
                type="button"
                className={styles.removeButton}
                onClick={() =>
                  updateField('thumbnailImage', null)
                }
              >
                썸네일 제거
              </button>
            </div>
          )}
        </fieldset>

        <fieldset className={styles.card}>
          <div className={styles.sectionHeader}>
            <legend>Hero Images</legend>
            <button type="button" onClick={addHeroImage}>
              이미지 추가
            </button>
          </div>

          <div className={styles.arrayList}>
            {form.heroImages.map((image, index) => (
              <div key={index} className={styles.arrayItem}>
                <label className={styles.field}>
                  <span>이미지 URL</span>
                  <input
                    required
                    value={image.imageUrl}
                    onChange={(event) =>
                      updateHeroImage(index, {
                        imageUrl: event.target.value,
                      })
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>설명</span>
                  <input
                    value={image.caption ?? ''}
                    onChange={(event) =>
                      updateHeroImage(index, {
                        caption: event.target.value || null,
                      })
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>표시 순서</span>
                  <input
                    type="number"
                    min="0"
                    value={image.displayOrder}
                    onChange={(event) =>
                      updateHeroImage(index, {
                        displayOrder: Number(event.target.value),
                      })
                    }
                  />
                </label>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeHeroImage(index)}
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.card}>
          <div className={styles.sectionHeader}>
            <legend>Tech Stacks</legend>
            <button type="button" onClick={addTechStack}>
              기술 추가
            </button>
          </div>

          <div className={styles.arrayList}>
            {form.techStacks.map((tech, index) => (
              <div key={index} className={styles.arrayItem}>
                <label className={styles.field}>
                  <span>기술명</span>
                  <input
                    required
                    value={tech.techName}
                    onChange={(event) =>
                      updateTechStack(index, {
                        techName: event.target.value,
                      })
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>카테고리</span>
                  <input
                    value={tech.techCategory ?? ''}
                    onChange={(event) =>
                      updateTechStack(index, {
                        techCategory:
                          event.target.value || null,
                      })
                    }
                  />
                </label>

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeTechStack(index)}
                >
                  제거
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.card}>
          <div className={styles.sectionHeader}>
            <legend>Sections</legend>
            <button type="button" onClick={addSection}>
              섹션 추가
            </button>
          </div>

          <div className={styles.arrayList}>
            {form.sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={styles.sectionItem}
              >
                <div className={styles.grid}>
                  <label className={styles.field}>
                    <span>섹션 유형</span>
                    <select
                      value={section.sectionType}
                      onChange={(event) =>
                        updateSection(sectionIndex, {
                          sectionType:
                            event.target
                              .value as ProjectSectionType,
                        })
                      }
                    >
                      {SECTION_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span>제목</span>
                    <input
                      value={section.title ?? ''}
                      onChange={(event) =>
                        updateSection(sectionIndex, {
                          title: event.target.value || null,
                        })
                      }
                    />
                  </label>
                </div>

                <label className={styles.field}>
                  <span>본문</span>
                  <textarea
                    rows={6}
                    value={section.content ?? ''}
                    onChange={(event) =>
                      updateSection(sectionIndex, {
                        content: event.target.value || null,
                      })
                    }
                  />
                </label>

                <div className={styles.sectionHeader}>
                  <strong>섹션 이미지</strong>
                  <button
                    type="button"
                    onClick={() =>
                      addSectionImage(sectionIndex)
                    }
                  >
                    이미지 추가
                  </button>
                </div>

                {section.images.map((image, imageIndex) => (
                  <div
                    key={imageIndex}
                    className={styles.nestedItem}
                  >
                    <select
                      value={image.imageType}
                      onChange={(event) =>
                        updateSectionImage(
                          sectionIndex,
                          imageIndex,
                          {
                            imageType:
                              event.target
                                .value as ProjectImageType,
                          },
                        )
                      }
                    >
                      {SECTION_IMAGE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>

                    <input
                      required
                      placeholder="이미지 URL"
                      value={image.imageUrl}
                      onChange={(event) =>
                        updateSectionImage(
                          sectionIndex,
                          imageIndex,
                          {
                            imageUrl: event.target.value,
                          },
                        )
                      }
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeSectionImage(
                          sectionIndex,
                          imageIndex,
                        )
                      }
                    >
                      제거
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeSection(sectionIndex)}
                >
                  섹션 제거
                </button>
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className={styles.card}>
          <div className={styles.sectionHeader}>
            <legend>Links</legend>
            <button type="button" onClick={addLink}>
              링크 추가
            </button>
          </div>

          {form.links.map((link, index) => (
            <div key={index} className={styles.arrayItem}>
              <select
                value={link.linkType}
                onChange={(event) =>
                  updateLink(index, {
                    linkType:
                      event.target.value as ProjectLinkType,
                  })
                }
              >
                {LINK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <input
                required
                placeholder="링크 이름"
                value={link.linkName}
                onChange={(event) =>
                  updateLink(index, {
                    linkName: event.target.value,
                  })
                }
              />

              <input
                required
                placeholder="URL"
                value={link.url}
                onChange={(event) =>
                  updateLink(index, {
                    url: event.target.value,
                  })
                }
              />

              <button
                type="button"
                className={styles.removeButton}
                onClick={() => removeLink(index)}
              >
                제거
              </button>
            </div>
          ))}
        </fieldset>

        <div className={styles.actions}>
          <Link to="/admin/projects">취소</Link>

          <button type="submit" disabled={submitting}>
            {submitting ? '등록 중...' : '프로젝트 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AdminProjectCreatePage