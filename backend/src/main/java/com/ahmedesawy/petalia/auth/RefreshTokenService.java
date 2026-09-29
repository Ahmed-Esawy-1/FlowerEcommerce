package com.ahmedesawy.petalia.auth;

import java.time.Duration;
import java.util.UUID;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final Duration CUSTOMER_REFRESH_TTL = Duration.ofDays(365);
    private static final Duration EMPLOYEE_REFRESH_TTL = Duration.ofDays(30);

    public String create(UUID accountId, AccountIdentity.AccountType type) {
        String token = UUID.randomUUID().toString();
        RefreshTokenData data = new RefreshTokenData(accountId, type);

        Duration ttl = switch (type) {
            case CUSTOMER -> CUSTOMER_REFRESH_TTL;
            case EMPLOYEE -> EMPLOYEE_REFRESH_TTL;
        };

        try {
            redisTemplate.opsForValue().set(
                    tokenKey(token),
                    objectMapper.writeValueAsString(data),
                    ttl);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to serialize refresh token data", e);
        }

        return token;
    }

    public RefreshTokenData validate(String token) {
        String json = redisTemplate.opsForValue().get(tokenKey(token));
        if (json == null) {
            throw new BadCredentialsException("Invalid or expired refresh token");
        }

        try {
            return objectMapper.readValue(json, RefreshTokenData.class);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Failed to parse refresh token data", e);
        }
    }

    public void revoke(String token) {
        redisTemplate.delete(tokenKey(token));
    }

    // ---- HELPERS --------------------------------------------------------
    private String tokenKey(String token) {
        return "refresh-token:%s".formatted(token);
    }

    public record RefreshTokenData(UUID accountId, AccountIdentity.AccountType type) {
    }
}