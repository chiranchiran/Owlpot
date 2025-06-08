package com.owlpot.config;

import com.owlpot.properties.JwtProperties;
import com.owlpot.utils.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfiguration {
    @Bean
    public JwtUtil jwtUtil(JwtProperties jwtProperties) {
        return new JwtUtil(jwtProperties.getSecret(), jwtProperties.getExpiration());
    }
}
