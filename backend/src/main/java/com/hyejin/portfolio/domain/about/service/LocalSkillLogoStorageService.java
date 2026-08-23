package com.hyejin.portfolio.domain.about.service;

import com.hyejin.portfolio.global.upload.config.SkillLogoUploadProperties;
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

/** PNG/WEBP Skill Logo를 /uploads/skills namespace에 저장하는 Service. @author Song */
@Service
@RequiredArgsConstructor
public class LocalSkillLogoStorageService implements SkillLogoStorageService {
    private static final Set<String> EXTENSIONS = Set.of("png", "webp");
    private static final Set<String> CONTENT_TYPES = Set.of("image/png", "image/webp");
    private static final DateTimeFormatter DATE_DIRECTORY = DateTimeFormatter.ofPattern("yyyy/MM");
    private final SkillLogoUploadProperties properties;

    @Override public ImageUploadResponseDto store(MultipartFile file) {
        validateFile(file);
        String original = file.getOriginalFilename();
        String extension = extensionOf(original);
        String stored = UUID.randomUUID() + "." + extension;
        String dated = LocalDate.now().format(DATE_DIRECTORY);
        Path root = root();
        Path directory = root.resolve(dated).normalize();
        Path target = directory.resolve(stored).normalize();
        inside(root, directory); inside(root, target);
        try { Files.createDirectories(directory); file.transferTo(target); }
        catch (IOException exception) { throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "기술 로고 저장에 실패했습니다.", exception); }
        return new ImageUploadResponseDto(prefix() + "/" + dated + "/" + stored, original, stored);
    }

    @Override public void validateManagedLogoUrl(String url) {
        if (!Files.isRegularFile(resolve(url))) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드된 기술 로고를 찾을 수 없습니다.");
    }

    @Override public boolean delete(String url) {
        Path target = resolve(url);
        if (!Files.exists(target)) return false;
        if (!Files.isRegularFile(target)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "삭제 대상이 기술 로고 파일이 아닙니다.");
        try { return Files.deleteIfExists(target); }
        catch (IOException exception) { throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "기술 로고 삭제에 실패했습니다.", exception); }
    }

    @Override public List<String> findLogoUrlsModifiedBefore(Instant cutoff) {
        if (cutoff == null) throw new IllegalArgumentException("조회 기준 시각은 필수입니다.");
        Path root = root();
        if (!Files.exists(root)) return List.of();
        try (Stream<Path> paths = Files.find(root, Integer.MAX_VALUE, (path, attr) -> attr.isRegularFile()
                && attr.lastModifiedTime().toInstant().isBefore(cutoff) && allowed(path))) {
            return paths.map(path -> prefix() + "/" + root.relativize(path.toAbsolutePath().normalize()).toString().replace("\\", "/")).sorted().toList();
        } catch (IOException exception) { throw new IllegalStateException("오래된 기술 로고 조회에 실패했습니다.", exception); }
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "업로드할 기술 로고가 없습니다.");
        if (file.getSize() > properties.getMaxSize()) throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "기술 로고 크기가 허용 범위를 초과했습니다.");
        if (file.getContentType() == null || !CONTENT_TYPES.contains(file.getContentType())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 기술 로고 형식입니다.");
        if (!EXTENSIONS.contains(extensionOf(file.getOriginalFilename()))) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "지원하지 않는 기술 로고 확장자입니다.");
    }
    private String extensionOf(String name) {
        if (name == null || name.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일명이 올바르지 않습니다.");
        int dot = name.lastIndexOf('.');
        if (dot < 0 || dot == name.length() - 1) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "파일 확장자가 없습니다.");
        return name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }
    private Path resolve(String url) {
        if (url == null || url.isBlank() || !url.trim().startsWith(prefix() + "/")) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관리되는 기술 로고 URL이 아닙니다.");
        String relative = url.trim().substring(prefix().length() + 1);
        if (relative.isBlank()) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기술 로고 경로가 없습니다.");
        Path root = root(), target = root.resolve(relative).normalize(); inside(root, target);
        if (target.equals(root)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "기술 로고 저장 루트는 사용할 수 없습니다.");
        return target;
    }
    private Path root() { return Path.of(properties.getDirectory()).toAbsolutePath().normalize(); }
    private String prefix() { String value = properties.getUrlPrefix().trim(); while (value.endsWith("/") && value.length() > 1) value = value.substring(0, value.length() - 1); return value; }
    private void inside(Path root, Path target) { if (!target.startsWith(root)) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "허용되지 않은 기술 로고 경로입니다."); }
    private boolean allowed(Path path) { String name = path.getFileName().toString(); int dot = name.lastIndexOf('.'); return dot >= 0 && EXTENSIONS.contains(name.substring(dot + 1).toLowerCase(Locale.ROOT)); }
}
