package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.config.ProfileUploadProperties;
import com.hyejin.portfolio.global.upload.dto.ImageUploadResponseDto;
import lombok.RequiredArgsConstructor;
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
 * packageName    : com.hyejin.portfolio.domain.about.service
 * fileName       : LocalProfileImageStorageService
 * author         : Song
 * date           : 2026-08-21
 * description    : 관리자 About 프로필 고아 이미지 정리 Service 구현체
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-21        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
public class LocalProfileImageStorageService implements ProfileImageStorageService {
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("jpg", "jpeg", "png", "webp");
    private static final Set<String> ALLOWED_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private static final DateTimeFormatter DATE_DIRECTORY = DateTimeFormatter.ofPattern("yyyy/MM");

    private final ProfileUploadProperties properties;

    @Override
    public ImageUploadResponseDto store(MultipartFile file) {
        validateFile(file);
        String originalName = file.getOriginalFilename();
        String extension = extensionOf(originalName);
        String storedName = UUID.randomUUID() + "." + extension;
        String dateDirectory = LocalDate.now().format(DATE_DIRECTORY);
        Path root = rootDirectory();
        Path targetDirectory = root.resolve(dateDirectory).normalize();
        validateInsideRoot(root, targetDirectory);
        Path target = targetDirectory.resolve(storedName).normalize();
        validateInsideRoot(root, target);

        try {
            Files.createDirectories(targetDirectory);
            file.transferTo(target);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 이미지 저장에 실패했습니다.", exception);
        }

        return new ImageUploadResponseDto(prefix() + "/" + dateDirectory + "/" + storedName, originalName, storedName);
    }

    @Override
    public void validateManagedImageUrl(String imageUrl) {
        if (!Files.isRegularFile(resolveManagedPath(imageUrl))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드된 프로필 이미지 파일을 찾을 수 없습니다.");
        }
    }

    @Override
    public boolean delete(String imageUrl) {
        Path target = resolveManagedPath(imageUrl);
        if (!Files.exists(target)) return false;
        if (!Files.isRegularFile(target)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제 대상이 프로필 이미지 파일이 아닙니다.");
        }
        try {
            return Files.deleteIfExists(target);
        } catch (IOException exception) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "프로필 이미지 삭제에 실패했습니다.", exception);
        }
    }

    @Override
    public List<String> findImageUrlsModifiedBefore(Instant cutoff) {
        if (cutoff == null) throw new IllegalArgumentException("조회 기준 시각은 필수입니다.");
        Path root = rootDirectory();
        if (!Files.exists(root)) return List.of();
        if (!Files.isDirectory(root)) throw new IllegalStateException("프로필 이미지 저장 경로가 디렉터리가 아닙니다.");
        try (Stream<Path> paths = Files.find(root, Integer.MAX_VALUE,
                (path, attributes) -> attributes.isRegularFile()
                        && attributes.lastModifiedTime().toInstant().isBefore(cutoff)
                        && hasAllowedExtension(path))) {
            return paths.map(path -> prefix() + "/" + root.relativize(path.toAbsolutePath().normalize()).toString().replace("\\", "/"))
                    .sorted().toList();
        } catch (IOException exception) {
            throw new IllegalStateException("오래된 프로필 이미지 조회에 실패했습니다.", exception);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 프로필 이미지가 없습니다.");
        if (file.getSize() > properties.getMaxImageSize()) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "프로필 이미지 크기가 허용 범위를 초과했습니다.");
        if (file.getContentType() == null || !ALLOWED_CONTENT_TYPES.contains(file.getContentType())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 이미지 형식입니다.");
        if (!ALLOWED_EXTENSIONS.contains(extensionOf(file.getOriginalFilename()))) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 이미지 확장자입니다.");
    }

    private String extensionOf(String fileName) {
        if (fileName == null || fileName.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일명이 올바르지 않습니다.");
        int dot = fileName.lastIndexOf('.');
        if (dot < 0 || dot == fileName.length() - 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 확장자가 없습니다.");
        return fileName.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private Path resolveManagedPath(String imageUrl) {
        if (imageUrl == null || imageUrl.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "프로필 이미지 URL이 없습니다.");
        String requiredPrefix = prefix() + "/";
        String normalizedUrl = imageUrl.trim();
        if (!normalizedUrl.startsWith(requiredPrefix)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관리되는 프로필 이미지 URL이 아닙니다.");
        String relative = normalizedUrl.substring(requiredPrefix.length());
        if (relative.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "프로필 이미지 파일 경로가 없습니다.");
        Path root = rootDirectory();
        Path target = root.resolve(relative).normalize();
        validateInsideRoot(root, target);
        if (target.equals(root)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "프로필 이미지 저장 루트는 사용할 수 없습니다.");
        return target;
    }

    private Path rootDirectory() { return Path.of(properties.getImageDirectory()).toAbsolutePath().normalize(); }
    private String prefix() {
        String value = properties.getImageUrlPrefix();
        if (value == null || value.isBlank()) throw new IllegalStateException("프로필 이미지 URL prefix 설정이 없습니다.");
        value = value.trim();
        while (value.endsWith("/") && value.length() > 1) value = value.substring(0, value.length() - 1);
        return value;
    }
    private void validateInsideRoot(Path root, Path target) {
        if (!target.startsWith(root)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않은 프로필 이미지 경로입니다.");
    }
    private boolean hasAllowedExtension(Path path) {
        Path namePath = path.getFileName();
        if (namePath == null) return false;
        String name = namePath.toString();
        int dot = name.lastIndexOf('.');
        return dot >= 0 && dot < name.length() - 1 && ALLOWED_EXTENSIONS.contains(name.substring(dot + 1).toLowerCase(Locale.ROOT));
    }
}
