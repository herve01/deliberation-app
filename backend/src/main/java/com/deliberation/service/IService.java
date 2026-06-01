package com.deliberation.service;

import java.util.List;
import java.util.Optional;

public interface IService <T, ID> {
    T create(T instance);

    T update(ID id, T instance);

    void delete(ID id);

    Optional<T> get(ID id);

    List<T> getAll();

    Long count();
}
