package com.ahmedesawy.flow.auth;


import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.ahmedesawy.flow.user.User;
import com.ahmedesawy.flow.user.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
   private final UserRepository repo;

   public CustomUserDetailsService(UserRepository repo) {
      this.repo = repo;
   }
  
   @Override
   public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
      User user = repo.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));

      return org.springframework.security.core.userdetails.User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .roles(user.getRole().name())
            .build();
  }
}
