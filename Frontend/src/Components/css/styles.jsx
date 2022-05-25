import { styled } from "@mui/material/styles";
import {
  Paper,
  Button,
  TableCell,
  TextField,
  Tooltip,
  tooltipClasses,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";

const drawerWidth = 230;
const transitionDuration = 350;

export const LogTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(19, 71, 129)",
    color: "rgb(252, 252, 252)",
    boxShadow: theme.shadows[1],
    fontWeight: "bold",
  },
}));

export const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: transitionDuration,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  }),
}));

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
  }),
}));

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const style = {
  position: "absolute",
  alignItems: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  border: "3px solid rgb(19, 71, 129)",
  borderRadius: "5px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const styleOverlay = {
  position: "fixed",
  display: "flex",
  justifyContent: "center",
  left: "25%",
  width: "50%",
  height: "auto",
  bgcolor: "background.paper",
  zIndex: "1000",
  overflowY: "auto",
  border: "3px solid rgb(19, 71, 129)",
  borderRadius: "5px",
  paddingTop: "10px",
  paddingBottom: "10px",
};

export const style2 = {
  position: "absolute",
  alignItems: "center",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  borderRadius: "5px",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export const ItemPara = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "inherit",
  textAlign: "left",
  color: "rgb(12, 0, 57)",
  borderRadius: "20px",
  boxShadow: "none",
}));

export const StyButton = styled(Button)({
  fontFamily: "montserrat",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "13px",
  borderRadius: "20px",
  color: "rgb(19, 71, 129)",
  "&:hover": {
    backgroundColor: "rgb(19, 71, 129)",
    color: "rgb(252, 252, 252)",
    transition: " 0.6s",
  },
});

export const StyButtonDownload = styled(Button)({
  fontFamily: "montserrat",
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "13px",
  borderRadius: "20px",
  marginTop: "10px",
  color: "rgb(248, 248, 248)",
  backgroundColor: "rgb(237, 89, 15)",
  "&:hover": {
    backgroundColor: "rgb(250, 93, 15)",
    color: "rgb(252, 252, 252)",
  },
});

export const StyEmpTableCell = styled(TableCell)({
  fontWeight: "bold",
  textAlign: "left",
  fontSize: "13px",
  color: "rgb(252, 252, 252)",
});

export const StyTableCell = styled(TableCell)({
  fontWeight: "bold",
  textAlign: "center",
  fontSize: "13px",
  color: "rgb(252, 252, 252)",
});

export const StyTextField = styled(TextField)({
  width: "65%",
  marginBottom: "15px",
});

export const StyTextFieldLeave = styled(TextField)({
  width: "65%",
  marginBottom: "15px",
});

export const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "rgb(19, 71, 129)",
    color: "rgb(252, 252, 252)",
    boxShadow: theme.shadows[1],
    fontWeight: "bold",
  },
}));

export const TableItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "center",
  color: "rgb(12, 0, 57)",
  "&:hover": {
    boxShadow: "3px 3px rgba(0,0,0,.1)",
  },
  borderRadius: "20px",
  boxShadow: "none",
}));

export const TableItem2 = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: "rgb(12, 0, 57)",
  "&:hover": {
    boxShadow: "3px 3px rgba(0,0,0,.1)",
  },
  borderRadius: "20px",
  boxShadow: "none",
}));

export const ProjectTable = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  color: "rgb(12, 0, 57)",
  borderRadius: "20px",
  boxShadow: "none",
}));

export const LeavePara = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: "left",
  backgroundColor: "rgb(253, 253, 253)",
  "&:hover": {
    boxShadow: "3px 3px rgba(0,0,0,.1)",
  },
  color: "rgb(12, 0, 57)",
  borderRadius: "20px",
  boxShadow: "none",
}));

export const YearlyBtn = styled(Button)({
  "&:hover": {
    backgroundColor: "rgb(19, 71, 129)",
    color: "rgb(253, 253, 253)",
    transition: " 0.7s",
  },
  fontFamily: "montserrat",
  fontWeight: "bold",
  borderRadius: "3",
  marginBottom: "10px",
});

export const DltBtn = styled(Button)({
  "&:hover": {
    backgroundColor: "rgb(197, 29, 29)",
    color: "rgb(253, 253, 253)",
    transition: " 0.7s",
  },
  fontFamily: "montserrat",
  fontWeight: "bold",
  borderRadius: "3",
  marginBottom: "10px",
});

export const ButtonPara = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
  backgroundColor: "inherit",
  textAlign: "center",
  color: "rgb(12, 0, 57)",
  boxShadow: "none",
}));

export const MenuBtn = styled(Button)({
  fontFamily: "montserrat",
  fontWeight: "bold",
  width: "100%",
});

export const MenuBtn2 = styled(Button)({
  fontFamily: "montserrat",
  fontWeight: "bold",
  width: "25%",
  "&:hover": {
    backgroundColor: "rgb(250, 93, 15)",
  },
});

export const style3 = {
  marginTop: "4%",
  position: "relative",
  alignItems: "center",
  width: "100%",
  borderRadius: "5px",
  bgcolor: "background.paper",
  boxShadow: "0 4px 12px 0 rgba(0, 0, 0, 0.2)",
  p: 4,
};

export const styleGrid = {
  paddingLeft: "8%",
  paddingBottom: "2%",
};
