package com.experiment.student.service;

import com.experiment.student.dto.StudentDto;
import com.experiment.student.exception.ResourceNotFoundException;
import com.experiment.student.model.Student;
import com.experiment.student.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("null")
public class StudentService {

    private final StudentRepository repository;

    public StudentService(StudentRepository repository) {
        this.repository = repository;
    }

    public List<StudentDto> getAllStudents() {
        return repository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentDto getStudentById(Long id) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        return mapToDto(student);
    }

    public StudentDto createStudent(StudentDto studentDto) {
        Student student = mapToModel(studentDto);
        Student savedStudent = repository.save(student);
        return mapToDto(savedStudent);
    }

    public StudentDto updateStudent(Long id, StudentDto studentDto) {
        Student student = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        
        student.setName(studentDto.getName());
        student.setEmail(studentDto.getEmail());
        student.setAge(studentDto.getAge());
        student.setCourse(studentDto.getCourse());
        
        Student updatedStudent = repository.save(student);
        return mapToDto(updatedStudent);
    }

    public void deleteStudent(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        repository.deleteById(id);
    }

    private StudentDto mapToDto(Student student) {
        return new StudentDto(student.getId(), student.getName(), student.getEmail(), student.getAge(), student.getCourse());
    }

    private Student mapToModel(StudentDto studentDto) {
        return new Student(studentDto.getId(), studentDto.getName(), studentDto.getEmail(), studentDto.getAge(), studentDto.getCourse());
    }
}
