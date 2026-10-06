package com.codecravings.Services;

import org.springframework.stereotype.Service;

import com.codecravings.model.Orders;
import com.codecravings.response.PaymentResponse;

@Service
public interface PaymentService {

    public PaymentResponse createPaymentLink(Orders order) throws Exception;
}
