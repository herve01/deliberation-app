package com.deliberation.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {
    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }

    /*
    String password = "123456";

    // Encoder
    String hash = passwordEncoder.encode(password);

    // Vérifier
    if (passwordEncoder.matches(password, hash)) {
        System.out.println("Mot de passe correct");
    } else {
        System.out.println("Mot de passe incorrect");
    }*/
}
