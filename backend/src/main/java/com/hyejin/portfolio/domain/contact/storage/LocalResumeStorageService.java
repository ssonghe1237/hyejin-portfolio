package com.hyejin.portfolio.domain.contact.storage;

import com.hyejin.portfolio.global.config.ResumeUploadProperties;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Locale;
import java.util.UUID;

/**
 * packageName    : com.hyejin.portfolio.domain.contact.storage
 * fileName       : LocalResumeStorageService
 * author         : Song
 * date           : 2026-08-07
 * description    : 로컬 외부 디렉터리 기반 이력서 PDF 저장 Service
 *                  - PDF 확장자, Content-Type, Signature 검증
 *                  - UUID 기반 저장 파일명 생성
 *                  - yyyy/MM 디렉터리 구조로 PDF 저장
 *                  - 관리 대상 URL 검증 및 파일 삭제
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-08-07        Song       최초 생성
 */

@Service
@RequiredArgsConstructor
public class LocalResumeStorageService
        implements ResumeStorageService {

    private static final String PDF_EXTENSION = "pdf";
    private static final String PDF_CONTENT_TYPE = "application/pdf";

    /*
     * PDF 파일 시작 Signature
     * 16진수로 표기된 각 바이트(0x...)를 ASCII 문자로 변환 => %PDF-
     */
    private static final byte[] PDF_SIGNATURE = {
            0x25,
            0x50,
            0x44,
            0x46,
            0x2D
    };

    private final ResumeUploadProperties resumeUploadProperties;

    private Path rootDirectory; // 절대 경로 형태의 Path

    // =====================================================================================
    // 초기화
    // =====================================================================================

    @PostConstruct
    public void initialize() {
        // 설정값 검증
        if (
                resumeUploadProperties.getDirectory() == null
                        || resumeUploadProperties.getDirectory().isBlank()
        ) {
            throw new IllegalStateException(
                    "이력서 업로드 디렉터리 설정이 필요합니다."
            );
        }

        if (
                resumeUploadProperties.getUrlPrefix() == null
                        || resumeUploadProperties.getUrlPrefix().isBlank()
        ) {
            throw new IllegalStateException(
                    "이력서 URL prefix 설정이 필요합니다."
            );
        }

        // 절대 경로 형태의 PATH 생성
        rootDirectory = Paths.get(
                        resumeUploadProperties.getDirectory()
                )
                .toAbsolutePath() // 상대 경로 => 절대 경로 변환
                .normalize();     // 정규화

        try {
            // PATH 위치에 실제 폴더 생성
            Files.createDirectories(
                    rootDirectory
            );
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "이력서 업로드 디렉터리를 생성할 수 없습니다.",
                    exception
            );
        }
    }

    // =====================================================================================
    // 저장
    // =====================================================================================

    @Override
    public StoredResumeFile store(
            MultipartFile file
    ) {
        validateFile(
                file
        );

        String originalFileName =
                normalizeOriginalFileName(
                        file.getOriginalFilename()
                );

        String storedFileName =
                UUID.randomUUID()
                        + ".pdf";

        LocalDate now =
                LocalDate.now();

        String year =
                String.valueOf(
                        now.getYear()
                );

        String month =
                String.format(
                        "%02d",
                        now.getMonthValue()
                );

        Path targetDirectory =
                rootDirectory
                        .resolve(year)
                        .resolve(month)
                        .normalize();

        validateTargetPath(
                targetDirectory
        );

        try {
            Files.createDirectories(
                    targetDirectory
            );

            Path targetFile =
                    targetDirectory
                            .resolve(
                                    storedFileName
                            )
                            .normalize();

            validateTargetPath(
                    targetFile
            );

            file.transferTo(
                    targetFile
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "이력서 PDF 저장 중 오류가 발생했습니다.",
                    exception
            );
        }

        String fileUrl =
                normalizeUrlPrefix()
                        + "/"
                        + year
                        + "/"
                        + month
                        + "/"
                        + storedFileName;

        return new StoredResumeFile(
                fileUrl,
                originalFileName,
                storedFileName
        );
    }

    // =====================================================================================
    // 검증
    // =====================================================================================

    private void validateFile(
            MultipartFile file
    ) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이력서 PDF 파일이 필요합니다."
            );
        }

        if (file.getSize() > resumeUploadProperties.getMaxSize()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이력서 PDF 파일 크기가 허용 범위를 초과했습니다."
            );
        }

        // 확장자가 pdf 인지 검증
        validateExtension(
                file.getOriginalFilename()
        );

        // 콘텐츠 타입 검증
        validateContentType(
                file.getContentType()
        );

        validatePdfSignature(
                file
        );
    }

    // 확장자가 pdf인지 검정
    private void validateExtension(
            String originalFileName
    ) {
        if (originalFileName == null || originalFileName.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이력서 원본 파일명을 확인할 수 없습니다."
            );
        }

        int extensionIndex =
                originalFileName.lastIndexOf('.');

        if (extensionIndex < 0 || extensionIndex == originalFileName.length() - 1
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "PDF 파일만 업로드할 수 있습니다."
            );
        }

        String extension =
                originalFileName
                        .substring(
                                extensionIndex + 1
                        )
                        .toLowerCase(
                                Locale.ROOT
                        );

        if (!PDF_EXTENSION.equals(extension)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "PDF 파일만 업로드할 수 있습니다."
            );
        }
    }

    // 콘텐츠 타입 검증
    private void validateContentType(
            String contentType
    ) {
        if (contentType == null
                        || !PDF_CONTENT_TYPE.equalsIgnoreCase(contentType))
        {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "PDF 형식의 파일만 업로드할 수 있습니다."
            );
        }
    }

    //
    private void validatePdfSignature(
            MultipartFile file
    ) {
        // InputStream : 데이터가 있는 출발지에서 자바 프로그램 내부로 1바이트(Byte)씩 차례대로 읽어들이는 빨대 역할
        try (InputStream inputStream = file.getInputStream()) {
            byte[] signature =
                    inputStream.readNBytes(
                            PDF_SIGNATURE.length
                    );

            if (
                    signature.length
                            != PDF_SIGNATURE.length
                            || !Arrays.equals(
                            signature,
                            PDF_SIGNATURE
                    )
            ) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "올바른 PDF 파일이 아닙니다."
                );
            }
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "PDF 파일을 확인할 수 없습니다.",
                    exception
            );
        }
    }

    // =====================================================================================
    // URL 검증
    // =====================================================================================

    @Override
    public void validateManagedResumeUrl(
            String fileUrl
    ) {
        if (
                fileUrl == null
                        || fileUrl.isBlank()
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "이력서 파일 URL이 필요합니다."
            );
        }

        String urlPrefix =
                normalizeUrlPrefix();

        if (
                !fileUrl.startsWith(
                        urlPrefix + "/"
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "관리 대상 이력서 URL이 아닙니다."
            );
        }

        resolveManagedPath(
                fileUrl
        );
    }

    // =====================================================================================
    // 삭제
    // =====================================================================================

    @Override
    public void delete(
            String fileUrl
    ) {
        if (
                fileUrl == null
                        || fileUrl.isBlank()
        ) {
            return;
        }

        Path filePath =
                resolveManagedPath(
                        fileUrl
                );

        try {
            Files.deleteIfExists(
                    filePath
            );
        } catch (IOException exception) {
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "이력서 PDF 삭제 중 오류가 발생했습니다.",
                    exception
            );
        }
    }

    // =====================================================================================
    // 내부 공통
    // =====================================================================================

    private Path resolveManagedPath(
            String fileUrl
    ) {
        String urlPrefix =
                normalizeUrlPrefix();

        if (
                !fileUrl.startsWith(
                        urlPrefix + "/"
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "관리 대상 이력서 URL이 아닙니다."
            );
        }

        String relativePath =
                fileUrl.substring(
                        urlPrefix.length() + 1
                );

        Path resolvedPath =
                rootDirectory
                        .resolve(
                                relativePath
                        )
                        .normalize();

        validateTargetPath(
                resolvedPath
        );

        return resolvedPath;
    }

    private void validateTargetPath(
            Path targetPath
    ) {
        if (
                !targetPath.startsWith(
                        rootDirectory
                )
        ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "허용되지 않은 이력서 파일 경로입니다."
            );
        }
    }

    private String normalizeOriginalFileName(
            String originalFileName
    ) {
        if (
                originalFileName == null
                        || originalFileName.isBlank()
        ) {
            return "resume.pdf";
        }

        /*
         * 브라우저가 전달할 수 있는 경로 정보 제거
         *
         * C:\\fakepath\\resume.pdf
         */
        String normalized =
                originalFileName
                        .replace(
                                "\\",
                                "/"
                        );

        int lastSeparator =
                normalized.lastIndexOf('/');

        if (
                lastSeparator >= 0
                        && lastSeparator
                        < normalized.length() - 1
        ) {
            return normalized.substring(
                    lastSeparator + 1
            );
        }

        return normalized;
    }

    private String normalizeUrlPrefix() {
        String prefix =
                resumeUploadProperties
                        .getUrlPrefix()
                        .trim();

        while (
                prefix.endsWith("/")
                        && prefix.length() > 1
        ) {
            prefix =
                    prefix.substring(
                            0,
                            prefix.length() - 1
                    );
        }

        return prefix;
    }
}