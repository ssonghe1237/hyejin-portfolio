package com.hyejin.portfolio.global.upload.service;

import com.hyejin.portfolio.global.upload.config.UploadProperties;
import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import lombok.RequiredArgsConstructor;
import org.jspecify.annotations.Nullable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Instant;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Stream;

/**
 * packageName    : com.hyejin.portfolio.global.upload.service
 * fileName       : LocalImageStorageService
 * author         : Song
 * date           : 2026-07-28
 * description    : 로컬 이미지 파일 저장 Servicde 구현체
 *                  - 이미지 파일 검증
 *                  - UUID 기반 저장 파일명 생성
 *                  - 외부 업로드 디렉터리에 이미지 저장
 *                  - 브라우저 접근용 imageUrl 반환
 *                  - 관리 이미지 URL 검증 및 실제 파일 삭제
 *                  - 기준 시각 이전 관리 이미지 파일 URL 조회
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 * 2026-07-29        Song       관리 이미지 URL 검증 및 파일 삭제 기능 추가
 * 2026-07-30        Song       기준 시각 이전 이미지 파일 조회 기능 추가
 */

@Service
@RequiredArgsConstructor
public class LocalImageStorageService implements ImageStorageService {

    // 1) hook 생성
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    private static final Set<String> ALLOWED_CONTENT_TYPES =
            Set.of("image/jpeg", "image/png", "image/webp");

    private static final DateTimeFormatter DIRECTORY_DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy/MM");

    private final UploadProperties uploadProperties;

    // 이미지 파일 저장
    @Override
    public ImageUploadResponseDto store(MultipartFile file) {
        // 파일 검증 (파일 존재여부/ 크기/ 형식/ 확장자 검증)
        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        String extension = extractExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + "." + extension;

        // 업로드 시점의 연도/월 디렉터리
        String dateDirectory =
                LocalDate.now().format(DIRECTORY_DATE_FORMATTER);

        // 컴퓨터 서버 절대 경로 생성
        Path rootDirectory = Path.of(uploadProperties.getImageDirectory())
                .toAbsolutePath() // 상대 경로를 서버 컴퓨터의 절대 경로로 변환
                .normalize();     // 경로에 포함된 불필요한 상대요소 정리

        // 컴퓨터 서버 절대 경로 내 날짜 폴더 자동 생성
        Path targetDirectory = rootDirectory
                .resolve(dateDirectory) // 두 개의 경로(Path)를 하나로 결합
                .normalize();

        // 컴퓨터 서버 절대 경로 내 날짜 폴더 포함 경로 검증
        validateStoragePath(rootDirectory, targetDirectory);

        try {
            Files.createDirectories(targetDirectory);

            // 컴퓨터 서버 절대 경로 내 날짜 폴더 + 파일명
            Path targetPath = targetDirectory
                    .resolve(storedFileName)
                    .normalize();

            // 검증
            validateStoragePath(rootDirectory, targetPath);

            // 실재 저장
            file.transferTo(targetPath);
        }catch (IOException exception) {
            throw new ResponseStatusException(
              HttpStatus.INTERNAL_SERVER_ERROR,
              "이미지 파일 저장에 실패했습니다.",
              exception
            );
        }

        // 서버 폴더 경로로 정규화
        String imageUrl = buildImageUrl (
                uploadProperties.getImageUrlPrefix(),
                dateDirectory,
                storedFileName
        );

        return new ImageUploadResponseDto(
                imageUrl,
                originalFileName,
                storedFileName
        );
    }

