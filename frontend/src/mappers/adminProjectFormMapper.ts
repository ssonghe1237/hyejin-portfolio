/**
 * packageName    : frontend.src.mappers
 * fileName       : adminProjectFormMapper.ts
 * author         : Song
 * date           : 2026-07-09
 * description    : 관리자 프로젝트 공통 폼 데이터 변환 모듈
 *                  - 관리자 프로젝트 상세 응답을 공통 폼 상태로 변환
 *                  - 공통 폼 상태를 프로젝트 수정 요청으로 변환
 *                  - 기존 하위 데이터 ID 유지
 *                  - 선택 삭제 ID 목록 초기화 및 전달
 *                  - 백엔드 DTO와 하위 데이터 ID 필드명 통일
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-09        Song       최초 생성
 * 2026-07-09        Song       하위 데이터 ID 필드명을 백엔드 DTO와 통일
 * 2026-07-27        Song       관리자 프로젝트 폼 UX 개선
 */

import type {
  AdminProjectDetailResponse,
  AdminProjectFormState,
  AdminProjectUpdateRequest,
} from '../types/project'

/**
 * 관리자 프로젝트 상세 응답을 공통 폼 상태로 변환한다.
 *
 * 서버에서 조회한 기존 이미지, 섹션, 기술스택, 링크의 ID를
 * 공통 폼 상태에 그대로 유지한다.
 *
 * 상세 조회 직후에는 사용자가 삭제한 데이터가 없으므로
 * 각 삭제 ID 목록은 빈 배열로 초기화한다.
 *
 * @param detail 관리자 프로젝트 상세 조회 응답
 * @returns 관리자 프로젝트 공통 폼 초기 상태
 */
export function toAdminProjectFormState(
  detail: AdminProjectDetailResponse,
): AdminProjectFormState {
  return {
    title: detail.title,
    slug: detail.slug,
    summary: detail.summary,
    description: detail.description,
    projectType: detail.projectType,
    startDate: detail.startDate,
    endDate: detail.endDate,
    teamName: detail.projectType === 'TEAM'
      ? detail.teamName
      : null,
    role: detail.role,
    displayOrder: detail.displayOrder,
    published: detail.published,

    thumbnailImage: detail.thumbnailImage
      ? {
          projectImageId:
            detail.thumbnailImage.projectImageId,
          imageType: detail.thumbnailImage.imageType,
          imageUrl: detail.thumbnailImage.imageUrl,
          caption: detail.thumbnailImage.caption,
          displayOrder:
            detail.thumbnailImage.displayOrder,
        }
      : null,

    heroImages: (detail.heroImages ?? []).map(
      (image) => ({
        projectImageId: image.projectImageId,
        imageType: image.imageType,
        imageUrl: image.imageUrl,
        caption: image.caption,
        displayOrder: image.displayOrder,
      }),
    ),

    deletedImageIds: [],

    sections: (detail.sections ?? []).map(
      (section) => ({
        sectionId: section.sectionId,
        sectionType: section.sectionType,
        title: section.title,
        content: section.content,
        displayOrder: section.displayOrder,

        images: (section.images ?? []).map(
          (image) => ({
            projectImageId: image.projectImageId,
            imageType: image.imageType,
            imageUrl: image.imageUrl,
            caption: image.caption,
            displayOrder: image.displayOrder,
          }),
        ),
      }),
    ),

    deletedSectionIds: [],

    techStacks: (detail.techStacks ?? []).map(
      (tech) => ({
        projectTechId: tech.projectTechId,
        techName: tech.techName,
        techCategory: tech.techCategory,
        displayOrder: tech.displayOrder,
      }),
    ),

    deletedTechIds: [],

    links: (detail.links ?? []).map((link) => ({
      projectLinkId: link.projectLinkId,
      linkType: link.linkType,
      linkName: link.linkName,
      url: link.url,
      displayOrder: link.displayOrder,
    })),

    deletedLinkIds: [],
  }
}

/**
 * 관리자 프로젝트 공통 폼 상태를 수정 API 요청으로 변환한다.
 *
 * 기존 하위 데이터는 ID를 유지하여 수정 대상으로 전달하고,
 * 신규 하위 데이터는 null ID 상태로 전달한다.
 *
 * 사용자가 삭제한 기존 데이터의 ID는 각 deleted...Ids
 * 목록을 통해 백엔드에 전달한다.
 *
 * @param form 관리자 프로젝트 공통 폼 상태
 * @returns 관리자 프로젝트 수정 API 요청 데이터
 */
export function toAdminProjectUpdateRequest(
  form: AdminProjectFormState,
): AdminProjectUpdateRequest {
  return {
    title: form.title,
    slug: form.slug,
    summary: form.summary,
    description: form.description,
    projectType: form.projectType,
    startDate: form.startDate,
    endDate: form.endDate,
    teamName: form.projectType === 'TEAM'
      ? form.teamName
      : null,
    role: form.role,
    displayOrder: form.displayOrder,
    published: form.published,

    thumbnailImage: form.thumbnailImage
      ? {
          projectImageId:
            form.thumbnailImage.projectImageId,
          imageType: form.thumbnailImage.imageType,
          imageUrl: form.thumbnailImage.imageUrl,
          caption: form.thumbnailImage.caption,
          displayOrder:
            form.thumbnailImage.displayOrder,
        }
      : null,

    heroImages: form.heroImages.map((image) => ({
      projectImageId: image.projectImageId,
      imageType: image.imageType,
      imageUrl: image.imageUrl,
      caption: image.caption,
      displayOrder: image.displayOrder,
    })),

    deletedImageIds: [...form.deletedImageIds],

    sections: form.sections.map((section) => ({
      sectionId: section.sectionId,
      sectionType: section.sectionType,
      title: section.title,
      content: section.content,
      displayOrder: section.displayOrder,

      images: section.images.map((image) => ({
        projectImageId: image.projectImageId,
        imageType: image.imageType,
        imageUrl: image.imageUrl,
        caption: image.caption,
        displayOrder: image.displayOrder,
      })),
    })),

    deletedSectionIds: [...form.deletedSectionIds],

    techStacks: form.techStacks.map((tech) => ({
      projectTechId: tech.projectTechId,
      techName: tech.techName,
      techCategory: tech.techCategory,
      displayOrder: tech.displayOrder,
    })),

    deletedTechIds: [...form.deletedTechIds],

    links: form.links.map((link) => ({
      projectLinkId: link.projectLinkId,
      linkType: link.linkType,
      linkName: link.linkName,
      url: link.url,
      displayOrder: link.displayOrder,
    })),

    deletedLinkIds: [...form.deletedLinkIds],
  }
}