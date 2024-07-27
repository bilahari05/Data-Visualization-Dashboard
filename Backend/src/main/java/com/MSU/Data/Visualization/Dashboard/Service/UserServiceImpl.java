package com.MSU.Data.Visualization.Dashboard.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.MSU.Data.Visualization.Dashboard.Exceptions.UserAlreadyExistsException;
import com.MSU.Data.Visualization.Dashboard.Model.User;
import com.MSU.Data.Visualization.Dashboard.Payload.Response.ApiResponse;
import com.MSU.Data.Visualization.Dashboard.Repository.UserRepository;
import com.MSU.Data.Visualization.Dashboard.Response.ResponseUtils;

@Service
public class UserServiceImpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

	public ResponseEntity<?> registerUser(User user) {
		try {
			User foundUser = userRepository.findByUsername(user.getUsername());

			if (foundUser != null) {
				throw new UserAlreadyExistsException("UserName already exists : " + user.getUsername());
			}
			List<User> usersWithSameRole = userRepository.findByRole(user.getRole());
			//
			if (usersWithSameRole != null) {
				// Check if the existing user has the same role
				for (User existingUser : usersWithSameRole) {
					if (existingUser.getRole().equals(user.getRole())) {
						if (existingUser.getRole().equals("Admin")) {
							throw new UserAlreadyExistsException(
									"User already exists with role: " + user.getUsername());
						}
					}
				}
			}
			// Encode the password and save the new user
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			User savedUser = userRepository.save(user);
			String reason = "Registration successful";
			Map<String, Object> responseBody = createSuccessResponse(savedUser, reason);

			return new ResponseEntity<>(responseBody, HttpStatus.CREATED);

		} catch (UserAlreadyExistsException e) {
			return ResponseUtils.failedResponse(e.getMessage());
		} catch (Exception e) {
			// Log the exception (optional) and return an appropriate response
			return new ResponseEntity<>("An error occurred during user registration.",
					HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	public ResponseEntity<?> authenticateUser(User user) {

		try {
			User foundUser = userRepository.findByUsername(user.getUsername());
			if (foundUser != null) {
				String reason = "Authentication successful";
				// Check if the provided password matches the stored password
				if (passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
					Map<String, Object> responseBody = createSuccessResponse(foundUser, reason);
					return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
				} else {
					// Incorrect password
					ApiResponse apiResponse = faildResponse("Invalid UserName or Password ");
					return new ResponseEntity<>(apiResponse, HttpStatus.UNAUTHORIZED);
				}
			} else {
				ApiResponse apiResponse = faildResponse("User Not Found");
				return new ResponseEntity<>(apiResponse, HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			// Log the exception (optional) and return an appropriate response
			ApiResponse apiResponse = faildResponse("An error occurred during user registration.");
			return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	private ApiResponse faildResponse(String reason) {
		ApiResponse apiResponse = new ApiResponse();
		// apiResponse.setStatusCode(ApiResponse.ResponseMessage.FAILED.code);
		apiResponse.setResponseCode(ApiResponse.ResponseMessage.FAILED.code);
		apiResponse.setResponseMessage(ApiResponse.ResponseMessage.FAILED.name);
		apiResponse.setReason(reason);
		return apiResponse;
	}

	private Map<String, Object> createSuccessResponse(User foundUser, String reson) {
		ApiResponse apiResponse = new ApiResponse();
		// apiResponse.setStatusCode(ApiResponse.ResponseMessage.SUCCESS.code);
		apiResponse.setResponseCode(ApiResponse.ResponseMessage.SUCCESS.code);
		apiResponse.setResponseMessage(ApiResponse.ResponseMessage.SUCCESS.name);
		apiResponse.setReason(reson);

		// Add user details to the response
		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("user", foundUser);
		responseBody.put("apiResponse", apiResponse);
		return responseBody;
	}

	@Override
	public Optional<User> findUserById(Long id) {
		return userRepository.findById(id);
	}
}