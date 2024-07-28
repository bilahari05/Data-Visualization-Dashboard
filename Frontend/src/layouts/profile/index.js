import React, { useState } from "react";
import { Box, Card, Typography, Button, Table, TableHead, TableBody, TableRow, TableCell, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Document, Page } from 'react-pdf';
import * as XLSX from 'xlsx';
import { attachmentService } from "Service/LoginService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Overview() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState(null);

  const fetchReport = async (status) => {
    setLoading(true);
    try {
      const response = await attachmentService.getReport(status);
      setReport(response.data);
      setStatus(status);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (uniqueId, filePath) => {
    const fileExtension = filePath.split('.').pop().toLowerCase();
    const isPdf = fileExtension === 'pdf';
    const isXls = fileExtension === 'xls' || fileExtension === 'xlsx';

    if (isPdf || isXls) {
      fetchFileContent(uniqueId, isPdf ? 'pdf' : 'xls');
    } else {
      console.error('Unsupported file type');
    }
  };

  const fetchFileContent = async (uniqueId, type) => {
    try {
      const response = await attachmentService.downloadFile(uniqueId, { responseType: 'blob' }); 
      console.log("BLOB",response);
      const fileBlob = new Blob([response.data], { type: response.headers['content-type'] });

      setFileType(type);
      setFileContent(fileBlob);
      setOpen(true);
    } catch (err) {
      console.error("Error fetching file content", err);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFileContent(null);
    setFileType(null);
  };

  const renderFileContent = () => {
    if (fileType === 'pdf') {
      return (
        <Document file={URL.createObjectURL(fileContent)}>
          <Page pageNumber={1} />
        </Document>
      );
    } else if (fileType === 'xls') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        return (
          <Table>
            <TableBody>
              {sheetData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        );
      };
      reader.readAsArrayBuffer(fileContent);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
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
          <Typography variant="h6">Report</Typography>
          <Button
            onClick={() => fetchReport(0)}
            variant="contained"
            color="primary"
            sx={{ marginRight: "10px" }}
          >
            Fetch Downloaded Files
          </Button>
          <Button onClick={() => fetchReport(1)} variant="contained" color="secondary">
            Fetch Uploaded Files
          </Button>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error loading report</Typography>}
          {report && (
            <Box sx={{ marginTop: "20px" }}>
              <Typography variant="body1">
                Status: {status === 0 ? "Downloaded Files" : "Uploaded Files"}
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>File Name</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {report.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>{file.filePath}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleView(file.uniquId, file.filePath)} variant="contained" color="primary">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Box>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>View File</DialogTitle>
        <DialogContent>
          {fileContent ? renderFileContent() : <Typography>Loading file content...</Typography>}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default Overview;
