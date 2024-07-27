package com.MSU.Data.Visualization.Dashboard.Payload.Response;

import java.util.HashMap;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ApiResponse {

    private static Map<String, String> messageMap = new HashMap<>();
    public String getResponseCode() {
		return responseCode;
	}

	public void setResponseCode(String responseCode) {
		this.responseCode = responseCode;
	}

	public String getResponseMessage() {
		return responseMessage;
	}

	public void setResponseMessage(String responseMessage) {
		this.responseMessage = responseMessage;
	}

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}
    public String getStatusCode() {
		return statusCode;
	}

	public void setStatusCode(String statusCode) {
		this.statusCode = statusCode;
	}
	private String statusCode; 
	private String responseCode;
    private String responseMessage;
    private String reason;

    static {
        messageMap.put("SC", "Success");
        messageMap.put("FD", "Failed");
    }

    public enum ResponseMessage {
        SUCCESS("SC", "Success"),
        FAILED("FD", "Failed");

        public final String code;
        public final String name;

        ResponseMessage(String code, String name) {
            this.code = code;
            this.name = name;
        }
    }
}
