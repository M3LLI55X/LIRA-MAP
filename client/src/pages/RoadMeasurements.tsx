//Christian Wu - s194597
import RideDetails from "../Components/RoadMeasurements/RideDetails";
import Rides from "../Components/RoadMeasurements/Rides";
import { MeasurementsProvider } from "../context/MeasurementsContext";
import { MetasProvider } from "../context/MetasContext";

import DataUsageIcon from "@mui/icons-material/DataUsage";
import DriveEtaIcon from "@mui/icons-material/DriveEta";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import RideCards from "../Components/RoadMeasurements/RideCards";

import IntroductionModal from "../Components/Modal/IntroductionModal";

let drawerWidth = 280;
interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
  openLeftDrawer?: boolean;
  openRightDrawer?: boolean;
}

//Styling for map in the center
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
  openLeftDrawer?: boolean;
  openRightDrawer?: boolean;
}>(({ theme, openRightDrawer, openLeftDrawer, open }) => ({
  flexGrow: 1,
  // padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(openLeftDrawer && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
  marginRight: `-${drawerWidth}px`,
  ...(openRightDrawer && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 1,
  }),
}));

const AppBar = styled(
  MuiAppBar,
  {}
)<AppBarProps>(() => ({
  flexDirection: "row",
  justifyContent: "center",
}));

const RoadMeasurements = () => {
  const [open, setOpen] = React.useState(false);

  const [openLeftDrawer, setOpenLeftDrawer] = React.useState(false);
  const handleOpenLeftDrawerToggle = () => {
    setOpen(!openLeftDrawer);
    setOpenLeftDrawer(!openLeftDrawer);
  };

  const [openRightDrawer, setOpenRightDrawer] = React.useState(false);

  const handleOpenRightDrawerToggle = () => {
    setOpen(!openRightDrawer);
    setOpenRightDrawer(!openRightDrawer);
  };

  return (
    <div className="bigcontent">
      <MeasurementsProvider>
        <MetasProvider>
          <Box
            sx={{
              display: "flex",
              "& .icon-button:hover": {
                color: "yellow",
                backgroundColor: "orange",
              },
              "& .icon-button:active": {
                color: "orange",
              },
            }}
          >
            {/* Navbar */}
            <AppBar position="fixed">
              <Toolbar>
                <IconButton
                  color="inherit"
                  onClick={handleOpenLeftDrawerToggle}
                  className="icon-button"
                  style={{ color: openLeftDrawer ? "orange" : "inherit" }}
                >
                  <DriveEtaIcon />
                </IconButton>

                {/* User Manual Modal */}
                <IntroductionModal></IntroductionModal>

                <IconButton
                  onClick={handleOpenRightDrawerToggle}
                  style={{ color: openRightDrawer ? "orange" : "inherit" }}
                  className="icon-button"
                >
                  <DataUsageIcon />
                </IconButton>
              </Toolbar>
            </AppBar>

            {/* Left drawer */}
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="left"
              open={openLeftDrawer}
            >
              <Toolbar
                sx={{
                  backgroundColor: "rgb(218, 120, 55)",
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  letterSpacing: "0.0075em",
                  color: "white",
                  justifyContent: "center",
                }}
              >
                Trips
              </Toolbar>
              <RideCards></RideCards>
            </Drawer>

            {/* Map in the center */}
            <Main
              open={open}
              openLeftDrawer={openLeftDrawer}
              openRightDrawer={openRightDrawer}
            >
              <Rides />
            </Main>

            {/* Right drawer */}
            <Drawer
              sx={{
                width: drawerWidth,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                  width: drawerWidth,
                  boxSizing: "border-box",
                },
              }}
              variant="persistent"
              anchor="right"
              open={openRightDrawer}
            >
              <Toolbar
                sx={{
                  backgroundColor: "rgb(218, 120, 55)",
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  letterSpacing: "0.0075em",
                  color: "white",
                  justifyContent: "center",
                }}
              >
                Data
              </Toolbar>
              <RideDetails />
            </Drawer>
          </Box>
        </MetasProvider>
      </MeasurementsProvider>
    </div>
  );
};

export default RoadMeasurements;
