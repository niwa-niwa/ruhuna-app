import { css } from "@emotion/react";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import styled from "@emotion/styled";
import {
  Box,
  Button,
  ButtonProps,
  TextField,
  TextFieldProps,
  Typography,
  TypographyProps,
} from "@mui/material";

const Custom_Border = styled("div")`
  border-bottom: 1px solid #c0c0c0;
  width: 100%;
  margin: 0 12px;
`;

export const Border_Or = ({
  text = "OR",
}: {
  text?: string;
}): EmotionJSX.Element => (
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

export const Sign_Title = ({
  children,
  ...props
}: TypographyProps): EmotionJSX.Element => (
  <Typography
    variant="h2"
    gutterBottom
    css={css`
      font-size: 32px;
      margin: 32px 0 8px;
    `}
    {...props}
  >
    {children}
  </Typography>
);

export const Google_Button = ({
  children,
  ...props
}: ButtonProps): EmotionJSX.Element => (
  <Button
    variant="outlined"
    css={css`
      width: 100%;
      margin: 24px 0;
    `}
    {...props}
  >
    {children}
  </Button>
);

export const Mail_Field = (props: TextFieldProps): EmotionJSX.Element => (
  <TextField
    variant="outlined"
    css={css`
      width: 100%;
      margin: 24px 0 0;
    `}
    {...props}
  />
);

export const Password_Field = (props: TextFieldProps): EmotionJSX.Element => (
  <TextField
    variant="outlined"
    css={css`
      width: 100%;
      margin: 24px 0 0;
    `}
    {...props}
  />
);

export const Sign_Submit = ({
  children,
  ...props
}: ButtonProps): EmotionJSX.Element => (
  <Button
    variant="contained"
    css={css`
      width: 100%;
      margin: 24px 0 0;
    `}
    {...props}
  >
    {children}
  </Button>
);
