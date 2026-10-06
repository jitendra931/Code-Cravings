package com.codecravings.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.codecravings.model.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {

    // Address save(String address);
    Optional<Address> findByStreetAndCityAndStateAndZip(
            String street,
            String city,
            String state,
            String zip);

}