    // 애플리케이션이 관리하는 이미지 URL 및 실제 파일 존재 여부 검증
    @Override
    public void validateManagedImageUrl(String imageUrl) {
        Path targetPath = resolveManagedImagePath(imageUrl);

        if (!Files.isRegularFile(targetPath)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "업로드된 이미지 파일을 찾을 수 없습니다."
            );
        }
    }

    // 이미지 URL에 대응하는 실제 저장 파일 삭제
    @Override
    public boolean delete(String imageUrl) {
        // 실제 서버 이미지 경로로 정규화
        Path targetPath = resolveManagedImagePath(imageUrl);

        // 파일이 이미 없는 경우 전체 삭제 흐름을 실패시키지 않음
        if (!Files.exists(targetPath)) {
            return false;
        }

        // 디렉토리나 기타 경로를 이미지 파일로 삭제하지 않음
        if (!Files.isRegularFile(targetPath)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "삭제 대상이 이미지 파일이 아닙니다."
            );
        }

        try {
            // deleteIfExists() : 파일 또는 디렉토리 삭제 메서드
            return Files.deleteIfExists(targetPath);
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "이미지 파일 삭제에 실패했습니다.",
                    exception
            );
        }
    }

    // 기준 시각보다 마지막 수정 시각이 오래된 관리 이미지 파일의 URL 목록을 조회
    @Override
    public List<String> findImageUrlsModifiedBefore(Instant cutoff) {
        if (cutoff == null) {
            throw new IllegalArgumentException(
                    "이미지 파일 조회 기준 시각은 필수입니다."
            );
        }

        Path rootDirectory = getRootDirectory();

        // 한 번도 이미지가 업로드 되지 않아 저장 디렉터리가 없는 경우 빈 목록 반환
        if (!Files.exists(rootDirectory)) {
            return List.of();
        }

        // 디렉토리 경로가 올바른지 검증
        if (!Files.isDirectory(rootDirectory)) {
            throw new IllegalArgumentException(
                    "이미지 저장 경로가 디렉터리가 아닙니다. path=" + rootDirectory
            );
        }

        try(
                Stream<Path> imagePaths =
                    Files.find(
                            rootDirectory,      // 탐색을 시작할 폴더
                            Integer.MAX_VALUE,  // 하위 폴더 탐색 길이 무제한(MAX_VALUE)
                            (path, attributes) -> // path : 파일 위치 및 이름 | attributes : 파일 속성 및 상태 정보 (파일 크기, 생성 날짜, 수정 날짜, 폴더 여부 등)
                                    // 조건A: 폴더나 링크가 아닌 '일반 파일'이어야 함
                                    attributes.isRegularFile()

                                            // 조건B: 파일의 마지막 수정 시각이 cutoff(기준 시각)보다 이전이어야함
                                            && attributes
                                            .lastModifiedTime()
                                            .toInstant()
                                            .isBefore(cutoff)

                                            // 조건C: 허용된 이미지 확장자를 가져야함
                                            && hasAllowedImageExtension(path)
                    )
        ) {
            return imagePaths
                    .map(path ->
                            buildManagedImageUrl(
                                    rootDirectory,
                                    path
                            )
                    )
                    .sorted() // 알파벳/ 가나다 순으로 정렬
                    .toList();

        } catch (IOException exception) {
            throw new IllegalArgumentException(
                    "오래된 이미지 파일 조회에 실패했습니다.",
                    exception
            );
        }
    }

    // 헬퍼 메서드 ===========================================================================
    // =====================================================================================
    // 파일 업로드 검증
    // =====================================================================================
    // 파일 존재 여부, 크기, MIME 타입, 확장자 검증
    private void validateFile(
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "업로드할 이미지 파일이 없습니다."
            );
        }

        if (file.getSize()
                > uploadProperties.getMaxImageSize()) {

            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "이미지 파일 크기가 허용 범위를 초과했습니다."
            );
        }

        String contentType =
                file.getContentType();

        if (contentType == null
                || !ALLOWED_CONTENT_TYPES.contains(contentType)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "지원하지 않는 이미지 형식입니다."
            );
        }

        String extension =
                extractExtension(
                        file.getOriginalFilename()
                );

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "지원하지 않는 이미지 확장자입니다."
            );
        }
    }

    // 파일 확장자 추출
    private String extractExtension(
            @Nullable String fileName
    ) {
        if (fileName == null || fileName.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "파일명이 올바르지 않습니다."
            );
        }

        int lastDotIndex =
                fileName.lastIndexOf(".");

        if (lastDotIndex < 0
                || lastDotIndex == fileName.length() - 1) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "파일 확장자가 없습니다."
            );
        }

        return fileName
                .substring(lastDotIndex + 1)
                .toLowerCase(Locale.ROOT);
    }

    // =====================================================================================
    // 저장 경로 처리
    // =====================================================================================
    // 설정된 이미지 저장 루트의 절대 경로 반환
    private Path getRootDirectory() {
        return Path.of(
                        uploadProperties.getImageDirectory()
                )
                .toAbsolutePath()
                .normalize();
    }

    // 대상 경로가 이미지 저장 루트 내부인지 검증
    private void validateStoragePath(
            Path rootDirectory,
            Path targetPath
    ) {
        if (!targetPath.startsWith(rootDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "허용되지 않은 이미지 파일 경로입니다."
            );
        }
    }

    // 브라우저 접근용 이미지 URL 생성
    private String buildImageUrl(
            String imageUrlPrefix,
            String dateDirectory,
            String storedFileName
    ) {
        String normalizedPrefix =
                normalizeImageUrlPrefix(
                        imageUrlPrefix
                );

        String normalizedDateDirectory =
                dateDirectory.replace("\\", "/");

        return normalizedPrefix
                + "/"
                + normalizedDateDirectory
                + "/"
                + storedFileName;
    }

    // 이미지 URL prefix 정규화
    private String normalizeImageUrlPrefix(
            String imageUrlPrefix
    ) {
        if (imageUrlPrefix == null
                || imageUrlPrefix.isBlank()) {

            throw new IllegalStateException(
                    "이미지 URL prefix 설정이 없습니다."
            );
        }

        String normalizedPrefix =
                imageUrlPrefix.trim();

        while (normalizedPrefix.endsWith("/")
                && normalizedPrefix.length() > 1) {

            normalizedPrefix =
                    normalizedPrefix.substring(
                            0,
                            normalizedPrefix.length() - 1
                    );
        }

        return normalizedPrefix;
    }

    // 관리 이미지 URL을 실제 로컬 파일 경로로 변환
    private Path resolveManagedImagePath(
            String imageUrl
    ) {
        if (imageUrl == null || imageUrl.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 URL이 없습니다."
            );
        }

        String normalizedImageUrl =
                imageUrl.trim();

        String normalizedPrefix =
                normalizeImageUrlPrefix(
                        uploadProperties.getImageUrlPrefix()
                );

        String requiredPrefix =
                normalizedPrefix + "/";

        if (!normalizedImageUrl.startsWith(requiredPrefix)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "외부 이미지 URL은 사용할 수 없습니다."
            );
        }

        String relativePath =
                normalizedImageUrl.substring(
                        requiredPrefix.length()
                );

        if (relativePath.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 파일 경로가 없습니다."
            );
        }

        Path rootDirectory =
                getRootDirectory();

        Path targetPath =
                rootDirectory
                        .resolve(relativePath)
                        .normalize();

        validateStoragePath(
                rootDirectory,
                targetPath
        );

        // "." 같은 값이 루트 디렉터리 자체로 해석되는 경우 방지
        if (targetPath.equals(rootDirectory)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이미지 저장 루트 경로는 사용할 수 없습니다."
            );
        }

        return targetPath;
    }

    // [findImageUrlsModifiedBefore 헬퍼메서드] : 이미지 확장자 체크
    // 잘못된 파일은 예외 발생 시키지 않고 정리 대상에서 제외
    private boolean hasAllowedImageExtension (
            Path path
    ) {
        Path fileNamePath = path.getFileName();

        if (fileNamePath == null) {
            return false;
        }

        String fileName = fileNamePath.toString();

        int lastDotIndex = fileName.lastIndexOf(".");

        if (
                lastDotIndex < 0
                || lastDotIndex == fileName.length() -1
        ) {
            return false;
        }

        String extension = fileName
                            .substring(lastDotIndex +1)
                            .toLowerCase(Locale.ROOT);

        return ALLOWED_EXTENSIONS.contains(
                extension
        );
    }

    // 실제 이미지 파일 경로를 브라우저 접근용 관리 이미지 URL로 변환
    private String buildManagedImageUrl(
            Path rootDirectory,
            Path imagePath
    ){
        Path normalizedImagePath = imagePath.toAbsolutePath().normalize();

        validateStoragePath(
                rootDirectory,
                normalizedImagePath
        );

        // relativize() : 기준 지점에서 목표 지점으로 갈 때의 안겹치는 남은 경로를 추출
        Path relativePath = rootDirectory.relativize(normalizedImagePath);

        String normalizedRelativePath =
                relativePath.toString().replace("\\", "/");

        if(normalizedRelativePath.isBlank()) {
            throw new IllegalArgumentException(
                    "이미지 상대 경로를 생성할 수 없습니다."
            );
        }

        String normalizedPrefix =
                normalizeImageUrlPrefix(
                        uploadProperties.getImageUrlPrefix()
                );

        return normalizedPrefix
                + "/"
                + normalizedRelativePath;
    }
}
