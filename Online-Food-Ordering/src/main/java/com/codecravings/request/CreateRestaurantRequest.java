package com.codecravings.request;

import java.util.List;

import com.codecravings.model.Address;
import com.codecravings.model.ContactInformation;

import lombok.Data;

@Data
public class CreateRestaurantRequest {

    private Long id;
    private String name;

    private String description;
    private String cousineType;
    private Address address;
    private ContactInformation contactInformation;
    private String openingHours;
    private List<String> images;

}
