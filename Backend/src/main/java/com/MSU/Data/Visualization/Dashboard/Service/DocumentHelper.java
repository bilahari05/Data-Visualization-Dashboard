package com.MSU.Data.Visualization.Dashboard.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
@Service
public class DocumentHelper {
	
	    public static List<List<Object>> readExcel(MultipartFile file) throws IOException {
	        List<List<Object>> data = new ArrayList<>();
	        InputStream inputStream = file.getInputStream();
	        Workbook workbook = new XSSFWorkbook(inputStream);
	        Sheet sheet = workbook.getSheetAt(0);
	        for (Row row : sheet) {
	            List<Object> rowData = new ArrayList<>();
	            for (Cell cell : row) {
	                switch (cell.getCellType()) {
	                    case STRING:
	                        rowData.add(cell.getStringCellValue());
	                        break;
	                    case NUMERIC:
	                        if (DateUtil.isCellDateFormatted(cell)) {
	                            rowData.add(cell.getDateCellValue());
	                        } else {
	                            rowData.add(cell.getNumericCellValue());
	                        }
	                        break;
	                    case BOOLEAN:
	                        rowData.add(cell.getBooleanCellValue());
	                        break;
	                    case FORMULA:
	                        switch (cell.getCachedFormulaResultType()) {
	                            case STRING:
	                                rowData.add(cell.getRichStringCellValue());
	                                break;
	                            case NUMERIC:
	                                rowData.add(cell.getNumericCellValue());
	                                break;
	                            case BOOLEAN:
	                                rowData.add(cell.getBooleanCellValue());
	                                break;
	                            default:
	                                rowData.add("FORMULA");
	                        }
	                        break;
	                    case BLANK:
	                        rowData.add("");
	                        break;
	                    default:
	                        rowData.add("UNKNOWN");
	                }
	            }
	            data.add(rowData);
	        }
	        workbook.close();
	        return data;
	    }
	  
}
