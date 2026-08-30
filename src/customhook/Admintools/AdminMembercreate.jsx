import React from "react";
import Weatherregion from "../../UI/weatherregion";
import { useEffect, useState } from "react";
import CreateAxios from "../CreateAxios";
import * as Validation from "./UserValidation"
import { Button } from "../../admin/AdminUI";
import { useToast } from "../../UI/Feedback/FeedbackProvider";
import { Modalout, Modalin, Head, Headtitle, Headsub, Closebutton, Body, Foot,
         Section, Legend, Tag, Grid, Field, Fieldname, Control, Hint,
         Radiorow, Radiochip, Inputwithbutton } from "../../admin/AdminModal";

//=====================================================================
// 회원 추가(관리자).
//
// 회원 수정 모달과 같은 코드에서 갈라져 나온 쌍둥이인데, 수정 쪽만 손봐서
// 나란히 열면 모양이 달라져 있었다. 껍데기·폼 조각은 이제 AdminModal 을
// 같이 쓰므로 두 화면이 자동으로 같은 모양을 유지한다.
//
// 예전엔 검증 결과를 입력칸 옆에 "true"/"false" 라는 글자로 그대로 찍었다.
// 무엇이 잘못됐는지는 안 알려주면서 화면만 지저분했다.
//=====================================================================

const PROVIDERS=[
    {value:"mypage", label:"마이페이지"},
    {value:"Naver",  label:"네이버"},
    {value:"Google", label:"구글"},
]
const ROLES=[
    {value:"ROLE_User",  label:"일반"},
    {value:"ROLE_Admin", label:"운영자"},
]

