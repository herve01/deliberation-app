package com.deliberation.service.cotation;

import com.deliberation.model.cotation.Session;
import com.deliberation.repository.cotation.SessionRepository;
import com.deliberation.service.IService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SessionService implements IService<Session, String> {

    private final SessionRepository repository;

    public SessionService(SessionRepository repository) {
        this.repository = repository;
    }

    @Override
    public Session create(Session instance) {
        instance.setId(UUID.randomUUID().toString().replace("-", ""));
        return repository.save(instance);
    }

    @Override
    public Session update(String id, Session instance) {
        instance.setId(id);
        return repository.save(instance);
    }

    @Override
    public void delete(String id) {
        repository.deleteById(id);
    }

    @Override
    public Optional<Session> get(String id) {
        return repository.findById(id);
    }

    public Optional<Session> getSessionAnnuel(String semestreId) {
        return repository.findOneBySemestreIdAndEstAnnuelIsTrue(semestreId);
    }

    @Override
    public List<Session> getAll() {
        return repository.findAllByOrderBySemestre_NumeroAscNumeroAsc();
    }

    public List<Session> getAll(Integer incrementor) {
        var data = repository.findAllByOrderBySemestre_NumeroAscNumeroAsc();

        if(incrementor > 0)
            data.forEach(s -> {
                int numeroSemestre = s.getSemestre().getNumero(); // 1,2 ou 7,8 etc.
                int normalized = (numeroSemestre - 1) % 2;

                s.getSemestre().setNumero(normalized + 1 + (incrementor * 2));
            });

        return data;
    }

    public List<Session> getAllWithout(Integer incrementor) {
        var data = repository.findAllByEstAnnuelFalseOrderBySemestre_NumeroAscNumeroAsc();

        if(incrementor > 0)
            data.forEach(s -> {
                int numeroSemestre = s.getSemestre().getNumero(); // 1,2 ou 7,8 etc.
                int normalized = (numeroSemestre - 1) % 2;

                s.getSemestre().setNumero(normalized + 1 + (incrementor * 2));
            });

        return data;
    }

    @Override
    public Long count() {
        return repository.count();
    }
}