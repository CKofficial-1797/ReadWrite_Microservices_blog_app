// import React from 'react'
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"

// const LoginPage = () => {
//   return (
//     <div>    <Card className="w-[350px]">
//     <CardHeader>
//       <CardTitle>Login to the ReadWrite Paradise</CardTitle>
//       <CardDescription>Let the musings of different minds to colllide </CardDescription>
//     </CardHeader>
//     <CardContent>
//      <Button>Login with Goggle</Button>
//     </CardContent>
//     <CardFooter className="flex justify-between">
//       <Button variant="outline">Cancel</Button>
//       <Button>Deploy</Button>
//     </CardFooter>
//   </Card>
// </div>
//   )
// }

// export default LoginPage;

"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { useAppData, user_service } from "@/context/AppContext";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import Loading from "@/components/loading";

const LoginPage = () => {
  const { isAuth, setIsAuth, loading, setLoading, setUser,user } = useAppData();
  console.log("user", user);


  if (isAuth) return redirect("/blogs");

  const responseGoogle = async (authResult: any) => {
    setLoading(true);
    try {
      const result = await axios.post(`${user_service}/api/v1/login`, {
        code: authResult["code"],
      });

      Cookies.set("token", result.data.token, {
        expires: 5,
        secure: true,
        path: "/",
      });
      toast.success(result.data.message);
      setIsAuth(true);
      setLoading(false);
      setUser(result.data.user);
    } catch (error) {
      console.log("error", error);
      toast.error("Problem while login you");
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="w-[350px] m-auto mt-[200px]">
          <Card className="w-[350px]">
            <CardHeader>
            <CardTitle>Login to the ReadWrite Paradise</CardTitle>
             <CardDescription>Let the musings of different minds to colllide </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Button > */}
              <Button onClick={googleLogin}>
                Login with google{" "}
                <img
                  src={"/image.png"}
                  className="w-6 h-6"
                  alt="google icon"
                />
              </Button>
            </CardContent>
          </Card>
        </div>
       )} 
    </>
  );
};

export default LoginPage;
