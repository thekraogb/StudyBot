import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import history from "../assets/history.png";
import logout from "../assets/log-out.png";
import newchat from "../assets/new.png";
import { useState } from "react";

const Appbar = () => {
  return (
    <Box position="sticky" sx={{ top: 0, flexGrow: 1, zIndex: 1000 }}>
      <AppBar
        sx={{
          boxShadow: "none",
          paddingTop: "5px",
          backgroundColor: "#FCFCFC",
        }}
      >
        <Toolbar>
          <Button
            color="inherit"
            sx={{ padding: "7px", margin: 0, minWidth: "auto" }}
          >
            <IconButton sx={{ padding: 0, margin: 0 }}>
              <img
                src={history}
                alt="History"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          </Button>

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              marginLeft: "22px",
              fontFamily: "Nunito",
              color: "black",
              fontSize: "2.30rem",
              fontWeight: 550,
            }}
          >
            STUDYBOT
          </Typography>
          <Button
            color="inherit"
            sx={{ padding: "7px", marginRight: "5px", minWidth: "auto" }}
          >
            <IconButton sx={{ p: 0 }}>
              <img
                src={newchat}
                alt="History"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          </Button>
          <Button
            color="inherit"
            sx={{ padding: "7px", margin: 0, minWidth: "auto" }}
          >
            <IconButton sx={{ p: 0 }}>
              <img
                src={logout}
                alt="History"
                style={{ width: 24, height: 24 }}
              />
            </IconButton>
          </Button>
        </Toolbar>
      </AppBar>
      <div style={{ height: "1px" }}> </div>
    </Box>
  );
};

export default Appbar;
