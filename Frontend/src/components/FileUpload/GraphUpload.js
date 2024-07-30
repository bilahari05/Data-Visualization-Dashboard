import React, { useState } from "react";
import {
  Button,
  Typography,
  Box,
  Card,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Paper,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { fileUploadService } from "../../Service/LoginService";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

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

const GraphUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [xField, setXField] = useState("");
  const [yFields, setYFields] = useState([]);

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
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handleXFieldChange = (event) => {
    setXField(event.target.value);
  };

  const handleYFieldsChange = (event) => {
    const {
      target: { value },
    } = event;
    setYFields(typeof value === "string" ? value.split(",") : value);
  };

  const getChartData = (xField, yFields) => {
    if (!xField || yFields.length === 0) return [];

    const data = filteredData.map((item) => {
      const dataPoint = { name: item[xField] || "Unknown" };
      yFields.forEach((yField) => {
        dataPoint[yField] = parseFloat(item[yField]) || 0;
      });
      return dataPoint;
    });

    console.log("Chart Data:", data);
    return data;
  };

  const renderChart = () => {
    if (!filteredData.length) {
      return (
        <Typography variant="h6" gutterBottom>
          No data to show
        </Typography>
      );
    }

    if (!xField || yFields.length === 0) {
      return (
        <Typography variant="h6" gutterBottom>
          Please select both X-axis and Y-axis fields to display the graph.
        </Typography>
      );
    }

    const chartData = getChartData(xField, yFields);

    return (
      <Card
        sx={{ marginTop: "20px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Box id="chart-box" sx={{ padding: "16px" }}>
          <LineChart
            width={800}
            height={400}
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {yFields.map((yField, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={yField}
                stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              />
            ))}
          </LineChart>
        </Box>
      </Card>
    );
  };

  const downloadChartAsImage = async () => {
    const input = document.getElementById("chart-box");
    const canvas = await html2canvas(input, {
      scale: 2,
      width: input.scrollWidth,
      height: input.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [input.scrollWidth, input.scrollHeight + 400], // Adjust height to fit chart and table
    });

    pdf.addImage(imgData, "PNG", 0, 0, input.scrollWidth, input.scrollHeight);

    // Add additional report content
    pdf.setFontSize(12);
    pdf.text("Report:", 10, input.scrollHeight + 20);

    // Generate table with the data
    let yOffset = input.scrollHeight + 40;
    pdf.autoTable({
      head: [
        Object.keys(tableData[0] || {}).map((field) => ({
          content: field,
          styles: { fontStyle: "bold" },
        })),
      ],
      body: tableData.map((row) => Object.values(row)),
      startY: yOffset,
      theme: "striped",
      headStyles: { fillColor: [0, 0, 0] },
      margin: { top: 10 },
      styles: { fontSize: 8 },
    });

    pdf.save("chart_with_report.pdf");

    const pdfBlob = pdf.output('blob');
    const formData = new FormData();
    formData.append("file", pdfBlob, "chart_with_report.pdf");

    try {
      const response = await fileUploadService.downloadFile(formData);
      console.log("PDF upload response:", response.data);
    } catch (error) {
      console.error("Error uploading PDF:", error);
    }
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar />
        <Box
          sx={{ padding: "16px", display: "flex", flexDirection: "column", alignItems: "center" }}
        >
          <Typography variant="h4" gutterBottom sx={{ marginBottom: "20px", fontWeight: "bold" }}>
            File Upload and Visualization
          </Typography>
          <Card
            sx={{
              padding: "16px",
              marginTop: "20px",
              width: "100%",
              maxWidth: "800px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Box
              component="form"
              sx={{
                background: "white",
                padding: "15px",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <input
                    accept=".xlsx, .xls"
                    style={{ display: "none" }}
                    id="raised-button-file"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="raised-button-file">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      sx={{
                        width: "100%",
                        textTransform: "none",
                        borderRadius: "8px",
                        padding: "8px 16px",
                        fontWeight: "bold",
                        backgroundColor: "#1976d2",
                        color:"#FFF",
                        "&:hover": {
                          backgroundColor: "#115293",
                        },
                      }}
                    >
                      {file ? file.name : "Upload File"}
                    </Button>
                  </label>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    sx={{
                      width: "100%",
                      textTransform: "none",
                      borderRadius: "8px",
                      padding: "8px 16px",
                      fontWeight: "bold",
                      backgroundColor: "#dc004e",
                      color:"#FFF",
                      "&:hover": {
                        backgroundColor: "#9a0036",
                      },
                    }}
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ marginTop: "20px" }}>
                <Grid item xs={12} sm={6}>
                  <FormControl style={{ display: "block" }}>
                    <InputLabel id="x-axis-label">X-Axis Field</InputLabel>
                    <Select
                      labelId="x-axis-label"
                      value={xField}
                      onChange={handleXFieldChange}
                      label="X-Axis Field"
                      sx={{ height: "45px", width: "75%" }}
                    >
                      {tableData.length > 0 &&
                        Object.keys(tableData[0] || {}).map((field) => (
                          <MenuItem key={field} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl style={{ display: "block" }}>
                    <InputLabel id="y-axis-label">Y-Axis Fields</InputLabel>
                    <Select
                      labelId="y-axis-label"
                      multiple
                      value={yFields}
                      onChange={handleYFieldsChange}
                      renderValue={(selected) => selected.join(", ")}
                      label="Y-Axis Fields"
                      sx={{ height: "45px", width: "75%" }}
                    >
                      {tableData.length > 0 &&
                        Object.keys(tableData[0] || {}).map((field) => (
                          <MenuItem key={field} value={field}>
                            {field}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Card>
          {renderChart()}
          <Box sx={{ marginTop: "20px" }}>
            <Button
              variant="contained"
              color="success"
              onClick={downloadChartAsImage}
              sx={{
                textTransform: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                backgroundColor: "#388e3c",
                color:"#FFF",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                },
              }}
            >
              Download Chart and Report
            </Button>
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default GraphUpload;
