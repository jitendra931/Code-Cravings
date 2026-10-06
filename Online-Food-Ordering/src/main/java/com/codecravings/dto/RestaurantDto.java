package com.codecravings.dto;

import java.util.List;

import jakarta.persistence.Column;
import lombok.Data;

@Data
public class RestaurantDto {
    private String title;

    private String description;

    @Column(length = 1000)
    private List<String> images;

    private Long Id;

    private String address;
}
