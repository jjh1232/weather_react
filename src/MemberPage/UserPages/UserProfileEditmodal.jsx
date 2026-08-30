import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { createPortal } from "react-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark as exiticon } from "@fortawesome/free-solid-svg-icons";
import { faCameraRetro as photoicon } from "@fortawesome/free-solid-svg-icons";
import ImageEditor from "./ImageEditor";
import FileResizer from "react-image-file-resizer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import CreateAxios from "../../customhook/CreateAxios";
import profileimage from "../../UI/profileimage";
import { API_BASE } from "../../config/api";

/* ─────────────────────────────────────────────────────────────
   프로필 편집 모달.
   예전엔 오버레이가 초록(rgba(58,184,64,.5)), 시트가 흰색 고정이라
   다크모드에서 눈이 아팠고, Label 이 position:absolute 라 입력값 위에 겹쳤다.
   크기도 30%/60% 라 화면 크기에 따라 배너(550px)가 삐져나왔다.
   ───────────────────────────────────────────────────────────── */

const Outdiv=styled.div`
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
`
const Indiv=styled.div`
    width: min(94vw, 560px);
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    background-color: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    overflow: hidden;
`
const Headerdiv=styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
    padding: 12px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Exitdiv=styled.div`
  display: flex;
  align-items: center;
`
const ExitButton=styled.button`
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: ${(props)=>props.theme.textMuted};
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: background ${(props)=>props.theme.transition},
              color ${(props)=>props.theme.transition};

  &:hover{
    background-color: ${(props)=>props.theme.surfaceHover};
    color: ${(props)=>props.theme.text};
  }
`
const Exiticon=styled(FontAwesomeIcon)`
  font-size: 18px;
`
const Textdiv=styled.div`
 color: ${(props)=>props.theme.text};
 display: flex;
 align-items: center;
 font-size: 17px;
 font-weight: 750;
 letter-spacing: -0.03em;
`
const Buttondiv=styled.div`
margin-left:auto;
display  : flex;
align-items: center;
`
const SaveButtoncss=styled.button`
    border: none;
    background-color: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: 13.5px;
    font-weight: 650;
    letter-spacing: -0.01em;
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 8px 20px;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                opacity ${(props)=>props.theme.transition};

    &:hover:not(:disabled){ background-color: ${(props)=>props.theme.accentHover}; }
    &:disabled{ opacity:.45; cursor: not-allowed; }
`
const Bodydiv=styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
`
/* 배너 - 시트 폭을 꽉 채운다(예전엔 550px 고정이라 삐져나갔다) */
const Backgrounddiv=styled.div`
    position: relative;
    height: 160px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${(props)=>props.theme.surfaceAlt};
    background-image: ${(props)=>props.src?`url(${props.src})`:"none"};
    background-size: cover;
    background-position: center;

    /* 사진 위에서도 카메라 버튼이 보이도록 살짝 어둡게 */
    &::after{
        content: "";
        position: absolute;
        inset: 0;
        background: ${(props)=>props.src?"rgba(0,0,0,0.25)":"transparent"};
        pointer-events: none;
    }
`
const PhotoButton=styled.button`
      position: relative;
      z-index: 1;
      width: 42px;
      height: 42px;
      background-color: rgba(20, 20, 20, 0.55);
      border: none;
      border-radius:50%;
      display: grid;
      place-items: center;
      cursor: pointer;
      transition: background ${(props)=>props.theme.transition},
                  transform ${(props)=>props.theme.transition};

      &:hover{
        background-color: rgba(20, 20, 20, 0.75);
        transform: scale(1.06);
      }
`
const Photoicon=styled(FontAwesomeIcon)`
  font-size: 16px;
  color: white;
`
/* 아바타 - 배너 왼쪽 아래에 걸친다 */
const Profilediv=styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
    width: 92px;
    height: 92px;
    top: 116px;
    left: 20px;

    border: 4px solid ${(props)=>props.theme.surface};
    border-radius: 50%;
    overflow: hidden;

    background-color: ${(props)=>props.theme.surfaceAlt};
    background-image: ${(props)=>props.src?`url(${props.src})`:"none"};
    background-size: cover;
    background-position: center;
    box-shadow: ${(props)=>props.theme.shadow};

    /* 사진이 있을 때 카메라가 묻히지 않게 */
    &::after{
        content: "";
        position: absolute;
        inset: 0;
        background: ${(props)=>props.src?"rgba(0,0,0,0.3)":"transparent"};
        pointer-events: none;
    }

    ${PhotoButton}{
        width: 36px;
        height: 36px;
    }
`

