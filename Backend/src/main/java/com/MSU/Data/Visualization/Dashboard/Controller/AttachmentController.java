package com.MSU.Data.Visualization.Dashboard.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<Resource> downloadFile(@RequestParam int uniquId) {
        try {
            // Fetch attachment from the database
            Attachment attachment = attachmentService.getAttachmentByUserId(uniquId);
            if (attachment == null) {
                String errorMessage = "No attachment found for user ID: " + uniquId;
                logger.error(errorMessage);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            // Load file from local storage
            File file = new File(attachment.getFilePath());
            if (!file.exists()) {
                String errorMessage = "File not found: " + attachment.getFilePath();
                logger.error(errorMessage);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }

            Resource resource = new FileSystemResource(file);
            String contentType = "application/octet-stream"; // default for unknown types
 
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"");
            headers.add(HttpHeaders.CONTENT_TYPE, contentType);

            return new ResponseEntity<>(resource, headers, HttpStatus.OK);

        } catch (Exception e) {
            String errorMessage = "Failed to download file for user ID: " + uniquId;
            logger.error(errorMessage, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
    
    @GetMapping("/attachments")
    public ResponseEntity<List<Attachment>> getAttachmentsByUserIdAndStatus(
            @RequestParam Long userId,
            @RequestParam int status) {

        List<Attachment> attachments = attachmentService.findAttachmentsByUserIdAndStatus(userId, status);

        if (attachments != null && !attachments.isEmpty()) {
            return ResponseEntity.ok(attachments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
