package com.example.ecinventory.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.ecinventory.entity.Product;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.QueryHints;
import jakarta.persistence.QueryHint;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name="jakarta.persistence.lock.timeout", value="3000")})
    Optional<Product> findById(Long id);
}
