package com.speakeasy.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "interview_questions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @Column(nullable = false, length = 50)
    private String role; // Software Engineer, Data Analyst, Product Manager, General HR

    @Column(nullable = false, length = 50)
    private String category; // Behavioral, Technical, Icebreaker, etc.

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;
}