const Userdatadiv=styled.div`
    display: flex;
    flex-direction: column;
    gap: 18px;
    /* 아바타가 배너 아래로 나온 만큼(92-44=48px) 비켜준다 */
    padding: 56px 20px 22px;
`
/* 라벨 - 예전엔 position:absolute 라 입력값 위에 겹쳐 찍혔다 */
const Field=styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`
const Label=styled.label`
    font-size: 12.5px;
    font-weight: 650;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.textMuted};
`
const inputstyle=`
    width: 100%;
    padding: 10px 12px;
    border-radius: 10px;
    font-size: 14px;
    line-height: 1.5;
    outline: none;
`
const Nickname=styled.input`
    ${inputstyle}
    height: 42px;
    color: ${(props)=>props.theme.text};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    &::placeholder{ color: ${(props)=>props.theme.textFaint}; }
    &:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
const Introinput=styled.textarea`
    ${inputstyle}
    min-height: 108px;
    resize: vertical;
    color: ${(props)=>props.theme.text};
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    &::placeholder{ color: ${(props)=>props.theme.textFaint}; }
    &:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
//글자수 - 서버 제한(200자)과 같은 값
const Counter=styled.div`
    align-self: flex-end;
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    color: ${(props)=>props.$over?props.theme.warning:props.theme.textFaint};
`

export default function UserProfileEditmodal(props) {
    console.log("에딧모달실행")
    const Backgroundref=useRef(null) ;
    const Profileref=useRef(null);  
  
    //편집기에 넘길 원본 파일(있으면 편집기가 열린다)
    const [Profile,setProfile]=useState();
    const [Backgroundfile,setBackgroundfile]=useState();
    //Apply 로 잘라낸 결과. blob 은 서버로, preview 는 화면 표시용.
    const [Backgroundsrc,setBackgroundsrc]=useState(null);
    const [Profilesrc,setProfilesrc]=useState(null);
    const [Backgroundblob,setBackgroundblob]=useState(null);
    const [Profileblob,setProfileblob]=useState(null);

    //현재 값으로 입력칸을 채운다(props.userinfo 로 받는다)
    const userinfo=props.userinfo||{};
    const [nickname,setNickname]=useState(userinfo.nickname||"");
    const [myintro,setMyintro]=useState(userinfo.myintro||"");

    //서버의 @Size(min=3,max=10) + @Pattern(한글/영문) 과 같은 조건
    const nicknameok=/^[a-zA-Z가-힣]{3,10}$/.test((nickname||"").trim());
    const introok=(myintro||"").length<=200;

    const axiosinstance=CreateAxios();
    const queryclient=useQueryClient();
    const [cookies]=useCookies(["userinfo"]);
    const inputRef=useRef(null)


    const HandleBackClick=()=>{
      Backgroundref.current.click();
    }
    const HandleProfileclick=()=>{
      Profileref.current.click()
    }
    const resizefile= (file) =>
  new Promise((resolve) => {
    FileResizer.imageFileResizer(
      file,          // 리사이징할 원본 파일(Blob)
      550,           // 최대 너비
      550,           // 최대 높이
      "JPEG",        // 이미지 포맷
      100,           // 품질 (0 ~ 100)
      0,             // 회전 (0~360)
      (uri) => {
        resolve(uri); // 리사이즈된 결과(base64) 반환
      },
      "file"       // 출력 타입(base64, blob, file 중 선택)
    );
  });
    const handleBackground=async (e)=>{
      const file=e.target.files[0];
      if(file){
        //Promise써야함
        const resizeimage=await resizefile(file);
        setBackgroundfile(resizeimage)
      }
      //같은파일시에도 값을 초기화해줘야함
      //e.target.value = '';
        // input ref로 직접 초기화 ,리액트문제라는데 ref로직접초기화
  if (Backgroundref.current) {
    Backgroundref.current.value = null;
  }
    }
        const handleProfile=(e)=>{
      const file=e.target.files[0];
      if(file){
        setProfile(file)
      }
    }
    //Apply 결과 반영.
    //예전엔 결과를 다시 Backgroundfile 에 넣어서, 편집기가 닫히지 않고
    //잘라낸 이미지를 원본 삼아 다시 열리는 상태였다.
    const handleBackchange=({blob,preview})=>{
      setBackgroundblob(blob)
      setBackgroundsrc(preview)
      setBackgroundfile(null)   //편집기 닫기
    }
    const handleProfilechange=({blob,preview})=>{
      setProfileblob(blob)
      setProfilesrc(preview)
      setProfile(null)
    }

    //────── 저장 ──────────────────────────────────────────
    const savemutation=useMutation({
      mutationFn:()=>{
        const form=new FormData();
        //dto 는 JSON 파트로 보낸다(서버가 @RequestPart 로 받는다)
        form.append("dto",new Blob([JSON.stringify({
          name:nickname,
          myintro:myintro,
          //교체 전 경로. 서버가 새 파일을 저장한 뒤 이걸 지운다.
          profileimage:userinfo.profileimg||null,
          profilebackground:userinfo.profilebackground||null
        })],{type:"application/json"}));

        //안 바꿨으면 아예 안 보낸다 -> 서버가 기존 이미지를 유지
        if(Profileblob){
          form.append("newprofile",Profileblob,"profile.png");
        }
        if(Backgroundblob){
          form.append("newbackground",Backgroundblob,"background.png");
        }
        return axiosinstance.put("/profileupdate",form);
      },
      onSuccess:()=>{
        //유저페이지 프로필을 다시 받아온다
        queryclient.invalidateQueries({queryKey:["userpageprofile"]});
        alert("프로필을 수정했습니다");
        props.setisedit(false);
      },
      onError:(err)=>{
        const message=err?.response?.data?.message;
        alert(message||"수정하지 못했습니다. 잠시후 다시 시도해주세요");
      }
    })
    
    //힐막기 
    const handleWheel=(e)=>e.preventDefault(); 
    const outdivRef=useRef(null)
    useEffect(()=>{
    const node = outdivRef.current;
    if (node) {
      node.addEventListener('wheel', handleWheel, { passive: false });//passive설정을 직접하는게중요
      //passive는 기본동작을 true일시 호출하지 않을거라고 미리말해 렌더링최적화시키기떄뭉네 false로 설저앻줘야함
    }
      //종료후 다시실행
    return () => {
      if (node) {
        node.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

    //내부 에 모두포함되서 클릭과 현재 디브가같을시만종료
  return (
    <Outdiv onClick={(e)=>
    {if(e.target===e.currentTarget){
    props.setisedit(false);
    }
    }} 
    ref={outdivRef}
    >
      <Indiv>
        <Headerdiv>
            <Exitdiv>
              <ExitButton onClick={()=>props.setisedit(false)}>
                <Exiticon icon={exiticon}/>
              </ExitButton>
            </Exitdiv>
            <Textdiv>
              Edit Profile
            </Textdiv>
            <Buttondiv>
              <SaveButtoncss
                disabled={savemutation.isPending||!nicknameok||!introok}
                title={nicknameok?"":"닉네임은 한글 또는 영문 3~10자"}
                onClick={()=>savemutation.mutate()}>
                {savemutation.isPending?"저장중...":"Save"}
              </SaveButtoncss>
            </Buttondiv>
        </Headerdiv>
        <Bodydiv>
            <Backgrounddiv src={Backgroundsrc||(userinfo.profilebackground?API_BASE+"/userbackgroundimg"+userinfo.profilebackground:null)}>
              <PhotoButton onClick={HandleBackClick}>
                    <Photoicon icon={photoicon}/>
              </PhotoButton>
              <input type="file" ref={Backgroundref} style={{display:"none"}} 
              accept="image/*" onChange={handleBackground}/>
              {Backgroundfile&&<ImageEditor file={Backgroundfile} onupdate={handleBackchange} mode="Background" setback={setBackgroundfile}/>}
            </Backgrounddiv>
            <Profilediv src={Profilesrc||profileimage(userinfo.profileimg)}>
                 <PhotoButton onClick={HandleProfileclick}>
                    <Photoicon icon={photoicon}/>
                </PhotoButton>
                <input type="file" ref={Profileref} style={{display:"none"}} 
              accept="image/*" onChange={handleProfile}/>
              {Profile&&<ImageEditor file={Profile} onupdate={handleProfilechange} mode="Profile" setback={setProfile}/>}
            </Profilediv>
            <Userdatadiv>
              <Field>
                <Label htmlFor="nickinput">닉네임</Label>
                <Nickname id="nickinput" type="text" maxLength={10}
                  placeholder="3~10자, 한글 또는 영문"
                  value={nickname} onChange={(e)=>setNickname(e.target.value)} />
                {!nicknameok&&(nickname||"").length>0&&
                  <Counter $over>한글 또는 영문 3~10자로 입력해주세요</Counter>}
              </Field>

              <Field>
                <Label htmlFor="Introinput">소개</Label>
                <Introinput id="Introinput" maxLength={200}
                  placeholder="나를 한 줄로 소개해보세요"
                  value={myintro} onChange={(e)=>setMyintro(e.target.value)} />
                <Counter $over={(myintro||"").length>200}>
                  {(myintro||"").length} / 200
                </Counter>
              </Field>
            </Userdatadiv>
        </Bodydiv>

      </Indiv>
    </Outdiv>
    
  );
}