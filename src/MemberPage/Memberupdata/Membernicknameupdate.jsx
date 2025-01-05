import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Button from "../../UI/Button";
import axios from "axios";

import styled from "styled-components";
import ImageCropper from "./ImageCrop";
import ReactCrpooer from "./ReactCropper";
import CreateAxios from "../../customhook/CreateAxios";
import Weatherregion from "../../UI/weatherregion";
import { useNavigate } from "react-router-dom";
const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;
top: 8%;

`

const Preview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
function Membernicknameupdate(){
const [loginuser,Setloginuser,removeloginuser]=useCookies();
const [newprofilesrc,setNewprofilesrc]=useState();
const [newprofile,setNewprofile]=useState();
const [updateform,Setupdateform]=useState({
    email:loginuser.userinfo["username"],
    name:loginuser.userinfo["nickname"],
    
    red:'',
    profileimage:loginuser.userinfo["profileimg"],
    region:loginuser.userinfo.region.replaceAll("+"," "),
    gridx:loginuser.userinfo.gridx,
    gridy:loginuser.userinfo.gridy  

});

const navigate=useNavigate();
const axiosinstance=CreateAxios();

const [updatevalid,Setupdatevalid]=useState({
  namevalid:false,
  passwordvalid:false
})



useEffect(()=>{
  Passvalid()
},[updateform.password])

useEffect(()=>{
  namevalid();
},[updateform.name])


const Passvalid=()=>{
  const passwordRegex = /^[A-Za-z0-9]{8,16}$/

  if(passwordRegex.test(updateform.password)){
    Setupdatevalid({...updatevalid,passwordvalid:true})
  }
  else{
    Setupdatevalid({...updatevalid,passwordvalid:false})
  }
  
  
}
const namevalid=()=>{
  const nameRegex= /^[A-Za-z0-9가-하]{1,10}$/
  
  if(nameRegex.test(updateform.name)){
    Setupdatevalid({...updatevalid,namevalid:true})
  }
  else{
    Setupdatevalid({...updatevalid,namevalid:false})
  }
}

const userupdate=(e)=>{
   
  e.preventDefault();
  const formData=new FormData();
  const data={
    "email":updateform.email,
    "name":updateform.name,
    "profileimage":updateform.profileimage,
    "region":updateform.region,
    "gridx":updateform.gridx,
    "gridy":updateform.gridy
  }
  
  if(newprofilesrc){
  const newpro=profilesave(newprofilesrc)
  formData.append("newprofile",newpro);//form데이터는 키-밸류구조
  }
  formData.append("dto",
    new Blob([JSON.stringify(data)]
  ,  {type:"application/json"}
  ))
  //formData.append("newprofile",newprofilesrc)
  axiosinstance.put(`/memberupdate/${updateform.email}`,    
    formData 
             
  ).then((res)=>{
    
    alert("회원정보가수정되었습니다")
    navigate("/main")
  })
  
}
//크롭한이미지변환
const profilesave=(newsrc)=>{
  let blobBin=atob(newsrc.split(`,`)[1]); //base64데이터디코딩
  var array=[];
  for(var i=0;i<blobBin.length;i++){
      array.push(blobBin.charCodeAt(i));
  }
  let profile=new Blob([new Uint8Array(array)],{type:`image/png`});
  return profile
}
const profiledatapopup=(e)=>{
  e.preventDefault()
  //noopener 이기능설정시 원래부모창접근못함
  //noreferrer 리퍼헤더생략하고 nopener이설정된거처럼함
  //opener 은 자식창에서 부목창을접근함
  //const pop=
  window.open(`/userprofile`,`프로필이미지업로드`, 
    `width=600px,height=600ox,
    left=700px,
    top=200px,
    
   
    `

   )
   //콜백함수 윈도우에 넣어주기
   window.parentCallback=(src)=>{
    
    console.log("콜백실행")
   // setNewprofilesrc(localStorage.getItem("newprofileimage"))
  setNewprofilesrc(src) 

  }

}
//지역데이터가져오기
const onGetdata=(newdata)=>{
  
  console.log(newdata)
  Setupdateform({...updateform,region:newdata.region
    ,gridx:newdata.gridx,gridy:newdata.gridy})
}

const deleteproimg=(e)=>{
  e.preventDefault()
  console.log("딜리트")
  if(newprofilesrc){
    setNewprofilesrc(null);
  }
  else if(updateform.profileimage){
    Setupdateform(...updateform,{profileimage:null})
  }
}

  return (
    <Wrapper>
      비밀번호변경

  프로필사진: <Preview>
    {newprofilesrc?
   <>
   
      <img src={newprofilesrc} style={{objectFit:"fill",width:"100%",height:"100%"}}/>
   </>
   :<>
   {updateform.profileimage?<><img   src={process.env.PUBLIC_URL+"/userprofileimg"+updateform.profileimage}
   style={{objectFit:"fill",width:"100%",height:"100%"}}
   />
   
   </>:<>기존도없음</>}
   </>
  }
    </Preview><br/>
  <button onClick={(e)=>profiledatapopup(e)}>프로필수정</button><br/>
  <button onClick={(e)=>deleteproimg(e)}>삭제</button><br/>
  이메일:{updateform.email}<br/>
  닉네임수정:<input type="text" value={updateform.name}onChange={(e)=>{Setupdateform({...updateform,name:e.target.value})}} /> 
  {updatevalid.namevalid?"사용가능":"닉네임은특수문자를제외한한영숫자10글자까지만가능합니다"}<br/>
  <tr><td>지역변경:<input type="text" value={updateform.region} readOnly /> 
  <Weatherregion title="지역찾기" onGetdata={onGetdata}/></td></tr>
    
   
    <Button title="회원정보수정" onClick={userupdate}/>

{loginuser.userinfo["profileimg"]}
  <br/>

    </Wrapper>
  )
}
export default Membernicknameupdate;