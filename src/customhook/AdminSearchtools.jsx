import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//=====================================================================
// 관리자 목록 검색줄. 예전엔 브라우저 기본 select/input/button 그대로라
// 화면마다 높이가 제각각이었다.
//
// 넘어오는 prop 이름이 화면마다 searchdata / searchdatas 로 갈려 있어서
// (회원관리는 searchdatas, 채팅방관리는 searchdata) 한쪽은 주소창에 검색어가
// 있어도 입력칸이 비어 보였다. 둘 다 받아준다.
//=====================================================================

const Form=styled.form`
    display: flex;
    align-items: center;
    gap: 6px;
`
const Select=styled.select`
    height: 32px;
    padding: 0 8px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    font-size: 13px;
    cursor: pointer;
    outline: none;

    &:focus { border-color: ${(props)=>props.theme.accent}; }
`
const Input=styled.input`
    width: 200px;
    height: 32px;
    padding: 0 10px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    font-size: 13px;
    outline: none;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    &::placeholder { color: ${(props)=>props.theme.textFaint}; }
    &:focus {
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }

    @media (max-width: 700px) { width: 130px; }
`
const Submit=styled.button`
    height: 32px;
    padding: 0 14px;
    border: 1px solid transparent;
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.accent};
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition};

    &:hover { background: ${(props)=>props.theme.accentHover}; }
    &:focus-visible {
        outline: 2px solid ${(props)=>props.theme.accent};
        outline-offset: 2px;
    }
`
const Reset=styled.button`
    height: 32px;
    padding: 0 10px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.textMuted};
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;

    &:hover { background: ${(props)=>props.theme.surfaceHover}; color: ${(props)=>props.theme.text}; }
`

export default function AdminSearchtools(props){

    const {searchdata,searchdatas,url,options}=props;
    const current=searchdatas||searchdata;
    const navigate=useNavigate();

    const [form,setForm]=useState({
        option:current?.option || options[0].value,
        keyword:current?.keyword || ""
    });

    //form 으로 감싸서 엔터로도 검색된다. 예전엔 버튼을 눌러야만 됐다.
    const search=(e)=>{
        e.preventDefault();
        const params=new URLSearchParams();
        params.set("page",1);
        params.set("option",form.option);
        params.set("keyword",form.keyword);
        navigate(`${url}?${params.toString()}`);
    }

    const reset=()=>{
        setForm((prev)=>({...prev,keyword:""}));
        navigate(`${url}?page=1`);
    }

    return (
        <Form onSubmit={search}>
            <Select value={form.option}
                onChange={(e)=>setForm((prev)=>({...prev,option:e.target.value}))}>
                {options.map((option)=>(
                    <option key={option.value} value={option.value}>{option.name}</option>
                ))}
            </Select>

            <Input type="text" value={form.keyword} placeholder="검색어"
                onChange={(e)=>setForm((prev)=>({...prev,keyword:e.target.value}))}/>

            <Submit type="submit">검색</Submit>

            {current?.keyword && <Reset type="button" onClick={reset}>초기화</Reset>}
        </Form>
    )
}
