package com.MSU.Data.Visualization.Dashboard.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.io.File;
import java.nio.file.Files;
import java.util.Base64;

import com.MSU.Data.Visualization.Dashboard.Model.Attachment;
import com.MSU.Data.Visualization.Dashboard.Service.AttachmentService;
import com.MSU.Data.Visualization.Dashboard.Service.DocumentService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.List;

@RestController
@RequestMapping("/api/attachments")
@CrossOrigin(origins = "http://localhost:3000")
public class AttachmentController {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentController.class);

    @Autowired
    private AttachmentService attachmentService;

    @GetMapping("/download")
    public ResponseEntity<String> downloadFile(@RequestParam int uniquId) {
        try {
            // Fetch attachment from the database
            Attachment attachment = attachmentService.getAttachmentByUserId(uniquId);
            if (attachment == null) {
                String errorMessage = "No attachment found for user ID: " + uniquId;
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
            }

            // Load file from local storage
            File file = new File(attachment.getFilePath());
            if (!file.exists()) {
                String errorMessage = "File not found: " + attachment.getFilePath();
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorMessage);
            }

            byte[] fileBytes = Files.readAllBytes(file.toPath());
            String base64File = Base64.getEncoder().encodeToString(fileBytes);
            String mimeType = Files.probeContentType(file.toPath());
            mimeType = mimeType == null ? "application/octet-stream" : mimeType;

            HttpHeaders headers = new HttpHeaders();
            headers.add("File-Name", file.getName());
            headers.add(HttpHeaders.CONTENT_TYPE, mimeType);

            return ResponseEntity.ok().headers(headers).body(base64File);

        } catch (Exception e) {
            String errorMessage = "Failed to download file for user ID: " + uniquId;
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorMessage);
        }
    }
    @GetMapping("/attachments")
    public ResponseEntity<List<Attachment>> getAttachmentsByUserIdAndStatus(
            @RequestParam Long userId,
            @RequestParam int status) {

        List<Attachment> attachments = attachmentService.findAttachmentsByUserIdAndStatus(userId, status);

        if (attachments != null || !attachments.isEmpty()) {
            return ResponseEntity.ok(attachments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
