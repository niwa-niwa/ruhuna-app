import { Container, TextField } from "@mui/material";
import type { NextPage } from "next";
import GuestHeader from "../common/header/GuestHeader";
import OneColumn from "../common/layout/OneColumn";
import { centering_vertical } from "../../styles/common";
import {
  Sign_Title,
  Border_Or,
  Google_Button,
  Sign_Submit,
} from "../../styles/sign-style";
import { LocaleText, useLocale } from "../../hooks/useLocal";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { SubmitHandler, useForm, Controller } from "react-hook-form";

type FormValues = {
  email: string;
  password: string;
};

// TODO implement useState to request email & password
// TODO refactor LocalText to add error messages 
const SignIn: NextPage = (): EmotionJSX.Element => {
  const { txt }: { txt: LocaleText } = useLocale();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  return (
    <OneColumn>
      <GuestHeader />

      <Container maxWidth="sm">
        <main css={centering_vertical}>
          <Sign_Title>{txt.signin_ruhuna}</Sign_Title>

          <Google_Button>{txt.with_google}</Google_Button>

          <Border_Or />

          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="email"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  type="text"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label={txt.email}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: {
                      value: true,
                      message: "email is required",
                    },
                    maxLength: {
                      value: 20,
                      message: "length is 20",
                    },
                    pattern: {
                      value:
                        /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
                      message: "include @ in the line",
                    },
                  })}
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <TextField
                  type="password"
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  label={txt.password}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  {...register("password", {
                    required: {
                      value: true,
                      message: "password is required",
                    },
                  })}
                  {...field}
                />
              )}
            />

            <Sign_Submit type="submit">{txt.signin}</Sign_Submit>
          </form>
        </main>
      </Container>

      <footer></footer>
    </OneColumn>
  );
};
export default SignIn;
