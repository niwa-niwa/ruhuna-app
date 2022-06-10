import { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

const theme = (mode: PaletteMode) =>(
  createTheme({
    palette: {
      mode,
    },
  }));

export default theme;
