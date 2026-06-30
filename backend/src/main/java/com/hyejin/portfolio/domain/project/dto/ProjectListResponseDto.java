package com.hyejin.portfolio.domain.project.dto;

import com.hyejin.portfolio.domain.project.entity.ProjectEntity;
import com.hyejin.portfolio.domain.project.entity.ProjectType;

import java.time.LocalDate;

/**
 * packageName    : com.hyejin.portfolio.domain.project.dto
 * fileName       : ProjectListResponseDto
 * author         : Song
 * date           : 2026-06-30
 * description    : 프로젝트 목록 응답 DTO
 *                  - Work 메인 카드 목록에서 사용하는 응답 데이터
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-30        Song       최초 생성
 */
public record ProjectListResponseDto(
        // [3] 2번에서 받은 값을 json 형태로 
        // 자바 컴파일 시 해당 괄호() 안에 멤버 변수들을 기반으로 아래를 자동 생성
        // : 매개변수 생성자/ private final 필드(데이터 수정 불가)/ Getter/ toString(), equals()
        Long projectId,
        String title,
        String slug,
        String summary,
        ProjectType projectType,
        LocalDate startDate,
        LocalDate endDate,
        String periodText, // Entity에는 없지만 화면(프론트) 표현용으로 가공될 텍스트
        String teamName,
        String role,
        String thumbnailUrl, // 가공된 썸네일 이미지 경로
        int displayOrde

) {
    // [1] 서비스에서 이 메서드 호출
    // 예시) SERVICE 레이어에서
    // ProjectListResponseDto dto = ProjectListResponseDto.from(projectEntity, url, text);

    // 정적 팩토리 메서드 : DB에서 긁어온 복잡한 'ProjectEntity' 객체와 추가 데이터들을 조합하여
    // 프론트엔드가 쓰기 좋은 DTO로 변환해주는 전용 세탁기 역활
    public static ProjectListResponseDto from(
            ProjectEntity project,
            String thumbnailUrl,
            String periodText
    ) {
        // [2] service를 돌아서 반환 받은 값을 포장
        return new ProjectListResponseDto(
                project.getProjectId(),
                project.getTitle(),
                project.getSlug(),
                project.getSummary(),
                project.getProjectType(),
                project.getStartDate(),
                project.getEndDate(),
                periodText,
                project.getTeamName(),
                project.getRole(),
                thumbnailUrl,
                project.getDisplayOrder()

        );

    }

}
