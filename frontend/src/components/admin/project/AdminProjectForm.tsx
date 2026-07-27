/**
 * packageName    : frontend.src.components.admin.project
 * fileName       : AdminProjectForm.tsx
 * author         : Song
 * date           : 2026-07-09
 * description    : 관리자 프로젝트 등록/수정 공통 폼 컴포넌트
 *                  - 프로젝트 기본 정보 입력
 *                  - 썸네일, Hero 이미지, 기술스택 입력
 *                  - 상세 섹션, 섹션별 이미지, 관련 링크 입력
 *                  - 기존 하위 데이터 ID 기준 선택 삭제 상태 관리
 *                  - 등록 및 수정 페이지 공통 사용
 *                  - 필수 입력 표시 및 동적 항목 버튼 UI 개선
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-09        Song       최초 생성
 * 2026-07-27        Song       관리자 프로젝트 폼 UX 개선
 */

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import type {
  AdminProjectFormImage,
  AdminProjectFormLink,
  AdminProjectFormSection,
  AdminProjectFormState,
  AdminProjectFormTech,
  ProjectImageType,
  ProjectLinkType,
  ProjectSectionType,
  ProjectType,
} from '../../../types/project'
import styles from './AdminProjectForm.module.css'

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

type AdminProjectFormMode = 'create' | 'update'

interface AdminProjectFormProps {
  mode: AdminProjectFormMode
  initialValue: AdminProjectFormState
  submitting: boolean
  cancelTo: string
  onSubmit: (
    form: AdminProjectFormState,
  ) => Promise<void> | void
}

// 삭제 ID 목록에 동일한 ID가 중복해서 들어가는 것을 방지
function appendUniqueId(
  ids: number[],
  targetId: number,
): number[] {
  if (ids.includes(targetId)) {
    return ids
  }

  return [...ids, targetId]
}

// 필수 입력사항 표시
function RequiredMark() {
  return (
    <span className={styles.requiredMark}>
        *
    </span>
  )
}

