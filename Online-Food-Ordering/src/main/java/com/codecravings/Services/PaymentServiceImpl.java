package com.codecravings.Services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.codecravings.model.Orders;
import com.codecravings.response.PaymentResponse;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

@Service
public class PaymentServiceImpl implements PaymentService {

        @Value("${strip.api.key}")
        private String stripeSecreteKey;

        @Override
        public PaymentResponse createPaymentLink(Orders order) throws Exception {

                Stripe.apiKey = stripeSecreteKey;

                long amountInRupees = order.getTotalPrice();

                double usdToInrRate = 96.45;

                double usdAmount = amountInRupees / usdToInrRate;

                String usdDisplay = String.format(
                                "Approx. USD value: $%.2f",
                                usdAmount);

                long amountInPaise = amountInRupees * 100L;

                SessionCreateParams params = SessionCreateParams.builder()

                                .addPaymentMethodType(
                                                SessionCreateParams.PaymentMethodType.CARD)

                                .setMode(
                                                SessionCreateParams.Mode.PAYMENT)

                                .setSuccessUrl(
                                                "http://localhost:5173/payment/success/"
                                                                + order.getId())

                                .setCancelUrl(
                                                "http://localhost:5173/payment/fail")

                                .addLineItem(
                                                SessionCreateParams.LineItem.builder()

                                                                .setQuantity(1L)

                                                                .setPriceData(
                                                                                SessionCreateParams.LineItem.PriceData
                                                                                                .builder()

                                                                                                .setCurrency("inr")

                                                                                                .setUnitAmount(
                                                                                                                amountInPaise)

                                                                                                .setProductData(
                                                                                                                SessionCreateParams.LineItem.PriceData.ProductData
                                                                                                                                .builder()

                                                                                                                                .setName(
                                                                                                                                                "Code-Cravings")

                                                                                                                                .setDescription(
                                                                                                                                                usdDisplay)

                                                                                                                                .build())

                                                                                                .build())

                                                                .build())

                                .build();

                Session session = Session.create(params);

                PaymentResponse response = new PaymentResponse();

                response.setPayment_url(
                                session.getUrl());

                return response;
        }
}