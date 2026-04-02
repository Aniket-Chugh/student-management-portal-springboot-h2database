package com.experiment.student;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class StudentApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(StudentApiApplication.class, args);
	}

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        System.out.println("\n=====================================================");
        System.out.println("🚀 SERVER STARTED SUCCESSFULLY! 🚀");
        System.out.println("👉 CLICK HERE TO OPEN: http://localhost:8080/ ");
        System.out.println("=====================================================\n");
    }
}
