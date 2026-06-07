package com.erp.finance_service.config;

import com.erp.finance_service.model.User;
import com.erp.finance_service.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initializeDefaultUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() == 0) {
                User admin = User.builder()
                        .username("admin")
                        .email("admin@example.com")
                        .passwordHash(passwordEncoder.encode("Admin123!"))
                        .displayName("Administrator")
                        .role("ADMIN")
                        .enabled(true)
                        .build();
                userRepository.save(admin);
            }
        };
    }
}
