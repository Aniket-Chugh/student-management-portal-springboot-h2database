# Spring Boot Layered Architecture & Exception Handling (Experiment 2.3)

## Overview
This is a Spring Boot application demonstrating a layered architecture (Controller, Service, Repository), RESTful APIs, Input Validation, and Global Exception Handling.

## Technologies Used
- **Java 17**
- **Spring Boot 3**
- **Spring Web** (REST API)
- **Spring Boot Validation** (Hibernate Validator)
- **Lombok** (Code reduction)
- **ConcurrentHashMap** (In-memory storage simulating a database)

## Features
- **Layered approach:** Clear separation of concerns (Model, DTO, Repository, Service, Controller).
- **Validation:** Utilizes `@NotBlank`, `@Email`, `@NotNull`, and `@Min`.
- **Global Exception Handling:** Centralized `@ControllerAdvice` to handle custom `ResourceNotFoundException` and validation errors (`MethodArgumentNotValidException`).

## How to Run
1. Ensure you have **Java 17** and **Maven** installed.
2. Open a terminal in the project root directory (`d:\download\exp_7\student-api`).
3. Run the application:
   ```shell
   mvn spring-boot:run
   ```
4. The application will start on `http://localhost:8080`.

## API Endpoints (cURL / Postman)

### 1. Create a Student (POST)
- **URL**: `http://localhost:8080/api/students`
- **Body** (JSON):
  ```json
  {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "age": 20,
      "course": "Computer Science"
  }
  ```

### 2. Get All Students (GET)
- **URL**: `http://localhost:8080/api/students`

### 3. Get Student by ID (GET)
- **URL**: `http://localhost:8080/api/students/1`

### 4. Update a Student (PUT)
- **URL**: `http://localhost:8080/api/students/1`
- **Body** (JSON):
  ```json
  {
      "name": "John Doe Updated",
      "email": "john.update@example.com",
      "age": 21,
      "course": "Information Technology"
  }
  ```

### 5. Delete a Student (DELETE)
- **URL**: `http://localhost:8080/api/students/1`

### 6. Test Validation Error
Try creating a student with invalid data (e.g., negative age or missing email) to see the Global Exception Handler return structured bad request errors.
