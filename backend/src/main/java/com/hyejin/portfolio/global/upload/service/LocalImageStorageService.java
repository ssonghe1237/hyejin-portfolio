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
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

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
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-07-28        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
public class LocalImageStorageService implements ImageStorageService {

    // 1) hook 생성
    private static final Set<String> ALLOWED_EXTENSIONS =
            Set.of("jpg", "jpeg", "png", "webp");

    private static final Set<String> ALLOWED_CONTENT_TYPE =
            Set.of("image/jpeg", "image/png", "image/webp");

    private static final DateTimeFormatter DIRECTORY_DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy/MM");

    private final UploadProperties uploadProperties;

    @Override
    public ImageUploadResponseDto store(MultipartFile file) {
        // 파일 검증 (파일 존재여부/ 크기/ 형식/ 확장자 검증)
        validateFile(file);

        String originalFileName = file.getOriginalFilename();
        String extension = extractExtension(originalFileName);
        String storedFileName = UUID.randomUUID() + "." + extension;

        // 폴더 내 날짜 폴더 자동 생성
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
        validateStoregePath(rootDirectory, targetDirectory);

        try {
            Files.createDirectories(targetDirectory);

            // 컴퓨터 서버 절대 경로 내 날짜 폴더 + 파일명
            Path targetPath = targetDirectory
                    .resolve(storedFileName)
                    .normalize();

            // 검증
            validateStoregePath(rootDirectory, targetPath);

            // 실재 저장
            file.transferTo(targetPath);
        }catch (IOException e) {
            throw new ResponseStatusException(
              HttpStatus.INTERNAL_SERVER_ERROR,
              "이미지 파일 저장에 실패했습니다."
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

    // 헬퍼 메서드 =============================================================================
    // 파일 존재여부/ 크기/ 형식/ 확장자 검증
    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "업로드할 이미지 파일이 없습니다."
            );
        }

        if (file.getSize() > uploadProperties.getMaxImageSize()) {
            throw new ResponseStatusException(
                    HttpStatus.PAYLOAD_TOO_LARGE,
                    "이미지 파일 크기가 허용 범위를 초과했습니다."
            );
        }

        String contentType = file.getContentType();

        if (contentType == null || !ALLOWED_CONTENT_TYPE.contains(contentType)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "지원하지 않는 이미지 형식입니다."
            );
        }

        String extension = extractExtension(file.getOriginalFilename());

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "지원하지 않는 이미지 확장자입니다."
            );
        }
    }

    // 파일 확장자 확인
    private String extractExtension(@Nullable String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "파일명이 올바르지 않습니다."
            );
        }

        int lastDotIndex = fileName.lastIndexOf(".");

        if (lastDotIndex < 0 || lastDotIndex == fileName.length() -1) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "파일 확장자가 없습니다."
            );
        }

        return fileName
                .substring(lastDotIndex + 1)
                .toLowerCase(Locale.ROOT); // Local.ROOT = 하상 표준 영문 기준으로 안전하게 소문자로 변환해라
    }

    // 컴퓨터 서버 절대 경로 내 날짜 폴더 포함 경로 검증
    private void validateStoregePath(
            Path rootDirectory,
            Path targetDirectory
    ) {
        if (!targetDirectory.startsWith(rootDirectory)) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "잘못된 파일 저장 경로입니다."
            );
        }
    }

    // 서버 폴더 경로로 정규화
    private String buildImageUrl(
            String imageUrlPrefix,
            String dateDirectory,
            String storedFileName
    ) {
        String nomalizedPrefix = imageUrlPrefix.endsWith("/")
                ? imageUrlPrefix.substring(0, imageUrlPrefix.length()-1)
                : imageUrlPrefix;

        String nomalizedDateDirectory = dateDirectory.replace("\\", "/");

        return nomalizedPrefix + "/" + nomalizedDateDirectory + "/" + storedFileName;
    }

}
