// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Card,
//   Typography,
//   Button,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from "@mui/material";
// import { Document, Page } from "react-pdf";
// import * as XLSX from "xlsx";
// import { attachmentService } from "Service/LoginService";
// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Footer from "examples/Footer";

// function Overview() {
//   const [report, setReport] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [status, setStatus] = useState(null);
//   const [open, setOpen] = useState(false);
//   const [fileContent, setFileContent] = useState(null);
//   const [fileType, setFileType] = useState('');

//   const fetchReport = async (status) => {
//     setLoading(true);
//     try {
//       const response = await attachmentService.getReport(status);
//       setReport(response.data);
//       setStatus(status);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleView = async (uniqueId, filePath) => {
//     try {
//       const response = await attachmentService.downloadFile(uniqueId, { responseType: "blob" });
//      // const fileBlob = new Blob([response.data], { type: response.headers["content-type"] });

//       setFileType(response.headers["content-type"]);
//       setFileContent(response.data);
//       //console.log(response.data,"response.data");
//       setOpen(true);
//     } catch (err) {
//       console.error("Error fetching file content", err);
//     }
//   };

//   const handleClose = () => {
//     setOpen(false);
//     setFileContent(null);
//     setFileType(null);
//   };

//   const isValidBase64 = (str) => {
//     try {
//       return btoa(atob(str)) === str;
//     } catch (err) {
//       return false;
//     }
//   };

//   // const renderFileContent = (fileBase64, fileType) => {
//   //   if (!fileBase64 || !isValidBase64(fileBase64)) return <Typography>Invalid file format</Typography>;

//   //   const byteCharacters = atob(fileBase64);
//   //   const byteNumbers = new Array(byteCharacters.length);
//   //   for (let i = 0; i < byteCharacters.length; i++) {
//   //     byteNumbers[i] = byteCharacters.charCodeAt(i);
//   //   }
//   //   const byteArray = new Uint8Array(byteNumbers);
//   //   const fileBlob = new Blob([byteArray], { type: fileType });
//   //   const fileUrl = URL.createObjectURL(fileBlob);

//   //   if (fileType === "application/pdf") {
//   //     return (
//   //       <Document file={fileUrl}>
//   //         <Page pageNumber={1} />
//   //       </Document>
//   //     );
//   //   } else if (fileType.includes("image/")) {
//   //     return <img src={fileUrl} alt="Preview" style={{ width: '100%' }} />;
//   //   }

//   //   return <Typography>No preview available</Typography>;
//   // };
//   const renderFileContent = (fileBase64, fileType, setFileContent) => {
//     if (!fileBase64 || !isValidBase64(fileBase64)) return <Typography>Invalid file format</Typography>;

//     const byteCharacters = atob(fileBase64);
//     const byteNumbers = new Array(byteCharacters.length);
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }
//     const byteArray = new Uint8Array(byteNumbers);
//     const fileBlob = new Blob([byteArray], { type: fileType });
//     const fileUrl = URL.createObjectURL(fileBlob);

//     if (fileType === "application/pdf") {
//       return (
//         <Document file={fileUrl}>
//           <Page pageNumber={1} />
//         </Document>
//       );
//     } else if (fileType.includes("spreadsheetml") || fileType.includes("excel")) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const firstSheetName = workbook.SheetNames[0];
//         const worksheet = workbook.Sheets[firstSheetName];
//         const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
//         setFileContent(sheetData);
//       };
//       reader.readAsArrayBuffer(fileBlob);
//     }

//     return <Typography>No preview available</Typography>;
//   };

//   const FilePreview = ({ fileBase64, fileType }) => {
//     const [fileContent, setFileContent] = useState([]);

//     useEffect(() => {
//       renderFileContent(fileBase64, fileType, setFileContent);
//     }, [fileBase64, fileType]);

//     if (Array.isArray(fileContent) && fileContent.length > 0) {
//       return (
//         <Table>
//           <TableBody>
//             {fileContent.map((row, rowIndex) => (
//               <TableRow key={rowIndex}>
//                 {row.map((cell, cellIndex) => (
//                   <TableCell key={cellIndex}>{cell}</TableCell>
//                 ))}
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       );
//     }

