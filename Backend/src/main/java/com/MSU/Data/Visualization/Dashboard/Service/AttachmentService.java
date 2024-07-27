package com.MSU.Data.Visualization.Dashboard.Service;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.MSU.Data.Visualization.Dashboard.Model.Attachment;
@Service
public interface AttachmentService {

	public Attachment saveAttachment(Long userId, String filePath, int id);

	public String saveFileLocally(MultipartFile file, Long userId) throws IOException;

	public Attachment getAttachmentByUserId(int userId);

	public List<Attachment> findAttachmentsByUserIdAndStatus(Long userId, int status);
}
