import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { css, SerializedStyles } from "@emotion/react";
import { useContext } from "react";
import { ThemeModeContext } from "../../../hooks/ThemeMode/ThemeModeContext";

const modal_style: SerializedStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 160px;
  background-color: #d0d0d0;
  border-radius: 14px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

const dark_style: SerializedStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 160px;
  background-color: #484848;
  border-radius: 14px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

export function ModalCircular({ isOpen = true }: { isOpen: boolean }) {
  let is_dark:boolean = false

  const {mode} = useContext(ThemeModeContext);



  // const is_dark = localStorage.getItem(VARS.THEME_MODE) === "dark"

  return (
    <>
        <Modal
          open={isOpen}
          disableAutoFocus={true}
          disableScrollLock={true}
          disableEnforceFocus={true}
        >
          <Box css={mode === "dark" ? dark_style :modal_style}>
            <Typography variant="h6" component="h2">
              Loading...
            </Typography>
            <br />
            <CircularProgress />
          </Box>
        </Modal>
    </>
  );
}
