package com.MSU.Data.Visualization.Dashboard.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.MSU.Data.Visualization.Dashboard.Model.DocumentData;

public interface DocumentDataRepository extends JpaRepository<DocumentData, Long> {
}
