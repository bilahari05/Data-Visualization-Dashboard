import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Pagination,
  Paper,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { fileUploadService } from "../../Service/LoginService";
import * as XLSX from "xlsx";
import { Alert } from '@mui/material';

// Mapping of month names to their numeric values
const monthMapping = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

// Fields where search should be used instead of range filtering
const searchFields = ["Name", "Address", "Email", "Phone number","Product Name"];

const GraphUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterField, setFilterField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [monthValues, setMonthValues] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 20;

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fileUploadService.uploadFile(formData);
      console.log(response.data.data, "file success");

      const data = response.data.data;
      if (Array.isArray(data) && data.length > 0) {
        const headers = data[0];
        const rows = data.slice(1);

        const structuredData = rows.map((row) => {
          return headers.reduce((acc, header, index) => {
            acc[header] = row[index];
            return acc;
          }, {});
        });

        setTableData(structuredData);
        setFilteredData(structuredData);

        // Extract unique month values if month is present
        const uniqueMonthValues = [
          ...new Set(structuredData.map((row) => row.Month)),
        ];
        setMonthValues(uniqueMonthValues);

        setFilterField("");
        setSearchValue("");
        setFromValue("");
        setToValue("");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleChangeFilterField = (event) => {
    setFilterField(event.target.value);
    setSearchValue("");
    setFromValue("");
    setToValue("");
    setFilteredData(tableData);
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const getMonthNumericValue = (month) => {
    return monthMapping[month] || 0;
  };

  const handleFilterChange = () => {
    let filtered = [];

    if (searchFields.includes(filterField)) {
      filtered = tableData.filter((row) => {
        const fieldValue = row[filterField] || "";
        return fieldValue.toLowerCase().includes(searchValue);
      });
    } else if (filterField === "Month") {
      const fromMonth = getMonthNumericValue(fromValue);
      const toMonth = getMonthNumericValue(toValue);

      filtered = tableData.filter((row) => {
        const month = getMonthNumericValue(row[filterField]);
        return month >= fromMonth && month <= toMonth;
      });
    } else if (filterField) {
      filtered = tableData.filter((row) => {
        const fieldValue = parseFloat(row[filterField]);
        const from = parseFloat(fromValue);
        const to = parseFloat(toValue);
        return fieldValue >= from && fieldValue <= to;
      });
    }

    // Sort the filtered data in ascending order based on the selected filter field
    filtered.sort((a, b) => {
      const aValue = parseFloat(a[filterField]);
      const bValue = parseFloat(b[filterField]);

      if (isNaN(aValue) || isNaN(bValue)) {
        // If values are not numbers, perform a string comparison
        return a[filterField].localeCompare(b[filterField]);
      }
      return aValue - bValue;
    });

    setFilteredData(filtered);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // const handleDownload = () => {
  //   const worksheet = XLSX.utils.json_to_sheet(filteredData);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
  //   XLSX.writeFile(workbook, "filtered_data.xlsx");
  // };

  const handleDownload = async () => {
    // Create Excel file
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    XLSX.writeFile(workbook, "filtered_data.xlsx");
    // Convert Excel file to binary
    const excelBinary = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  
    // Create Blob from binary
    const excelBlob = new Blob([excelBinary], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const formData = new FormData();
    formData.append("file", excelBlob, "filtered_data.xlsx");
  
    // Upload Excel file to server
    try {
      const response = await fileUploadService.uploadFile(formData);
      console.log("Excel upload response:", response.data);
    } catch (error) {
      console.error("Error uploading Excel:", error);
    }
  
  };
  

  const renderTable = () => {
    const hasData = Array.isArray(filteredData) && filteredData.length > 0;
    const columns = hasData ? Object.keys(filteredData[0] || {}) : [];
    const currentItems = hasData
      ? filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
      : [];

    return (
      <Card sx={{ marginTop: "20px" }}>
        <Box
          component="form"
          sx={{
            background: "white",
            padding: "15px",
            marginTop: "20px",
            borderBottom: "1px solid #c9c9c9",
          }}
        >
          <FormControl style={{ display: "block" }}>
            <InputLabel id="filter-field-label">Filter Field</InputLabel>
            <Select
              labelId="filter-field-label"
              value={filterField}
              onChange={handleChangeFilterField}
              sx={{ height: "45px", marginRight: "16px", width: "25%" }}
              label="Filter Field"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {tableData.length > 0 &&
                Object.keys(tableData[0] || {}).map((field) => (
                  <MenuItem key={field} value={field}>
                    {field}
                  </MenuItem>
                ))}
            </Select>

            {filterField && searchFields.includes(filterField) && (
              <Alert severity="info" sx={{ width: "100%", marginBottom: "16px", marginTop: "15px" }}>
              We are not using an AI model, so word filtering by text input is not available.
            </Alert>
            )}

            {filterField && filterField === "Month" && (
              <>
                <FormControl sx={{ height: "45px", marginRight: "16px", width: "25%" }}>
                  <InputLabel id="from-value-label">From</InputLabel>
                  <Select
                    labelId="from-value-label"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    sx={{ height: "45px", marginRight: "16px", width: "100%" }}
                    label="From"
                  >
                    {monthValues.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl sx={{ height: "45px", marginRight: "16px", width: "25%" }}>
                  <InputLabel id="to-value-label">To</InputLabel>
                  <Select
                    labelId="to-value-label"
                    value={toValue}
                    onChange={(e) => setToValue(e.target.value)}
                    sx={{ height: "45px", marginRight: "16px", width: "100%" }}
                    label="To"
                  >
                    {monthValues.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}

            {filterField && !searchFields.includes(filterField) && filterField !== "Month" && (
              <>
                <TextField
                  label="From"
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(e.target.value)}
                  sx={{ height: "45px", marginRight: "16px", width: "25%" }}
                />
                <TextField
                  label="To"
                  type="number"
                  value={toValue}
                  onChange={(e) => setToValue(e.target.value)}
                  sx={{ height: "45px", marginRight: "16px", width: "25%" }}
                />
              </>
            )}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginTop: "16px" }}>
              <Button
                variant="outlined"
                color="success"
                onClick={handleDownload}
                sx={{ color: "green", marginRight: "16px", outline: "1px solid green" }}
              >
                Download
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "#FFF" }}
                onClick={handleFilterChange}
              >
                Filter
              </Button>
            </div>
          </FormControl>
        </Box>
        {hasData ? (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableBody>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell sx={{ fontWeight: "600" }} key={column}>
                      {column}
                    </TableCell>
                  ))}
                </TableRow>
                {currentItems.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column}>{row[column]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ textAlign: "center", mt: 2 }}>No Data Found</Box>
        )}
        {hasData && (
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Pagination
              count={Math.ceil(filteredData.length / itemsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
            />
          </Box>
        )}
      </Card>
    );
  };

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <Box
          sx={{ background: "white", padding: "15px", borderRadius: "12px", width: "100%" }}
          display="flex"
          justifyContent="left"
          alignItems="center"
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Grid container direction="column" spacing={2}>
              <Grid item sx={{ padding: "0px" }}>
                <Typography sx={{ padding: "0px" }} variant="h6">
                  Upload a file
                </Typography>
              </Grid>
              <Grid item>
                <input type="file" onChange={handleFileChange} />
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudUploadIcon />}
                  onClick={handleUpload}
                  disabled={uploading}
                  sx={{ mt: 2, color: "#FFF" }}
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
              </Grid>
            </Grid>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "130px",
              opacity: "0.6",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <CloudUploadIcon color="primary" />
          </div>
        </Box>
      </div>
      <Box>{renderTable()}</Box>
    </>
  );
};

export default GraphUpload;