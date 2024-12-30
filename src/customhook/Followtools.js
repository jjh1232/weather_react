import React from "react";
import CreateAxios from "../customhook/CreateAxios";


function asd(){

}


 const following=(friendname)=>{
    const instanceaxios=CreateAxios();
    console.log("팔로잉실행!")
  
    instanceaxios.get("/follow?friendname="+friendname)
    .then((res)=>{
        console.log("팔로우성공!")
    }).catch((err)=>{
        console.log("팔로우실패!")
    })



}
 const unfollow=(friendname)=>{
    const instanceaxios=CreateAxios();
    console.log("언팔로우!")

    instanceaxios.delete(`/followdelete/${friendname}`)
    .then((res)=>{
        console.log("팔로우삭제성공!")
    }).catch((err)=>{
        console.log("팔로우삭제실패!")
    })
}


export  {following,unfollow}
