package com.MSU.Data.Visualization.Dashboard.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.MSU.Data.Visualization.Dashboard.Model.Attachment;

import jakarta.transaction.Transactional;

public interface AttachmentRepository extends JpaRepository<Attachment, Long> {

	Attachment findByuniquId(int userId);
	List<Attachment> findByUserIdAndStatus(Long userId, int status);

}