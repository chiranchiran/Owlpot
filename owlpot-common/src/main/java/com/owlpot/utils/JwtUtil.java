package com.owlpot.utils;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
@Data
@AllArgsConstructor
@NoArgsConstructor
@Slf4j
public class JwtUtil {

    private String secret;
    private long expiration;
    public static final String EMP_USERNAME = "userName";
    public static final String USER_ID = "userId";
    // 生成安全的密钥对象
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * 生成 JWT Token（默认使用 subject）
     */
    public String generateToken(String subject) {
        return generateToken(subject, new HashMap<>());
    }

    /**
     * 生成 JWT Token（含自定义 Claims）
     */
    public String generateToken(String subject, Map<String, Object> claims) {
        return Jwts.builder()
                .claims(claims)              // 自定义 Claims
                .subject(subject)            // 用户标识
                .issuedAt(new Date())        // 签发时间
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey())   // 签名密钥
                .compact();
    }

    /**
     * 解析 Token 获取 Claims
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * 获取 Token 中的用户标识（subject）
     */
    public String getSubjectFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * 验证 Token 是否有效（未过期且签名正确）
     */
    public boolean checkToken(String token) {
        try {
            getClaimsFromToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
