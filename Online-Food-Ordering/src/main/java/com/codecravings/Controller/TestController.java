package com.codecravings.Controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class TestController {
    @GetMapping("/")
    public String testing() {
        return "for testing";
    }

    @GetMapping("/testing")
    public String test() {

        return "This is working for backend use!";

    }
}