export default function AdminMembercreate(props){

    const axiosinstance= CreateAxios();
    const toast=useToast();
    const [createform,setCreateform]=useState({
        username: '',
        password: '',
        confirmpassword: '',
        nickname: '',
        region:'',
        gridx:'' ,
        gridy:'',

        provider:'',
        userrole:''
    });

    const [valid,setValid]=useState({
        username:false,
        password:false,
        passwordconfirm:false,
        nickname:false
    })

    const ongetdata=(newdata)=>{
        setCreateform({...createform,region:newdata.region
            ,gridx:newdata.gridx,gridy:newdata.gridy})
    }

    //발리데이션
    useEffect(()=>{
        setValid((v)=>({...v,username:Validation.Emailcheck(createform.username)}))
    },[createform.username])
    useEffect(()=>{
        setValid((v)=>({...v,nickname:Validation.nicknamevalid(createform.nickname)}))
    },[createform.nickname])
    useEffect(()=>{
        setValid((v)=>({...v,password:Validation.passwordcheck(createform.password)}))
    },[createform.password])
    useEffect(()=>{
        setValid((v)=>({...v,
            passwordconfirm:Validation.confirmpasswordcheck(createform.password,createform.confirmpassword)}))
    },[createform.password,createform.confirmpassword])

    const close=()=>props.setIscreate(false);

    //ESC 로 닫기
    useEffect(()=>{
        const onkey=(e)=>{ if(e.key==="Escape") close() }
        document.addEventListener("keydown",onkey)
        return ()=>document.removeEventListener("keydown",onkey)
    },[])

    const allvalid=valid.username&&valid.nickname&&valid.password&&valid.passwordconfirm;

    //어드민권한으로 유저만들기
    const Oncreateuser=()=>{
        if(!allvalid){
            toast.error("입력값을 다시 확인해 주세요.")
            return;
        }
        axiosinstance.post('/admin/membercreate',{
            username:createform.username,
            password:createform.password,
            provider:createform.provider,
            role:createform.userrole,

            nickname:createform.nickname,
            region:createform.region,
            gridx:createform.gridx,
            gridy:createform.gridy
        }).then((res)=>{
            toast.success(res.data||"회원을 추가했습니다.")
            close();
        }).catch((err)=>{
            toast.error(err)
        })
    }

    //값을 아직 안 쳤으면 조용히 두고, 치기 시작한 뒤에만 안내한다
    const hint=(value,ok,message)=>
        !value ? null
        : <Hint $bad={!ok}>{ok?"사용할 수 있습니다":message}</Hint>;

    return(
    <Modalout onMouseDown={close}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>회원 추가</Headtitle>
                <Headsub>관리자 권한으로 계정을 만듭니다</Headsub>
                <Closebutton type="button" onClick={close} title="닫기(Esc)">×</Closebutton>
            </Head>

            <Body>
                <Section>
                    <Legend>기본정보 <Tag>필수</Tag></Legend>

                    <Field>
                        <Fieldname>이메일</Fieldname>
                        <Control $invalid={!!createform.username&&!valid.username}>
                            <input type="text" value={createform.username} placeholder="이메일"
                                onChange={(e)=>{setCreateform({...createform,username:e.target.value})}}/>
                        </Control>
                        {hint(createform.username,valid.username,"이메일 형식이 아닙니다")}
                    </Field>

                    <Field>
                        <Fieldname>닉네임</Fieldname>
                        <Control $invalid={!!createform.nickname&&!valid.nickname}>
                            <input type="text" value={createform.nickname} placeholder="닉네임"
                                onChange={(e)=>{setCreateform({...createform,nickname:e.target.value})}}/>
                        </Control>
                        {hint(createform.nickname,valid.nickname,"닉네임 규칙에 맞지 않습니다")}
                    </Field>

                    <Field>
                        <Fieldname>비밀번호</Fieldname>
                        <Control $invalid={!!createform.password&&!valid.password}>
                            <input type="password" value={createform.password} placeholder="비밀번호"
                                onChange={(e)=>{setCreateform({...createform,password:e.target.value})}}/>
                        </Control>
                        {hint(createform.password,valid.password,"비밀번호 규칙에 맞지 않습니다")}
                    </Field>

                    <Field>
                        <Fieldname>비밀번호 확인</Fieldname>
                        <Control $invalid={!!createform.confirmpassword&&!valid.passwordconfirm}>
                            <input type="password" value={createform.confirmpassword} placeholder="비밀번호 확인"
                                onChange={(e)=>{setCreateform({...createform,confirmpassword:e.target.value})}}/>
                        </Control>
                        {hint(createform.confirmpassword,valid.passwordconfirm,"비밀번호가 서로 다릅니다")}
                    </Field>
                </Section>

                <Section>
                    <Legend>유저권한정보 <Tag>필수</Tag></Legend>

                    <Field as="div">
                        <Fieldname>가입사이트</Fieldname>
                        <Radiorow>
                            {PROVIDERS.map((item)=>(
                                <Radiochip key={item.value} $on={createform.provider===item.value}>
                                    <input type="radio" name="provider" value={item.value}
                                        checked={createform.provider===item.value}
                                        onChange={(e)=>{setCreateform({...createform,provider:e.target.value})}}/>
                                    {item.label}
                                </Radiochip>
                            ))}
                        </Radiorow>
                    </Field>

                    <Field as="div">
                        <Fieldname>회원권한</Fieldname>
                        <Radiorow>
                            {ROLES.map((item)=>(
                                <Radiochip key={item.value} $on={createform.userrole===item.value}>
                                    <input type="radio" name="role" value={item.value}
                                        checked={createform.userrole===item.value}
                                        onChange={(e)=>{setCreateform({...createform,userrole:e.target.value})}}/>
                                    {item.label}
                                </Radiochip>
                            ))}
                        </Radiorow>
                    </Field>
                </Section>

                <Section>
                    <Legend>회원주소 <Tag $optional>선택</Tag></Legend>

                    <Field as="div">
                        <Fieldname>지역</Fieldname>
                        <Inputwithbutton>
                            <Control style={{flex:1}}>
                                <input type="text" value={createform.region} readOnly
                                    placeholder="지역을 선택해 주세요"/>
                            </Control>
                            <Weatherregion title="지역찾기" onGetdata={ongetdata}/>
                        </Inputwithbutton>
                    </Field>
                </Section>
            </Body>

            <Foot>
                <Button type="button" onClick={close}>취소</Button>
                <Button type="button" $variant="primary"
                    disabled={!allvalid}
                    onClick={Oncreateuser}>회원 추가</Button>
            </Foot>

        </Modalin>
    </Modalout>
    )
}
