package com.MSU.Data.Visualization.Dashboard.Service;

import java.util.Optional;

import org.springframework.http.ResponseEntity;

import com.MSU.Data.Visualization.Dashboard.Exceptions.UserAlreadyExistsException;
import com.MSU.Data.Visualization.Dashboard.Model.User;

public interface UserService {

	ResponseEntity<?> registerUser(User user) throws UserAlreadyExistsException;

	ResponseEntity<?> authenticateUser(User user);

	Optional<User> findUserById(Long id);

}
