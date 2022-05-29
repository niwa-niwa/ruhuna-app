import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { css } from "@emotion/react";
import { JP } from "../../../../consts/texts";

export default function GuestHeader() {
  const pages: Array<{ text: string; link: string }> = [
    { text: "Sign In", link: "signin" },
    { text: "Sign Up", link: "signup" },
  ];

  return (
    <AppBar position="static">
      <Container
        css={css`
          display: flex;
          flex-flow: column;
          align-items: center;
        `}
      >
        <Box
          maxWidth="xl"
          css={css`
            display: contents;
          `}
        >
          <Typography
            variant="h1"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              mt: 1.5,
              display: { xs: "flex" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
              fontSize: 32,
            }}
          >
            {JP.app_name}
          </Typography>
        </Box>

        <Box
          maxWidth="xl"
          color="secondary"
          css={css`
            display: contents;
          `}
        >
          <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
            {pages.map((page, index) => (
              <Button
                key={index}
                sx={{
                  my: 0,
                  mx: 5,
                  color: "white",
                  display: "inline",
                  fontSize: 16,
                }}
                href={page.link}
              >
                {page.text}
              </Button>
            ))}
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}