function AdminProjectForm({
  mode,
  initialValue,
  submitting,
  cancelTo,
  onSubmit,
}: AdminProjectFormProps) {
  const [form, setForm] =
    useState<AdminProjectFormState>(initialValue)

  // 프로젝트 최상위 필드 변경
  function updateField<K extends keyof AdminProjectFormState>(
    field: K,
    value: AdminProjectFormState[K],
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }))
  }

  function handleProjectTypeChange(projectType: ProjectType) {
    setForm((previous) => ({
      ...previous,
      projectType,
      teamName: projectType === 'TEAM'
        ? previous.teamName
        : null,
    }))
  }

  // =====================================================================================
  // 썸네일
  // =====================================================================================

  // 신규 썸네일 입력 영역 추가
  function addThumbnail() {
    updateField('thumbnailImage', {
      projectImageId: null,
      imageType: 'THUMBNAIL',
      imageUrl: '',
      caption: null,
      displayOrder: 1,
    })
  }

  // 썸네일 정보 변경
  function updateThumbnail(
    patch: Partial<AdminProjectFormImage>,
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

  /**
   * 썸네일 제거
   *
   * 기존 썸네일이면 deletedImageIds에 ID를 저장하고,
   * 신규 썸네일이면 폼 상태에서만 제거한다.
   */
  function removeThumbnail() {
    setForm((previous) => {
      const thumbnail = previous.thumbnailImage

      if (!thumbnail) {
        return previous
      }

      const deletedImageIds =
        thumbnail.projectImageId !== null
          ? appendUniqueId(
              previous.deletedImageIds,
              thumbnail.projectImageId,
            )
          : previous.deletedImageIds

      return {
        ...previous,
        thumbnailImage: null,
        deletedImageIds,
      }
    })
  }

  // =====================================================================================
  // Hero 이미지
  // =====================================================================================

  // 신규 Hero 이미지 추가
  function addHeroImage() {
    setForm((previous) => {
      const image: AdminProjectFormImage = {
        projectImageId: null,
        imageType: 'MAIN',
        imageUrl: '',
        caption: null,
        displayOrder: previous.heroImages.length + 1,
      }

      return {
        ...previous,
        heroImages: [
          ...previous.heroImages,
          image,
        ],
      }
    })
  }

  // Hero 이미지 정보 변경
  function updateHeroImage(
    index: number,
    patch: Partial<AdminProjectFormImage>,
  ) {
    setForm((previous) => ({
      ...previous,
      heroImages: previous.heroImages.map(
        (image, imageIndex) =>
          imageIndex === index
            ? {
                ...image,
                ...patch,
              }
            : image,
      ),
    }))
  }

  // Hero 이미지 선택 삭제
  function removeHeroImage(index: number) {
    setForm((previous) => {
      const target = previous.heroImages[index]

      if (!target) {
        return previous
      }

      const deletedImageIds =
        target.projectImageId !== null
          ? appendUniqueId(
              previous.deletedImageIds,
              target.projectImageId,
            )
          : previous.deletedImageIds

      return {
        ...previous,
        heroImages: previous.heroImages.filter(
          (_, imageIndex) => imageIndex !== index,
        ),
        deletedImageIds,
      }
    })
  }

  // =====================================================================================
  // 기술스택
  // =====================================================================================

  // 신규 기술스택 추가
  function addTechStack() {
    setForm((previous) => {
      const tech: AdminProjectFormTech = {
        projectTechId: null,
        techName: '',
        techCategory: null,
        displayOrder: previous.techStacks.length + 1,
      }

      return {
        ...previous,
        techStacks: [
          ...previous.techStacks,
          tech,
        ],
      }
    })
  }

  /**
   * 기술스택 정보 변경
   */
  function updateTechStack(
    index: number,
    patch: Partial<AdminProjectFormTech>,
  ) {
    setForm((previous) => ({
      ...previous,
      techStacks: previous.techStacks.map(
        (tech, techIndex) =>
          techIndex === index
            ? {
                ...tech,
                ...patch,
              }
            : tech,
      ),
    }))
  }

  /**
   * 기술스택 선택 삭제
   */
  function removeTechStack(index: number) {
    setForm((previous) => {
      const target = previous.techStacks[index]

      if (!target) {
        return previous
      }

      const deletedTechIds =
        target.projectTechId !== null
          ? appendUniqueId(
              previous.deletedTechIds,
              target.projectTechId,
            )
          : previous.deletedTechIds

      return {
        ...previous,
        techStacks: previous.techStacks.filter(
          (_, techIndex) => techIndex !== index,
        ),
        deletedTechIds,
      }
    })
  }

  // =====================================================================================
  // 섹션
  // =====================================================================================

  /**
   * 신규 섹션 추가
   */
  function addSection() {
    setForm((previous) => {
      const section: AdminProjectFormSection = {
        sectionId: null,
        sectionType: 'OVERVIEW',
        title: null,
        content: null,
        displayOrder: previous.sections.length + 1,
        images: [],
      }

      return {
        ...previous,
        sections: [
          ...previous.sections,
          section,
        ],
      }
    })
  }

  /**
   * 섹션 정보 변경
   */
  function updateSection(
    index: number,
    patch: Partial<AdminProjectFormSection>,
  ) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map(
        (section, sectionIndex) =>
          sectionIndex === index
            ? {
                ...section,
                ...patch,
              }
            : section,
      ),
    }))
  }

  /**
   * 섹션 선택 삭제
   *
   * 기존 섹션이면 deletedSectionIds에 ID를 저장한다.
   * 섹션 내부 이미지는 백엔드에서 섹션보다 먼저 자동 삭제하므로
   * deletedImageIds에 별도로 추가하지 않는다.
   */
  function removeSection(index: number) {
    setForm((previous) => {
      const target = previous.sections[index]

      if (!target) {
        return previous
      }

      const deletedSectionIds =
        target.sectionId !== null
          ? appendUniqueId(
              previous.deletedSectionIds,
              target.sectionId,
            )
          : previous.deletedSectionIds

      return {
        ...previous,
        sections: previous.sections.filter(
          (_, sectionIndex) =>
            sectionIndex !== index,
        ),
        deletedSectionIds,
      }
    })
  }

  // =====================================================================================
  // 섹션 이미지
  // =====================================================================================

  /**
   * 섹션에 신규 이미지 추가
   */
  function addSectionImage(sectionIndex: number) {
    setForm((previous) => {
      const section =
        previous.sections[sectionIndex]

      if (!section) {
        return previous
      }

      const image: AdminProjectFormImage = {
        projectImageId: null,
        imageType: 'SCREENSHOT',
        imageUrl: '',
        caption: null,
        displayOrder: section.images.length + 1,
      }

      return {
        ...previous,
        sections: previous.sections.map(
          (currentSection, currentSectionIndex) =>
            currentSectionIndex === sectionIndex
              ? {
                  ...currentSection,
                  images: [
                    ...currentSection.images,
                    image,
                  ],
                }
              : currentSection,
        ),
      }
    })
  }

  // 섹션 이미지 정보 변경
  function updateSectionImage(
    sectionIndex: number,
    imageIndex: number,
    patch: Partial<AdminProjectFormImage>,
  ) {
    setForm((previous) => ({
      ...previous,
      sections: previous.sections.map(
        (section, currentSectionIndex) => {
          if (currentSectionIndex !== sectionIndex) {
            return section
          }

          return {
            ...section,
            images: section.images.map(
              (image, currentImageIndex) =>
                currentImageIndex === imageIndex
                  ? {
                      ...image,
                      ...patch,
                    }
                  : image,
            ),
          }
        },
      ),
    }))
  }

  /**
   * 섹션 이미지 선택 삭제
   */
  function removeSectionImage(
    sectionIndex: number,
    imageIndex: number,
  ) {
    setForm((previous) => {
      const section =
        previous.sections[sectionIndex]
      const target = section?.images[imageIndex]

      if (!section || !target) {
        return previous
      }

      const deletedImageIds =
        target.projectImageId !== null
          ? appendUniqueId(
              previous.deletedImageIds,
              target.projectImageId,
            )
          : previous.deletedImageIds

      return {
        ...previous,
        deletedImageIds,
        sections: previous.sections.map(
          (currentSection, currentSectionIndex) =>
            currentSectionIndex === sectionIndex
              ? {
                  ...currentSection,
                  images: currentSection.images.filter(
                    (_, currentImageIndex) =>
                      currentImageIndex !== imageIndex,
                  ),
                }
              : currentSection,
        ),
      }
    })
  }

  // =====================================================================================
  // 링크
  // =====================================================================================

  /**
   * 신규 링크 추가
   */
  function addLink() {
    setForm((previous) => {
      const link: AdminProjectFormLink = {
        projectLinkId: null,
        linkType: 'GITHUB',
        linkName: '',
        url: '',
        displayOrder: previous.links.length + 1,
      }

      return {
        ...previous,
        links: [
          ...previous.links,
          link,
        ],
      }
    })
  }

  /**
   * 링크 정보 변경
   */
  function updateLink(
    index: number,
    patch: Partial<AdminProjectFormLink>,
  ) {
    setForm((previous) => ({
      ...previous,
      links: previous.links.map(
        (link, linkIndex) =>
          linkIndex === index
            ? {
                ...link,
                ...patch,
              }
            : link,
      ),
    }))
  }

  /**
   * 링크 선택 삭제
   */
  function removeLink(index: number) {
    setForm((previous) => {
      const target = previous.links[index]

      if (!target) {
        return previous
      }

      const deletedLinkIds =
        target.projectLinkId !== null
          ? appendUniqueId(
              previous.deletedLinkIds,
              target.projectLinkId,
            )
          : previous.deletedLinkIds

      return {
        ...previous,
        links: previous.links.filter(
          (_, linkIndex) => linkIndex !== index,
        ),
        deletedLinkIds,
      }
    })
  }

  // =====================================================================================
  // 제출
  // =====================================================================================

  /**
   * 공통 폼 제출
   *
   * API 호출은 하지 않고 현재 폼 상태를 부모 페이지에 전달한다.
   */
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    await onSubmit(form)
  }

  const submitLabel =
    mode === 'create'
      ? '프로젝트 등록'
      : '프로젝트 수정'

  const submittingLabel =
    mode === 'create'
      ? '등록 중...'
      : '수정 중...'

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
    >
      <fieldset className={styles.card}>
        <legend>기본 정보</legend>

        <div className={styles.grid}>
          <label className={styles.field}>
            <span>
              프로젝트명
              <RequiredMark />
            </span>
            <input
              required
              value={form.title}
              onChange={(event) =>
                updateField(
                  'title',
                  event.target.value,
                )
              }
            />
          </label>

          <label className={styles.field}>
            <span>
              Slug
              <RequiredMark />
            </span>
            <input
              required
              value={form.slug}
              placeholder="personal-portfolio"
              onChange={(event) =>
                updateField(
                  'slug',
                  event.target.value,
                )
              }
            />
          </label>

          <label className={styles.field}>
            <span>
              프로젝트 유형
              <RequiredMark />
            </span>
            
            <select
              value={form.projectType}
              onChange={(event) =>
                handleProjectTypeChange(
                  event.target.value as ProjectType,
                )
              }
            >
              <option value="TEAM">TEAM</option>
              <option value="PERSONAL">
                PERSONAL
              </option>
            </select>
          </label>

          <label className={styles.field}>
            <span>
              표시 순서
              <RequiredMark />
            </span>

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

          {form.projectType === 'TEAM' && (
            <label className={styles.field}>
              <span>
                팀명
                <RequiredMark />
              </span>

              <input
                required
                value={form.teamName ?? ''}
                onChange={(event) =>
                  updateField(
                    'teamName',
                    event.target.value || null,
                  )
                }
              />
            </label>
          )}
          

          <label className={styles.field}>
            <span>담당 역할</span>
            <input
              value={form.role ?? ''}
              onChange={(event) =>
                updateField(
                  'role',
                  event.target.value || null,
                )
              }
            />
          </label>
        </div>

        <label className={styles.field}>
          <span>
            요약
            <RequiredMark />
          </span>
          <textarea
            required
            rows={3}
            value={form.summary}
            onChange={(event) =>
              updateField(
                'summary',
                event.target.value,
              )
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
              updateField(
                'published',
                event.target.checked,
              )
            }
          />
          사용자 화면에 공개
        </label>
      </fieldset>

      <fieldset className={styles.card}>
        <div className={styles.sectionHeader}>
          <legend>목록 썸네일</legend>
        </div>

        {!form.thumbnailImage && (
          <button
            type="button"
            className={styles.addButton}
            onClick={addThumbnail}
          >
            + 썸네일 추가
          </button>
        )}

        {form.thumbnailImage && (
          <div className={styles.arrayItem}>
            <div className={styles.fieldWithRemove}>
              <label className={styles.field}>
                <span>
                  이미지 URL
                  <RequiredMark />
                </span>

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

              <button
                type="button"
                className={styles.removeIconButton}
                onClick={removeThumbnail}
                aria-label="썸네일 제거"
              >
                ×
              </button>
            </div>

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
          </div>
        )}
      </fieldset>

      <fieldset className={styles.card}>
        <div className={styles.sectionHeader}>
          <legend>Hero Images</legend>
        </div>

        <div className={styles.arrayList}>
          {form.heroImages.map(
            (image, index) => (
              <div
                key={
                  image.projectImageId ??
                  `new-hero-${index}`
                }
                className={styles.arrayItem}
              >
                <div className={styles.fieldWithRemove}>
                  <label className={styles.field}>
                    <span>이미지 URL</span>
                    <input
                      required
                      value={image.imageUrl}
                      onChange={(event) =>
                        updateHeroImage(index, {
                          imageUrl:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <button
                    type="button"
                    className={styles.removeIconButton}
                    onClick={() => removeHeroImage(index)}
                    aria-label="Hero 이미지 제거"
                  >
                    ×
                  </button>
                </div>

                <label className={styles.field}>
                  <span>설명</span>
                  <input
                    value={image.caption ?? ''}
                    onChange={(event) =>
                      updateHeroImage(index, {
                        caption:
                          event.target.value ||
                          null,
                      })
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>
                    표시 순서
                    <RequiredMark />
                  </span>

                  <input
                    type="number"
                    min="0"
                    value={image.displayOrder}
                    onChange={(event) =>
                      updateHeroImage(index, {
                        displayOrder: Number(
                          event.target.value,
                        ),
                      })
                    }
                  />
                </label>
              </div>
            ),
          )}
        </div>

        <button
            type="button"
            className={styles.addButton}
            onClick={addHeroImage}
        >
          + 이미지 추가
        </button>
      </fieldset>

      <fieldset className={styles.card}>
        <div className={styles.sectionHeader}>
          <legend>Tech Stacks</legend>
        </div>

        <div className={styles.arrayList}>
          {form.techStacks.map(
            (tech, index) => (
              <div
                key={
                  tech.projectTechId ??
                  `new-tech-${index}`
                }
                className={styles.arrayItem}
              >
                <div className={styles.fieldWithRemove}>
                  <label className={styles.field}>
                    <span>기술명</span>
                    <input
                      required
                      value={tech.techName}
                      onChange={(event) =>
                        updateTechStack(index, {
                          techName:
                            event.target.value,
                        })
                      }
                    />
                  </label>

                  <button
                    type="button"
                    className={styles.removeIconButton}
                    onClick={() => removeTechStack(index)}
                    aria-label="기술스택 제거"
                  >
                    ×
                  </button>
                </div>

                <label className={styles.field}>
                  <span>카테고리</span>
                  <input
                    value={
                      tech.techCategory ?? ''
                    }
                    onChange={(event) =>
                      updateTechStack(index, {
                        techCategory:
                          event.target.value ||
                          null,
                      })
                    }
                  />
                </label>

                <label className={styles.field}>
                  <span>표시 순서</span>
                  <input
                    type="number"
                    min="0"
                    value={tech.displayOrder}
                    onChange={(event) =>
                      updateTechStack(index, {
                        displayOrder: Number(
                          event.target.value,
                        ),
                      })
                    }
                  />
                </label>
              </div>
            ),
          )}
        </div>

        <button
            type="button"
            className={styles.addButton}
            onClick={addTechStack}
        >
          + 기술 추가
        </button>
      </fieldset>

      <fieldset className={styles.card}>
        <div className={styles.sectionHeader}>
          <legend>Sections</legend>
        </div>

        <div className={styles.arrayList}>
          {form.sections.map(
            (section, sectionIndex) => (
              <div
                key={
                  section.sectionId ??
                  `new-section-${sectionIndex}`
                }
                className={styles.sectionItem}
              >
                <div className={styles.itemTopBar}>
                  <strong>
                    섹션 #{sectionIndex + 1}
                  </strong>

                  <button
                    type="button"
                    className={styles.removeIconButton}
                    onClick={() => removeSection(sectionIndex)}
                    aria-label="섹션 제거"
                  >
                    ×
                  </button>
                </div>

                <div className={styles.grid}>
                  <label className={styles.field}>
                    <span>섹션 유형</span>

                    <select
                      value={section.sectionType}
                      onChange={(event) =>
                        updateSection(
                          sectionIndex,
                          {
                            sectionType:
                              event.target
                                .value as ProjectSectionType,
                          },
                        )
                      }
                    >
                      {SECTION_TYPES.map(
                        (type) => (
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  <label className={styles.field}>
                    <span>제목</span>

                    <input
                      value={section.title ?? ''}
                      onChange={(event) =>
                        updateSection(
                          sectionIndex,
                          {
                            title:
                              event.target.value ||
                              null,
                          },
                        )
                      }
                    />
                  </label>

                  <label className={styles.field}>
                    <span>표시 순서</span>

                    <input
                      type="number"
                      min="0"
                      value={section.displayOrder}
                      onChange={(event) =>
                        updateSection(
                          sectionIndex,
                          {
                            displayOrder: Number(
                              event.target.value,
                            ),
                          },
                        )
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
                      updateSection(
                        sectionIndex,
                        {
                          content:
                            event.target.value ||
                            null,
                        },
                      )
                    }
                  />
                </label>

                <div className={styles.sectionHeader}>
                  <strong>섹션 이미지</strong>
                </div>

                {section.images.map((image, imageIndex) => (
                  <div
                    key={
                      image.projectImageId ??
                      `new-section-image-${sectionIndex}-${imageIndex}`
                    }
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
                          <option
                            key={type}
                            value={type}
                          >
                            {type}
                          </option>
                        ),
                      )}
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

                    <input
                      placeholder="이미지 설명"
                      value={image.caption ?? ''}
                      onChange={(event) =>
                        updateSectionImage(
                          sectionIndex,
                          imageIndex,
                          {
                            caption: event.target.value || null,
                          },
                        )
                      }
                    />

                    <input
                      type="number"
                      min="0"
                      value={image.displayOrder}
                      onChange={(event) =>
                        updateSectionImage(
                          sectionIndex,
                          imageIndex,
                          {
                            displayOrder: Number(event.target.value,),
                          },
                        )
                      }
                    />

                    <button
                      type="button"
                      className={styles.removeIconButton}
                      onClick={() =>
                        removeSectionImage(
                          sectionIndex,
                          imageIndex,
                        )
                      }
                      aria-label="섹션 이미지 제거"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className={styles.addButton}
                  onClick={() => addSectionImage(sectionIndex)}
                >
                  + 섹션 이미지 추가
                </button>
              </div>
            ),
          )}
        </div>

         <button
            type="button"
            className={styles.addButton}
            onClick={addSection}
          >
            + 섹션 추가
          </button>
      </fieldset>

      <fieldset className={styles.card}>
        <div className={styles.sectionHeader}>
          <legend>Links</legend>
        </div>

        {form.links.map((link, index) => (
          <div
            key={
              link.projectLinkId ??
              `new-link-${index}`
            }
            className={styles.arrayItem}
          >
            <select
              value={link.linkType}
              onChange={(event) =>
                updateLink(index, {
                  linkType:
                    event.target
                      .value as ProjectLinkType,
                })
              }
            >
              {LINK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <div className={styles.fieldWithRemove}>
              <label className={styles.field}>
                <span>
                  링크 이름
                  <RequiredMark />
                </span>

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
              </label>

              <button
                type="button"
                className={styles.removeIconButton}
                onClick={() => removeLink(index)}
                aria-label="링크 제거"
              >
                ×
              </button>
            </div>

            <label className={styles.field}>
              <span>
                URL
                <RequiredMark />
              </span>

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
            </label>

            <label className={styles.field}>
              <span>표시 순서</span>

              <input
                type="number"
                min="0"
                value={link.displayOrder}
                onChange={(event) =>
                  updateLink(index, {
                    displayOrder: Number(
                      event.target.value,
                    ),
                  })
                }
              />
            </label>
          </div>
        ))}

        <button
            type="button"
            className={styles.addButton}
            onClick={addLink}
          >
            + 링크 추가
          </button>
      </fieldset>

      <div className={styles.actions}>
        <Link to={cancelTo}>취소</Link>

        <button
          type="submit"
          disabled={submitting}
        >   
          {submitting
            ? submittingLabel
            : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default AdminProjectForm