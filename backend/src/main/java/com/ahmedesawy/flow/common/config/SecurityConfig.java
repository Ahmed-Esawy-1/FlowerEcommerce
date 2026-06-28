package com.ahmedesawy.flow.common.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ahmedesawy.flow.auth.CustomUserDetailsService;
import com.ahmedesawy.flow.auth.RoleAwareRememberMeServices;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${app.remember-me.key}")
    private String rememberMeKey;

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RoleAwareRememberMeServices rememberMeServices() {
        RoleAwareRememberMeServices services =
            new RoleAwareRememberMeServices(rememberMeKey, userDetailsService);
        services.setParameter("rememberMe");
        services.setAlwaysRemember(false);
        return services;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                // PUBLIC AUTH
                .requestMatchers("/auth/login").permitAll()
                .requestMatchers("/auth/logout").permitAll()
                .requestMatchers("/auth/me").permitAll()
                // PUBLIC SHOP — no auth needed
                .requestMatchers(HttpMethod.GET, "/dashboard/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/occasions/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/colors/**").permitAll() 
                .requestMatchers(HttpMethod.GET, "/admin/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/sections/**").permitAll() 
                .requestMatchers("/upload_images/**").permitAll()  
                // PUBLIC SHOP
                .requestMatchers("/users/register").permitAll()
                .requestMatchers("/users/updateProfile").authenticated()
                // OPTIONS preflight
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // PROTECTED — dashboard roles only
                .anyRequest().hasAnyRole("ADMIN", "OWNER")
            )
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            .rememberMe(remember -> remember
                .rememberMeServices(rememberMeServices())
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                .maximumSessions(1)
            )
            .userDetailsService(userDetailsService);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
            "http://localhost:5173",  // dashboard
            "http://localhost:3000"   // shop
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}