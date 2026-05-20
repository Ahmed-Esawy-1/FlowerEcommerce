package com.ecommerce.dashboard.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;

import jakarta.servlet.http.HttpServletRequest;

public class RoleAwareRememberMeServices extends TokenBasedRememberMeServices {

   // 1 Year
   private static final int USER_TTL = 365 * 24 * 60 * 60;

   // 6 months
   private static final int DASHBOARD_TTL = 6 * 30 * 24 * 60 * 60;

   public RoleAwareRememberMeServices(String key, UserDetailsService userDetailsService) {
      super(key, userDetailsService);
   }

   @Override
   protected int calculateLoginLifetime(HttpServletRequest request, Authentication authentication) {
      boolean isDashboardUser = authentication.getAuthorities()
            .stream()
            .anyMatch(auth ->
               auth.getAuthority().equals("ROLE_ADMIN") ||
               auth.getAuthority().equals("ROLE_MANAGER")
            );

      return isDashboardUser ? DASHBOARD_TTL : USER_TTL;
   }
}