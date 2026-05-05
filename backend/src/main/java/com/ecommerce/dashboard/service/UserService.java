package com.ecommerce.dashboard.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.dashboard.model.User;
import com.ecommerce.dashboard.repository.UserRepository;

@Service
public class UserService {
  private final UserRepository userRepo;
  private final PasswordEncoder encoder;

  @Value("${file.upload-dir}")
  private String uploadDir;

  public UserService(UserRepository userRepo, PasswordEncoder encoder) {
    this.userRepo = userRepo;
    this.encoder = encoder;
  }

  public User register(User user, MultipartFile file) {
    user.setPassword(encoder.encode(user.getPassword()));
    if (file != null && !file.isEmpty()) {
        String imagePath = uploadUserImage(file);
        user.setImagePath(imagePath);
    }

    return userRepo.save(user);
}


  public User updateUser(Long id,User user, MultipartFile file) {
      User existing = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

      existing.setName(user.getName());
      existing.setEmail(user.getEmail());
      existing.setRole(user.getRole());

      if (user.getPassword() != null && !user.getPassword().isBlank()) {
        existing.setPassword(encoder.encode(user.getPassword()));
      }

      if (file != null && !file.isEmpty()) {

        // delete old image
        if (existing.getImagePath() != null) {
            try {
                Path oldPath = Paths.get(uploadDir + "/" + existing.getImagePath());
                Files.deleteIfExists(oldPath);
            } catch (Exception e) {}
        }

        String imagePath = uploadUserImage(file);
        existing.setImagePath(imagePath);
      }
      
      return userRepo.save(existing);
  }

  public void deleteUser(Long id) {
    User existing = userRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

        if (existing.getImagePath() != null) {
            try {
                Path oldPath = Paths.get(uploadDir + "/" + existing.getImagePath());
                Files.deleteIfExists(oldPath);
            } catch (Exception e) {}
        }

    userRepo.deleteById(id);
  }

  public String uploadUserImage(MultipartFile file) {
    try {
      
      String folder = uploadDir + "/users";
      Path uploadPath = Paths.get(folder);
      if(!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
      }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Files.copy(file.getInputStream(),  uploadPath.resolve(fileName));

        return "users\\" +  fileName;
    } catch(Exception e) {
      throw new RuntimeException(e);
    }
  }

}
