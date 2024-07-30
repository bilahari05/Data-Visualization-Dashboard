package com.MSU.Data.Visualization.Dashboard.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.MSU.Data.Visualization.Dashboard.Exceptions.UserAlreadyExistsException;
import com.MSU.Data.Visualization.Dashboard.Model.User;
import com.MSU.Data.Visualization.Dashboard.Payload.Response.ApiResponse;
import com.MSU.Data.Visualization.Dashboard.Response.ResponseUtils;
import com.MSU.Data.Visualization.Dashboard.Service.UserService;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;


    @PostMapping("/register")

    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            
            return userService.registerUser(user);
        } catch (UserAlreadyExistsException e) {
        	 return ResponseUtils.failedResponse(e.getMessage());
        } catch (Exception e) {
            return ResponseUtils.failedResponse("User registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        return userService.authenticateUser(user);
    }
    

    @PostMapping("/profile")
    public ResponseEntity<?> getUserById(@RequestBody Long id) {
        Optional<User> user = userService.findUserById(id);

        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    }


