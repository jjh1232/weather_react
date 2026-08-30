import React from "react";

import Weatherregion from "../../UI/weatherregion";
import { useEffect, useState } from "react";
import CreateAxios from "../CreateAxios";
import { Button } from "../../admin/AdminUI";
import { useToast } from "../../UI/Feedback/FeedbackProvider";
import { Modalout, Modalin, Head, Headtitle, Headsub, Closebutton, Body, Foot,
         Section, Legend, Tag, Grid, Field, Fieldname, Control,
         Radiorow, Radiochip, Inputwithbutton } from "../../admin/AdminModal";

//=====================================================================
// 회원 정보 수정 모달.
//
// 예전에는 모든 요소가 position:relative/absolute + % 오프셋(bottom:26%,
// left:23% ...)으로 서로를 밀어내고 있었다. 부모 높이가 조금만 달라져도
// 값이 전부 어긋나서 제목이 입력칸 위에 겹쳐 찍히고 "*필수입력" 이 엉뚱한
// 자리에 떠 있었다. 좌표를 전부 걷어내고 위에서 아래로 흐르는 flex 로 바꿨다.
//
// 화면 톤은 어드민 화면(AdminUI)과 맞춘다.
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

export default function AdminUpdateform(props){
    const {currentdata,setIsupdate}=props
    const axiosinstance= CreateAxios();
    const toast=useToast();

    const [updateform,setUpdateform]=useState({
        username: currentdata.username,
        nickname: currentdata.nickname,

        region: currentdata.homeaddress?.juso,
        gridx: currentdata.homeaddress?.gridx,
        gridy: currentdata.homeaddress?.gridy,

        provider: currentdata.provider,
        /* MemberDto 의 필드 이름은 role 이다(userrole 이 아니다).
           예전엔 currentdata.userrole 로 읽어서 항상 undefined 로 시작했고,
           관리자가 라디오를 건드리지 않고 저장하면 권한이 빈 값으로 넘어갔다. */
        userrole: currentdata.role,
    });

    const ongetdata=(newdata)=>{
        setUpdateform({...updateform,region:newdata.region
            ,gridx:newdata.gridx,gridy:newdata.gridy})
    }

    const close=()=>setIsupdate(false);

    //ESC 로 닫기 - 모달이면 당연히 되어야 한다
    useEffect(()=>{
        const onkey=(e)=>{ if(e.key==="Escape") close() }
        document.addEventListener("keydown",onkey)
        return ()=>document.removeEventListener("keydown",onkey)
    },[])

    //어드민권한으로 유저정보수정
    const Onupdateuser=(e)=>{
        e.preventDefault()
        axiosinstance.put(`/admin/memberupdate/${currentdata.id}`,{
            username:updateform.username,

            provider:updateform.provider,
            role:updateform.userrole,

            nickname:updateform.nickname,
            region:updateform.region,
            gridx:updateform.gridx,
            gridy:updateform.gridy

        }).then((res)=>{
            toast.success("회원 정보를 수정했습니다.")
            setIsupdate(false)
        }).catch((err)=>{
            toast.error(err)
        })
    }

    return(
    //바깥을 눌러도 닫히게. 안쪽 클릭은 위로 안 올라가게 막는다.
    <Modalout onMouseDown={close}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>회원 정보 수정</Headtitle>
                <Headsub>#{currentdata.id}</Headsub>
                <Closebutton type="button" onClick={close} title="닫기(Esc)">×</Closebutton>
            </Head>

            <Body>
                <Section>
                    <Legend>기본정보 <Tag>필수</Tag></Legend>

                    <Field>
                        <Fieldname>이메일</Fieldname>
                        <Control>
                            <input type="text" value={updateform.username||""} placeholder="이메일"
                                onChange={(e)=>{setUpdateform({...updateform,username:e.target.value})}}/>
                        </Control>
                    </Field>

                    <Field>
                        <Fieldname>닉네임</Fieldname>
                        <Control>
                            <input type="text" value={updateform.nickname||""} placeholder="닉네임"
                                onChange={(e)=>{setUpdateform({...updateform,nickname:e.target.value})}}/>
                        </Control>
                    </Field>
                </Section>

                <Section>
                    <Legend>유저권한정보 <Tag>필수</Tag></Legend>

                    <Field as="div">
                        <Fieldname>가입사이트</Fieldname>
                        <Radiorow>
                            {PROVIDERS.map((item)=>(
                                <Radiochip key={item.value} $on={updateform.provider===item.value}>
                                    <input type="radio" name="provider" value={item.value}
                                        checked={updateform.provider===item.value}
                                        onChange={(e)=>{setUpdateform({...updateform,provider:e.target.value})}}/>
                                    {item.label}
                                </Radiochip>
                            ))}
                        </Radiorow>
                    </Field>

                    <Field as="div">
                        <Fieldname>회원권한</Fieldname>
                        <Radiorow>
                            {ROLES.map((item)=>(
                                <Radiochip key={item.value} $on={updateform.userrole===item.value}>
                                    <input type="radio" name="role" value={item.value}
                                        checked={updateform.userrole===item.value}
                                        onChange={(e)=>{setUpdateform({...updateform,userrole:e.target.value})}}/>
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
                                <input type="text" value={updateform.region||""} readOnly
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
                    onClick={(e)=>{Onupdateuser(e)}}>저장</Button>
            </Foot>

        </Modalin>
    </Modalout>
    )
}
