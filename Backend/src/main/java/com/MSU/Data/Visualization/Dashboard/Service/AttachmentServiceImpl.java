package com.MSU.Data.Visualization.Dashboard.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MSU.Data.Visualization.Dashboard.Model.Attachment;
import com.MSU.Data.Visualization.Dashboard.Repository.AttachmentRepository;

@Service
public class AttachmentServiceImpl implements AttachmentService {

    private static final Logger logger = LoggerFactory.getLogger(AttachmentServiceImpl.class);

//    private String fileBasePath = "C:\\Users\\aswin\\OneDrive\\Desktop\\Aswin";

    @Value("${file.upload.base-path}")
    private String fileBasePath;
    @Autowired
    private AttachmentRepository attachmentRepository;

    @Override
    public Attachment saveAttachment(Long userId, String filePath, int id) {
        try {
        	 String uniqueId = UUID.randomUUID().toString();
            Attachment attachment = new Attachment(userId, filePath);
            attachment.setStatus(id);
            attachment.setUniquId( Integer.parseInt(uniqueId));
            return attachmentRepository.save(attachment);
        } catch (Exception e) {
            String errorMessage = "Failed to save attachment for user ID: " + userId;
            logger.error(errorMessage, e);
            return null;
        }
    }

    @Override
    public String saveFileLocally(MultipartFile file, Long userId) throws IOException {
        String originalFilename = file.getOriginalFilename();
        String uniqueFilename = "user_" + userId + "_" + System.currentTimeMillis() + "_" + originalFilename;

        File directory = new File(fileBasePath);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        Path filePath = Paths.get(fileBasePath, uniqueFilename);
        File localFile = new File(filePath.toString());
        try (FileOutputStream fos = new FileOutputStream(localFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            String errorMessage = "Failed to save file locally for user ID: " + userId;
            logger.error(errorMessage, e);
            throw e;
        }

        return filePath.toString();
    }

    @Override
    public Attachment getAttachmentByUserId(int uniquId) {
        try {
            return attachmentRepository.findByuniquId(uniquId);
        } catch (Exception e) {
            String errorMessage = "Failed to fetch attachment for user ID: " + uniquId;
            logger.error(errorMessage, e);
            return null;
        }
    }

    public List<Attachment> findAttachmentsByUserIdAndStatus(Long userId, int status) {
        try {
            List<Attachment> attachments = attachmentRepository.findByUserIdAndStatus(userId, status);

            if (attachments != null) {
                for (Attachment attachment : attachments) {
                    // Extract the file name from the full file path
                    String fullPath = attachment.getFilePath();
                    String fileName = Paths.get(fullPath).getFileName().toString();

                    // Set the file name back into the attachment's filePath
                    attachment.setFilePath(fileName);
                }
            }

            return attachments;
        } catch (Exception e) {
            String errorMessage = "Failed to find attachments for user ID: " + userId + " and status: " + status;
            logger.error(errorMessage, e);
            return null;
        }
    }
}
