
package com.cloudsage.resource;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CloudResourceRepository
        extends JpaRepository<CloudResource, Long> {

    Optional<CloudResource> findByResourceName(String resourceName);
}
