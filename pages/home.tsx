import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import { client_auth } from "../frontend/lib/firebaseApp";
import Router from "next/router";
import AuthLayout from "../frontend/components/common/layout/AuthLayout";

const initFirebaseAuth = () => {
  return new Promise((resolve) => {
    var unsubscribe = client_auth.onAuthStateChanged((user) => {
      // user オブジェクトを resolve
      resolve(user);

      // 登録解除
      unsubscribe();
    });
  });
};

const Home = () => {
  // const [isLoading, setIsLoading] = useState<boolean>(true);

  // useEffect(() => {
  //   console.log("Home CurrentUser = ", client_auth.currentUser);

  //   if (typeof window !== "undefined") {
  //     if (!client_auth.currentUser) {
  //       const unsubscribe = client_auth.onAuthStateChanged((user) => {
  //         unsubscribe();
          
  //         if (!user) {
  //           Router.push("/");
  //           return;
  //         }
  //         console.log("shcke",user)

  //         setIsLoading(false);
  //       });
  //     }

  //     setIsLoading(false);
  //   }
  // }, []);

  // if(isLoading){
  //   return <h1>Loading...</h1>
  // }

  return (
    <AuthLayout>
      <h1>ホーム画面</h1>
    </AuthLayout>
  )
};

export default Home;