//     return <Typography>No preview available</Typography>;
//   }
//   return (
//     <DashboardLayout>
//       <DashboardNavbar />
//       <Card sx={{ marginTop: "20px" }}>
//         <Box
//           sx={{
//             background: "white",
//             padding: "15px",
//             marginTop: "20px",
//             borderBottom: "1px solid #c9c9c9",
//           }}
//         >
//           <Typography variant="h6">Report</Typography>
//           <Button
//             onClick={() => fetchReport(0)}
//             variant="contained"
//             color="primary"
//             sx={{ marginRight: "10px", color: "#FFF" }}
//           >
//             Fetch Downloaded Files
//           </Button>
//           <Button
//             onClick={() => fetchReport(1)}
//             variant="contained"
//             color="secondary"
//             sx={{ color: "#FFF" }}
//           >
//             Fetch Uploaded Files
//           </Button>
//           {loading && <Typography>Loading...</Typography>}
//           {error && <Typography color="error">Error loading report</Typography>}
//           <Box sx={{ marginTop: "20px" }}>
//             <Typography variant="body1">
//               Status: {status === 0 ? "Downloaded Files" : "Uploaded Files"}
//             </Typography>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>File Name</TableCell>
//                   <TableCell>Actions</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {report.map((file) => (
//                   <TableRow key={file.id}>
//                     <TableCell>{file.filePath}</TableCell>
//                     <TableCell>
//                       <Button
//                         onClick={() => handleView(file.uniquId, file.filePath)}
//                         variant="contained"
//                         color="primary"
//                         sx={{ color: "#FFF" }}
//                       >
//                         View
//                       </Button>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </Box>
//         </Box>
//       </Card>
//       <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
//         <DialogTitle>View File</DialogTitle>
//         <DialogContent>
//         {renderFileContent(fileContent, fileType)}
//         </DialogContent>
//       </Dialog>
//     </DashboardLayout>
//   );
// }

// export default Overview;

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  Typography,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Document, Page } from "react-pdf";
import * as XLSX from "xlsx";
import { attachmentService } from "Service/LoginService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Overview() {
  const [report, setReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null);
  const [open, setOpen] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [fileType, setFileType] = useState("");

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

  const handleView = async (uniqueId) => {
    try {
      const response = await attachmentService.downloadFile(uniqueId,  { responseType: "text" });
      const base64Data = response.data;
        const fileName = response.headers['File-Name'];
        const mimeType = response.headers['content-type'];

        // Check if the response is an error message
        if (response.status !== 200 || base64Data.startsWith("No attachment found") || base64Data.startsWith("File not found")) {
            console.error("Error fetching file content", base64Data);
            return;
        }

        // Decode base64 to binary
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "Report_file"); // Set the file name dynamically
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Error fetching file content", err);
    }
};
  const handleClose = () => {
    setOpen(false);
    setFileContent(null);
    setFileType(null);
  };

  const isValidBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch (err) {
      return false;
    }
  };

  const renderFileContent = (fileBase64, fileType, setFileContent) => {
    if (!fileBase64 || !isValidBase64(fileBase64))
      return <Typography>Invalid file format</Typography>;

    const byteCharacters = atob(fileBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const fileBlob = new Blob([byteArray], { type: fileType });
    const fileUrl = URL.createObjectURL(fileBlob);

    if (fileType === "application/pdf") {
      return (
        <Document file={fileUrl}>
          <Page pageNumber={1} />
        </Document>
      );
    } else if (fileType.includes("spreadsheetml") || fileType.includes("excel")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setFileContent(sheetData);
      };
      reader.readAsArrayBuffer(fileBlob);
    }

    return <Typography>No preview available</Typography>;
  };

  const FilePreview = ({ fileBase64, fileType }) => {
    const [fileContent, setFileContent] = useState([]);

    useEffect(() => {
      renderFileContent(fileBase64, fileType, setFileContent);
    }, [fileBase64, fileType]);

    if (Array.isArray(fileContent) && fileContent.length > 0) {
      return (
        <Table>
          <TableBody>
            {fileContent.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }

    return <Typography>No preview available</Typography>;
  };

  FilePreview.propTypes = {
    fileBase64: PropTypes.string.isRequired,
    fileType: PropTypes.string.isRequired,
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Card sx={{ marginTop: "20px" }}>
        <Box
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
            sx={{ marginRight: "10px", color: "#FFF" }}
          >
            Fetch Downloaded Files
          </Button>
          <Button
            onClick={() => fetchReport(1)}
            variant="contained"
            color="secondary"
            sx={{ color: "#FFF" }}
          >
            Fetch Uploaded Files
          </Button>
          {loading && <Typography>Loading...</Typography>}
          {error && <Typography color="error">Error loading report</Typography>}
          <Box sx={{ marginTop: "20px" }}>
            <Typography variant="body1">
              Status: {status === 0 ? "Downloaded Files" : "Uploaded Files"}
            </Typography>
            <Table>
              <TableHead></TableHead>
              <TableBody>
                <TableCell>File Name</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Action</TableCell>
                {report.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.filePath}</TableCell>
                    <TableCell>{file.uploadedAt}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleView(file.uniquId)}
                        variant="contained"
                        sx={{
                          backgroundColor: "green",
                          color: "#FFF",
                          "&:hover": {
                            backgroundColor: "darkgreen",
                          },
                        }}
                      >
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>
      </Card>
      <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
        <DialogTitle>View File</DialogTitle>
        <DialogContent>
          <FilePreview fileBase64={fileContent} fileType={fileType} />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

export default Overview;
