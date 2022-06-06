import { Container } from "@mui/material";
import type { NextPage } from "next";
import GuestHeader from "../common/header/GuestHeader";
import OneColumn from "../common/layout/OneColumn";
import { centering_vertical } from "../../styles/common";
import {
  Sign_Title,
  Border_Or,
  Google_Button,
  Mail_Field,
  Password_Field,
  Sign_Submit,
} from "../../styles/sign-style";
import { LocaleText, useLocale } from "../../hooks/useLocal";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { Resolver, SubmitHandler, useForm } from "react-hook-form";

// TODO implement validation of fields

type FormValues = {
  email: string;
  password: string;
};

const SignIn: NextPage = (): EmotionJSX.Element => {
  const { txt }: { txt: LocaleText } = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

  // TODO fix rendering error of useRef
  return (
    <OneColumn>
      <GuestHeader />

      <Container maxWidth="sm">
        <main css={centering_vertical}>
          <Sign_Title>{txt.signin_ruhuna}</Sign_Title>

          <Google_Button>{txt.with_google}</Google_Button>

          <Border_Or />

          <form onSubmit={handleSubmit(onSubmit)}>
            
            <Mail_Field
              required
              type="email"
              label={txt.email}
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register("email", 
                {
                  required:{
                    value: true,
                    message:"email is required"}, 
                  maxLength:{
                    value:20,
                    message:'length is 20'
                  }
                }
              )}
            />

            <Password_Field
              label={txt.password}
              {...(register("password"), { required: true, maxLength: 20 })}
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
