package com.hyejin.portfolio.domain.project.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * packageName    : com.hyejin.portfolio.domain.project.entity
 * fileName       : ProjectEntity
 * author         : Song
 * date           : 2026-06-25
 * description    : 포트폴리오의 프로젝트 핵심 정보(제목, 설명, 기간, 링크 등)를 데이터베이스 테이블과 매핑하여 관리하는 엔티티 클래스
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 * 2026-06-26        Song       이미지, 링크, 상세 섹션, 기술스택은 별도 자식 테이블에서 관리
 */

@Entity
@Table(name = "projects")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA를 위한 기본 생성자 보장
public class ProjectEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @Column(nullable = false, length = 200)
    private String title;

    // 상세 페이지 URL 식별자
    @Column(nullable = false, unique = true, length = 200)
    private String slug;

    // work 카드용 프로젝트 한줄 설명
    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    // 프로젝트 상세 설명 => 상세 페이지 내 overview 영역 등에서 활용
    @Column(columnDefinition = "TEXT")
    private String description;

    // 프로젝트 성격
    // TEAM : 팀 프로젝트  |  PERSONAL : 개인 프로젝트
    @Enumerated(EnumType.STRING)
    @Column(name = "project_type", nullable = false, length = 200)
    private ProjectType projectType;

    // 프로젝트 시작일
    @Column(name = "start_date")
    private LocalDate startDate;

    // 프로젝트 종료일
    // 진행 중인 프로젝트는 null 허용
    @Column(name = "end_date")
    private LocalDate endDate;

    // 팀명 또는 진행 구분
    // 팀명 예 : ICT06 Final Project
    // 진행 구분 예 : 개인 프로젝트
    @Column(name = "team_name", length = 200)
    private String teamName;

    // 본인 담당 영역
    // 예) Backend / AI RAG / Admin
    @Column(columnDefinition = "TEXT")
    private String role;

    // 관리자 지정 노출 순서
    @Column(name = "display_order", nullable = false)
    private int displayOrder;

    // 공개 여부
    // true : 사용자 화면에 노출
    // flase : 관리자에서만 확인
    @Column(name = "is_published", nullable = false)
    private boolean published;

    // 생성일
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    // 수정일
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // 참고) @Builder : 빌더 패턴을 사용한 객체 생성을 하기 위한 사전 준비
    @Builder
    public ProjectEntity(
            String title,
            String slug,
            String summary,
            String description,
            ProjectType projectType,
            LocalDate startDate,
            LocalDate endDate,
            String teamName,
            String role,
            int displayOrder,
            boolean published
    ) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.description = description;
        this.projectType = projectType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.teamName = teamName;
        this.role = role;
        this.displayOrder = displayOrder;
        this.published = published;
    }

    // 참고) @PrePersist : 데이터베이스에 이 엔티티(데이터)가 '처음으로 저장(Insert)되기 직전'에 JPA가 자동으로 이 메서드를 실행
    // 처음 데이터가 만들어질 때 createdAt, updatedAt을 동일하게 자동 생성
    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();

        this.createdAt = now;
        this.updatedAt = now;
    }

    // 참고) @PreUpdate : 데이터베이스에 이미 존재하는 데이터가 '수정(Update)되기 직전'에 JPA가 자동으로 이 메서드를 실행
    // updatedAt을 자동으로 갱신
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // 프로젝트 기본 정보 수정
    // Entity의 필드를 외부에서 setter로 직접 열지 않고, 의미 있는 메서드를 통해 상태를 변경
    public void updateBasicInfo(
            String title,
            String slug,
            String summary,
            String description,
            ProjectType projectType,
            LocalDate startDate,
            LocalDate endDate,
            String teamName,
            String role,
            int displayOrder
    ) {
        this.title = title;
        this.slug = slug;
        this.summary = summary;
        this.description = description;
        this.projectType = projectType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.teamName = teamName;
        this.role = role;
        this.displayOrder = displayOrder;
    }

    // 프로젝트 공개 처리
    // setPubliched(true)라고 하는 것보다
    public void publish() {
        this.published = true;
    }

    // 프로젝트 비공개 처리
    public void unpublish() {
        this.published = false;
    }
}
