package com.codecravings.request;

import lombok.Data;

@Data
public class UpdateCartItemRequest {

    public Long cartItem;

    public int quantity;
}
