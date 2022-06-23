import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { css, SerializedStyles } from "@emotion/react";

const modal_style: SerializedStyles = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 160px;
  background-color: #d0d0d0;
  box-shadow: 5px 5px 20px 0px;
  border-radius: 14px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
`;

export default function ModalCircular({ isOpen = true }: { isOpen: boolean }) {
  return (
    <div>
      <Modal open={isOpen} aria-labelledby="modal0-circular-title">
        <Box css={modal_style}>
          <Typography id="modal0-circular-title" variant="h6" component="h2">
            Loading...
          </Typography>
          <CircularProgress />
        </Box>
      </Modal>
    </div>
  );
}
