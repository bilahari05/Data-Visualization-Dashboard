package com.MSU.Data.Visualization.Dashboard.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.MSU.Data.Visualization.Dashboard.Service.DocumentService;

@RestController
@RequestMapping("/api/documents")
@CrossOrigin(origins = "http://localhost:3000")
public class DocumentController {
	@Autowired
	private DocumentService documentService;

	@PostMapping("/upload/excel")
	public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file, @RequestParam("userId") Long userId,
			@RequestParam("Status") int id) {
		try {

			// List<List<Object>> data = documentService.saveExcelData(file);
			return documentService.readExcel(file, userId,id);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Failed to upload Excel file.");
		}
	}
}