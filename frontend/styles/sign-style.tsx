import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Box, Button, TextField } from "@mui/material";

// TODO implement validation of fields


const Custom_Border = styled("div")`
  border-bottom: 1px solid #c0c0c0;
  width: 100%;
  margin: 0 12px;
`;

export const Border_Or = ({ text = "OR" }: { text?: string }) => (
  <Box
    css={css`
      display: flex;
      align-items: center;
      width: 100%;
    `}
  >
    <Custom_Border />
    <span>{text}</span>
    <Custom_Border />
  </Box>
);

export const Sign_Title = ({ text }: { text: string }) => (
  <h2
    css={css`
      margin: 32px 0 8px;
    `}
  >
    {text}
  </h2>
);

export const Google_Button = ({ text }: { text: string }) => (
  <Button
    variant="outlined"
    css={css`
      width: 100%;
      margin: 24px 0;
    `}
  >
    {text}
  </Button>
);

export const Mail_Field = ({ text }: { text: string }) => (
  <TextField
    id="outlined-basic"
    label={text}
    variant="outlined"
    css={css`
      width: 100%;
      margin: 24px 0 0;
    `}
  />
);

export const Password_Field = ({ text }: { text: string }) => (
  <TextField
    id="outlined-basic"
    label={text}
    variant="outlined"
    css={css`
      width: 100%;
      margin: 24px 0 0;
    `}
  />
);

export const Sign_Submit = ({ text }: { text: string }) => (
  <Button
    variant="contained"
    css={css`
      width: 100%;
      margin: 24px 0 0;
    `}
  >
    {text}
  </Button>
);
