package com.MSU.Data.Visualization.Dashboard.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MSU.Data.Visualization.Dashboard.Model.Attachment;
import com.MSU.Data.Visualization.Dashboard.Model.DocumentData;
import com.MSU.Data.Visualization.Dashboard.Model.User;
import com.MSU.Data.Visualization.Dashboard.Payload.Response.ApiResponse;
import com.MSU.Data.Visualization.Dashboard.Repository.DocumentDataRepository;

@Service
public class DocumentServiceImpl implements DocumentService {

	@Autowired
	private DocumentDataRepository documentDataRepository;

	@Autowired
	private DocumentHelper helper;

	@Autowired
	public AttachmentService attachment;

	private static final Random random = new Random();

	public ResponseEntity<?> readExcel(MultipartFile file, Long userId, int id) {
		if (file.isEmpty()) {
			// Handle empty file scenario
			ApiResponse apiResponse = faildResponse("File is empty.");
			return new ResponseEntity<>(apiResponse, HttpStatus.BAD_REQUEST);
		}
		if (id == 0) {
			try {
				String filePath = attachment.saveFileLocally(file, userId);
				Attachment att = attachment.saveAttachment(userId, filePath,id);
			} catch (IOException e) {
				e.printStackTrace();
				ApiResponse apiResponse = faildResponse("Failed to save file.");
				return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
			}
			List<List<Object>> att = null;
			Map<String, Object> responseBody = createSuccessResponse(att, "FILE SUCCESS ");
			return new ResponseEntity<>(responseBody, HttpStatus.CREATED);

		}
		List<List<Object>> data;
		try {
			data = readExcelData(file);
		} catch (Exception e) {
			e.printStackTrace();
			ApiResponse apiResponse = faildResponse("Failed to read Excel data.");
			return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		if (data != null && !data.isEmpty()) {
			try {
				String filePath = attachment.saveFileLocally(file, userId);
				Attachment att = attachment.saveAttachment(userId, filePath,id);
			} catch (IOException e) {
				e.printStackTrace();
				ApiResponse apiResponse = faildResponse("Failed to save file.");
				return new ResponseEntity<>(apiResponse, HttpStatus.INTERNAL_SERVER_ERROR);
			}

			Map<String, Object> responseBody = createSuccessResponse(data, "Extract successful!");
			return new ResponseEntity<>(responseBody, HttpStatus.CREATED);
		} else {
			ApiResponse apiResponse = faildResponse("Extract failed, no data found.");
			return new ResponseEntity<>(apiResponse, HttpStatus.UNAUTHORIZED);
		}
	}

	public List<List<Object>> readExcelData(MultipartFile file) {
		List<List<Object>> data;
		String documentId = generateDocumentId();
		try {
			data = helper.readExcel(file);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("Failed to read the Excel file", e);
		}

		data.forEach(row -> {
			DocumentData documentData = new DocumentData();
			documentData.setData(row.toString());
			documentData.setDocumentId(documentId);
			documentDataRepository.save(documentData);
		});

		return data;
	}

	public static String generateDocumentId() {
		// Generate a random 6-digit number
		int number = 100000 + random.nextInt(900000); // Ensures the number is always 6 digits
		// Create a unique identifier similar to the example format
		return number + "_Ex";
	}

	private ApiResponse faildResponse(String reason) {
		ApiResponse apiResponse = new ApiResponse();
		apiResponse.setStatusCode("400");
		apiResponse.setResponseCode(ApiResponse.ResponseMessage.FAILED.code);
		apiResponse.setResponseMessage(ApiResponse.ResponseMessage.FAILED.name);
		apiResponse.setReason(reason);
		return apiResponse;
	}

	private Map<String, Object> createSuccessResponse(List<List<Object>> data, String reson) {
		ApiResponse apiResponse = new ApiResponse();
		apiResponse.setStatusCode("200");
		apiResponse.setResponseCode(ApiResponse.ResponseMessage.SUCCESS.code);
		apiResponse.setResponseMessage(ApiResponse.ResponseMessage.SUCCESS.name);
		apiResponse.setReason(reson);

		// Add user details to the response
		Map<String, Object> responseBody = new HashMap<>();
		responseBody.put("data", data);
		responseBody.put("apiResponse", apiResponse);
		return responseBody;
	}

}
