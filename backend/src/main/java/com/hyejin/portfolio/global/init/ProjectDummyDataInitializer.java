package com.hyejin.portfolio.global.init;

import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectImageType;
import com.hyejin.portfolio.domain.project.entity.ProjectLinkEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectLinkType;
import com.hyejin.portfolio.domain.project.entity.ProjectSectionEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectSectionType;
import com.hyejin.portfolio.domain.project.entity.ProjectTechEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectType;
import com.hyejin.portfolio.domain.project.repository.ProjectImageRepository;
import com.hyejin.portfolio.domain.project.repository.ProjectLinkRepository;
import com.hyejin.portfolio.domain.project.repository.ProjectRepository;
import com.hyejin.portfolio.domain.project.repository.ProjectSectionRepository;
import com.hyejin.portfolio.domain.project.repository.ProjectTechRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.global.init
 * fileName       : ProjectDummyDataInitializer
 * author         : Song
 * date           : 2026-06-30
 * description    : 로컬 개발용 초기 더미 데이터 세팅 및 초기화 클래스
 *                  - local 프로필에서만 실행
 *                  - 실제 운영 환경에서는 실행x
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */

@Component
@Profile("local")
@RequiredArgsConstructor
public class ProjectDummyDataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final ProjectTechRepository projectTechRepository;
    private final ProjectImageRepository projectImageRepository;
    private final ProjectSectionRepository projectSectionRepository;
    private final ProjectLinkRepository projectLinkRepository;

    @Override
    @Transactional
    public void run(String... args) {
        createCoreworkProject();
    }

    private void createCoreworkProject() {
        String slug = "corework";

        if (projectRepository.existsBySlug(slug)) {
            return;
        }

        ProjectEntity project = ProjectEntity.builder()
                .title("COREWORK")
                .slug(slug)
                .summary("AI 기반 사내 온보딩과 RAG 검색을 제공하는 그룹웨어 서비스")
                .description("신입사원 온보딩, 문서 기반 AI 검색, 관리자 RAG 문서 관리를 포함한 사내 그룹웨어 프로젝트입니다.")
                .projectType(ProjectType.TEAM)
                .startDate(LocalDate.of(2026, 4, 1))
                .endDate(LocalDate.of(2026, 6, 1))
                .teamName("ICT06 Final Project")
                .role("Backend / AI RAG / Admin")
                .displayOrder(1)
                .published(true)
                .build();

        ProjectEntity savedProject = projectRepository.save(project);

        saveTechStacks(savedProject);
        saveImages(savedProject);
        saveSections(savedProject);
        saveLinks(savedProject);
    }

    private void saveTechStacks(ProjectEntity project) {
        projectTechRepository.save(ProjectTechEntity.builder()
                .project(project)
                .techName("Spring Boot")
                .techCategory("Backend")
                .displayOrder(1)
                .build());

        projectTechRepository.save(ProjectTechEntity.builder()
                .project(project)
                .techName("React")
                .techCategory("Frontend")
                .displayOrder(2)
                .build());

        projectTechRepository.save(ProjectTechEntity.builder()
                .project(project)
                .techName("PostgreSQL")
                .techCategory("Database")
                .displayOrder(3)
                .build());

        projectTechRepository.save(ProjectTechEntity.builder()
                .project(project)
                .techName("PGVector")
                .techCategory("AI")
                .displayOrder(4)
                .build());

        projectTechRepository.save(ProjectTechEntity.builder()
                .project(project)
                .techName("Docker")
                .techCategory("Infra")
                .displayOrder(5)
                .build());
    }

    private void saveImages(ProjectEntity project) {
        projectImageRepository.save(ProjectImageEntity.builder()
                .project(project)
                .imageType(ProjectImageType.THUMBNAIL)
                .imageUrl("/images/projects/corework/thumbnail.png")
                .caption("COREWORK 대표 썸네일")
                .displayOrder(1)
                .build());

        projectImageRepository.save(ProjectImageEntity.builder()
                .project(project)
                .imageType(ProjectImageType.ERD)
                .imageUrl("/images/projects/corework/erd.png")
                .caption("COREWORK ERD")
                .displayOrder(2)
                .build());

        projectImageRepository.save(ProjectImageEntity.builder()
                .project(project)
                .imageType(ProjectImageType.SCREENSHOT)
                .imageUrl("/images/projects/corework/admin-rag.png")
                .caption("관리자 RAG 문서 관리 화면")
                .displayOrder(3)
                .build());
    }

    private void saveSections(ProjectEntity project) {
        projectSectionRepository.save(ProjectSectionEntity.builder()
                .project(project)
                .sectionType(ProjectSectionType.OVERVIEW)
                .title("프로젝트 개요")
                .content("COREWORK는 AI 기반 사내 온보딩과 RAG 검색을 제공하는 그룹웨어 서비스입니다.")
                .displayOrder(1)
                .build());

        projectSectionRepository.save(ProjectSectionEntity.builder()
                .project(project)
                .sectionType(ProjectSectionType.MY_ROLE)
                .title("담당 역할")
                .content("AI 비서, RAG 문서 검색, 권한 기반 문서 필터링, 관리자 RAG 관리 화면 개발을 담당했습니다.")
                .displayOrder(2)
                .build());

        projectSectionRepository.save(ProjectSectionEntity.builder()
                .project(project)
                .sectionType(ProjectSectionType.WORKFLOW)
                .title("RAG 검색 흐름")
                .content("""
                        flowchart TD
                            A[사용자 질문 입력] --> B[사용자 권한 확인]
                            B --> C[문서 후보 필터링]
                            C --> D[Vector Similarity Search]
                            D --> E[답변 생성]
                            E --> F[참고 문서 반환]
                        """)
                .displayOrder(3)
                .build());

        projectSectionRepository.save(ProjectSectionEntity.builder()
                .project(project)
                .sectionType(ProjectSectionType.TROUBLESHOOTING)
                .title("문제 해결")
                .content("PGVector 임베딩 차원 불일치, 권한 조건 필터링, RAG trace 저장 기준 문제를 해결했습니다.")
                .displayOrder(4)
                .build());
    }

    private void saveLinks(ProjectEntity project) {
        projectLinkRepository.save(ProjectLinkEntity.builder()
                .project(project)
                .linkType(ProjectLinkType.GITHUB)
                .linkName("GitHub")
                .url("https://github.com/example/corework")
                .displayOrder(1)
                .build());

        projectLinkRepository.save(ProjectLinkEntity.builder()
                .project(project)
                .linkType(ProjectLinkType.PDF)
                .linkName("포트폴리오 PDF")
                .url("https://example.com/corework.pdf")
                .displayOrder(2)
                .build());

        projectLinkRepository.save(ProjectLinkEntity.builder()
                .project(project)
                .linkType(ProjectLinkType.DEPLOY)
                .linkName("배포 사이트")
                .url("https://example.com")
                .displayOrder(3)
                .build());
    }
}