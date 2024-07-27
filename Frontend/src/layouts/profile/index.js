import React, { useEffect, useState } from "react";
import { Box, Card, Typography, Button } from "@mui/material";
import { attachmentService } from "Service/LoginService";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

function Overview() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(null); // null to indicate no status selected

  const fetchReport = async (status) => {
    setLoading(true);
    try {
      const response = await attachmentService.getReport(status);
      setReport(response.data);
      setStatus(status); // Update status to the one being fetched
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
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
              <pre>{JSON.stringify(report, null, 2)}</pre>
            </Box>
          )}
        </Box>
      </Card>
    </DashboardLayout>
  );
}

export default Overview;
