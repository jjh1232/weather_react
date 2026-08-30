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
import profileimage from "../../UI/profileimage";
// 위치/폭은 MainLayout 의 grid 가 정한다.
// (예전엔 left:28.5% / width:43% / top:8% 로 직접 좌표를 잡고 있었다)
const Wrapper=styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
`
const Section=styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 20px;
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radius};
  background: ${(props)=>props.theme.surface};
`
const Sectiontitle=styled.div`
  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${(props)=>props.theme.textFaint};
`
const Profilerow=styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`
// 실제 아바타와 같은 원형으로 보여준다
const Preview=styled.div`
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 50%;
  border: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surfaceAlt};

  img { width: 100%; height: 100%; object-fit: cover; }
`
const Emptyavatar=styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  font-size: 10px;
  font-weight: 650;
  color: ${(props)=>props.theme.textFaint};
`
const Buttonrow=styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`
const Smallbutton=styled.button`
  height: 42px;
  padding: 0 20px;
  border-radius: ${(props)=>props.theme.radiusPill};
  border: 1px solid ${(props)=>props.theme.border};
  background: ${(props)=>props.theme.surface};
  color: ${(props)=>props.theme.textMuted};
  font-size: 13.5px;
  font-weight: 650;
  cursor: pointer;
  transition: border-color ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover {
    border-color: ${(props)=>props.theme.accent};
    color: ${(props)=>props.theme.accent};
  }
`
const Field=styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const Fieldlabel=styled.label`
  font-size: 13px;
  font-weight: 650;
  color: ${(props)=>props.theme.textMuted};
