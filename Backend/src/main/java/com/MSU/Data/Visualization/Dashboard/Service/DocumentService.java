package com.MSU.Data.Visualization.Dashboard.Service;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

public interface DocumentService {

	ResponseEntity<?> readExcel(MultipartFile file,Long userId,int id);

}
