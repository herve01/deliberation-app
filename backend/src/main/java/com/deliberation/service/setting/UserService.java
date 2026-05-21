package com.deliberation.service.setting;

import com.deliberation.dto.setting.response.UserResponseDTO;
import com.deliberation.model.setting.User;
import com.deliberation.repository.setting.UserRepository;
import com.deliberation.service.IService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService implements IService<User, String> {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User create(User user) {
        user.setId(UUID.randomUUID().toString());
        user.setCreatedAt(LocalDateTime.now());
        user.setEtat(true);
        user.setEstValide(false);

        return repository.save(user);
    }


    public User createWithPassword(User user, String rawPassword) {
        user.setId(UUID.randomUUID().toString());
        user.setCreatedAt(LocalDateTime.now());
        user.setEtat(true);
        user.setEstValide(false);

        // encodage du mot de passe
        String encodedPassword = passwordEncoder.encode(rawPassword);
        user.setPasswd(encodedPassword);

        return repository.save(user);
    }

    @Override
    public User update(String id, User user) {
        user.setId(id);
        user.setUpdatedAt(LocalDateTime.now());

        return repository.save(user);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<User> get(String id) {
        return repository.findById(id);
    }

    @Override
    public List<User> getAll() {
        return repository.findAll();
    }

    public List<UserResponseDTO> getDTOAll() {

        return repository.findAll()
                .stream()
                .map(user -> {
                    UserResponseDTO dto = new UserResponseDTO();

                    dto.id = user.getId();
                    dto.nom = user.getNom();
                    dto.prenom = user.getPrenom();
                    dto.username = user.getUsername();
                    dto.email = user.getEmail();
                    dto.role = user.getRole();

                    return dto;
                })
                .toList();
    }

    private static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    public boolean authenticate(String username, String password) {

        boolean isEmail = username.matches(EMAIL_REGEX);

        return (isEmail
                ? repository.findByEmail(username)
                : repository.findByUsername(username))
                .map(user -> passwordEncoder.matches(password, user.getPasswd()))
                .orElse(false);

    }
}