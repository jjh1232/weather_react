import React from "react";
import { useCookies } from "react-cookie";


export default function Oauth2userextra(){
    const {userinfo}=useCookies();
    

    return (
        <>
        oauth2유저추가정보
        </>
    )
}