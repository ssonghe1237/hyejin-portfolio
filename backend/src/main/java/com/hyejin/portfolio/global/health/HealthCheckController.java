package com.hyejin.portfolio.global.health;

/**
 * packageName    : com.hyejin.portfolio.global.health
 * fileName       : HealthCheckController
 * author         : Song
 * date           : 2026-06-25
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 2026-06-25        Song       최초 생성
 */

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthCheckController {

    @GetMapping("/api/health")
    public String health() {
        return "portfolio backend is running";
    }
}
