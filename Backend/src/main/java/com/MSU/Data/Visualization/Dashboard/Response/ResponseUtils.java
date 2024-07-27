package com.MSU.Data.Visualization.Dashboard.Response;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.MSU.Data.Visualization.Dashboard.Payload.Response.ApiResponse;

public class ResponseUtils {


    public static ResponseEntity<ApiResponse> failedResponse(String errorMsg) {
        ApiResponse res = new ApiResponse();
        res.setReason(errorMsg);
        res.setResponseCode(ApiResponse.ResponseMessage.FAILED.code);
        res.setResponseMessage(ApiResponse.ResponseMessage.FAILED.name);
        return new ResponseEntity<>(res, HttpStatus.UNAUTHORIZED); // Using 401 for invalid credentials
    }

    public static ResponseEntity<ApiResponse> successResponse(String successMsg) {
        ApiResponse res = new ApiResponse();
        res.setReason(successMsg);
        res.setResponseCode(ApiResponse.ResponseMessage.SUCCESS.code);
        res.setResponseMessage(ApiResponse.ResponseMessage.SUCCESS.name);
        return new ResponseEntity<>(res, HttpStatus.OK); // Using 200 for success
    }
}
