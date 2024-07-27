// Dashboard.js
import React from "react";
// import Grid from "@mui/material/Grid";
// import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import { lazy } from "react"; from "examples/Footer";
// import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
// import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
// import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
// import Projects from "layouts/dashboard/components/Projects";
// import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import FileUpload from "../../components/FileUpload/FileUpload";

// import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

import { useLocation } from "react-router-dom";
import { Box, Card, FormControl, InputLabel, MenuItem, NativeSelect, Select } from "@mui/material";
import GraphUpload from "components/FileUpload/GraphUpload";

function Dashboard() {
  const { sales, tasks } = reportsLineChartData;
  const location = useLocation();
  const userData = location.state?.userData;

  const [dropdown1, setDropdown1] = React.useState("");
  const [dropdown2, setDropdown2] = React.useState("");
  const [dropdown3, setDropdown3] = React.useState("");

  const handleChangeDropdown1 = (event) => {
    setDropdown1(event.target.value);
  };

  const handleChangeDropdown2 = (event) => {
    setDropdown2(event.target.value);
  };

  const handleChangeDropdown3 = (event) => {
    setDropdown3(event.target.value);
  };
  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <Card>
        <Box
          display="flex"
          justifyContent="left"
          alignItems="center"
          minHeight="100px"
          marginLeft="20px"
        >  */}
          <FileUpload />
        {/* </Box>  */}
        
       {/* </Card>  */}
    </DashboardLayout>
  );
}

export default Dashboard;
