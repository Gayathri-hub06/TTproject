package com.speakeasy.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpeakEasyApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpeakEasyApplication.class, args);
    }
}