`
const Inputrow=styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  /* 지역찾기 버튼(Weatherregion)이 입력칸과 같은 높이가 되게.
     그냥 button 으로 잡으면 그 안에서 같이 렌더되는 지역검색 모달의
     버튼들까지 덮어쓰므로 직계 자식으로 좁힌다. */
  > button {
    flex-shrink: 0;
    height: ${(props)=>props.theme.fieldHeight};
    padding: 0 20px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.textMuted};
    font-size: 14px;
    font-weight: 650;
    cursor: pointer;
    transition: border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover {
      border-color: ${(props)=>props.theme.accent};
      color: ${(props)=>props.theme.accent};
    }
  }
`
const Input=styled.input`
  /* flex:1 은 flex-basis:0% 을 같이 켠다.
     지역 칸처럼 가로(Inputrow) 안에 있을 땐 문제가 없지만,
     이메일·닉네임처럼 세로(Field) 안에 바로 놓이면 주축이 세로라
     height 가 무시되고 칸이 글자 높이까지 찌부러진다.
     basis 를 auto 로 두면 두 경우 다 제대로 동작한다. */
  flex: 1 1 auto;
  min-width: 0;
  height: ${(props)=>props.theme.fieldHeight};
  padding: 0 ${(props)=>props.theme.fieldPadX};
  border: 1px solid ${(props)=>props.theme.border};
  border-radius: ${(props)=>props.theme.radius};
  background: ${(props)=>props.theme.surfaceAlt};
  color: ${(props)=>props.theme.text};
  font-size: ${(props)=>props.theme.fieldFont};
  outline: none;
  transition: border-color ${(props)=>props.theme.transition},
              box-shadow ${(props)=>props.theme.transition};

  &:focus {
    border-color: ${(props)=>props.theme.accent};
    box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    background: ${(props)=>props.theme.surface};
  }
  &:read-only {
    color: ${(props)=>props.theme.textMuted};
    cursor: default;
  }
`
// 유효성 안내. 통과/실패에 따라 색이 바뀐다.
const Validtext=styled.div`
  font-size: 11.5px;
  font-weight: 600;
  color: ${(props)=>props.$ok?"#2f9e5f":props.theme.warning};
`
const Savebutton=styled.button`
  height: ${(props)=>props.theme.fieldHeight};
  border: none;
  border-radius: ${(props)=>props.theme.radiusPill};
  background: ${(props)=>props.theme.accent};
  color: #fff;
  font-size: ${(props)=>props.theme.fieldFont};
  font-weight: 700;
  cursor: pointer;
  transition: background ${(props)=>props.theme.transition};

  &:hover { background: ${(props)=>props.theme.accentHover}; }
  &:disabled {
    background: ${(props)=>props.theme.borderStrong};
    cursor: not-allowed;
  }
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
  //window.open 의 크기 지정은 단위 없는 숫자만 받는다.
  //예전 값 "width=600px,height=600ox" 는 둘 다 무효라 기본 크기로 열렸다.
  window.open(`/userprofile`,`프로필이미지업로드`,
    `width=440,height=820,left=700,top=120`
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
  //"기본 이미지로" 는 말 그대로 한 번에 기본이 되어야 한다.
  //예전에는 새로 고른 사진이 있으면 그것만 취소하고 기존 사진으로 돌아가서,
  //기본까지 가려면 두 번 눌러야 했다.
  //저장하기 전까지는 아무것도 확정되지 않으니 바로 기본으로 돌려도 된다.
  setNewprofilesrc(null);
  //Setupdateform(...updateform,{profileimage:null}) 은 스프레드를
  //"인자"로 흘려보내서 폼 전체가 날아간다. 객체 하나로 넘겨야 한다.
  Setupdateform({...updateform,profileimage:null})
}

  //보여줄 프로필: 새로 고른 것 > 기존 것 > 기본 이미지
  //예전에는 마지막이 null 이라 빈 원만 떠서, 저장하면 뭐가 나올지 알 수 없었다.
  //값이 없으면 profileimage 가 기본 이미지를 돌려준다
  const previewsrc = newprofilesrc || profileimage(updateform.profileimage);

  return (
    <Wrapper>
      {/* 화면 이름은 상단 바(Header)가 그린다 */}

      <Section>
        <Sectiontitle>프로필 사진</Sectiontitle>
        <Profilerow>
          <Preview>
            {previewsrc
              ? <img src={previewsrc} alt="프로필"/>
              : <Emptyavatar>사진 없음</Emptyavatar>}
          </Preview>

          <Buttonrow>
            <Smallbutton type="button" onClick={(e)=>profiledatapopup(e)}>
              사진 변경
            </Smallbutton>
            <Smallbutton type="button" onClick={(e)=>deleteproimg(e)}>
              기본 이미지로
            </Smallbutton>
          </Buttonrow>
        </Profilerow>
      </Section>

      <Section>
        <Sectiontitle>기본 정보</Sectiontitle>

        <Field>
          <Fieldlabel>이메일</Fieldlabel>
          {/* 이메일은 계정 식별자라 수정 대상이 아니다 */}
          <Input type="text" value={updateform.email} readOnly/>
        </Field>

        <Field>
          <Fieldlabel htmlFor="nickname">닉네임</Fieldlabel>
          <Input
            id="nickname"
            type="text"
            value={updateform.name}
            onChange={(e)=>{Setupdateform({...updateform,name:e.target.value})}}
          />
          <Validtext $ok={updatevalid.namevalid}>
            {updatevalid.namevalid
              ? "사용 가능한 닉네임입니다"
              : "특수문자를 제외한 한글·영문·숫자 10자까지 가능합니다"}
          </Validtext>
        </Field>

        <Field>
          <Fieldlabel>지역</Fieldlabel>
          <Inputrow>
            <Input type="text" value={updateform.region} readOnly/>
            <Weatherregion title="지역찾기" onGetdata={onGetdata}/>
          </Inputrow>
        </Field>
      </Section>

      <Savebutton onClick={userupdate} disabled={!updatevalid.namevalid}>
        저장하기
      </Savebutton>
    </Wrapper>
  )
}
export default Membernicknameupdate;
