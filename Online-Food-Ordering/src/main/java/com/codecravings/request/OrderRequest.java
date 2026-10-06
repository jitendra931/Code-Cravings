package com.codecravings.request;

import com.codecravings.model.Address;

import lombok.Data;

@Data
public class OrderRequest {
    private Long restaurantId;
    private Address deliveryAddress;
}
