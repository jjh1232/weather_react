import React, { useState } from "react";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as searchicon } from "@fortawesome/free-solid-svg-icons";

/* 유저페이지 검색.
   예전엔 탭(Posts/Image/Highlight)과 한 줄을 나눠 쓰면서
   맨살 select + 맨살 input + 검은 네모 버튼이 따로 놀았다.
   지금은 알약 하나로 묶어서 EDIT 버튼 줄(빈 공간)으로 올렸다. */

const Wrapper=styled.form`
    display: flex;
    align-items: center;
    height: 34px;
    max-width: 320px;
    width: 100%;
    padding-left: 4px;
    background: ${(props)=>props.theme.surfaceAlt};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    overflow: hidden;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition},
                background ${(props)=>props.theme.transition};

    &:focus-within{
        background: ${(props)=>props.theme.surface};
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
/* 옵션 선택 - 테두리를 지우고 오른쪽에 얇은 구분선만 남긴다 */
const Optionselect=styled.select`
    flex-shrink: 0;
    height: 100%;
    padding: 0 8px 0 10px;
    border: none;
    border-right: 1px solid ${(props)=>props.theme.border};
    background: transparent;
    color: ${(props)=>props.theme.textMuted};
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: -0.01em;
    cursor: pointer;
    outline: none;

    option{
        color: ${(props)=>props.theme.text};
        background: ${(props)=>props.theme.surface};
    }
`
const Textinput=styled.input`
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0 10px;
    border: none;
    background: transparent;
    color: ${(props)=>props.theme.text};
    font-size: 13.5px;
    outline: none;

    &::placeholder{
        color: ${(props)=>props.theme.textFaint};
    }
`
const Submitbutton=styled.button`
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    margin-right: 2px;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: ${(props)=>props.theme.textFaint};
    display: grid;
    place-items: center;
    font-size: 13px;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.accentSoft};
        color: ${(props)=>props.theme.accent};
    }
`

export default function Userpagesearch({profileid}){
    const [searchOption,setSearchOption]=useState("title");
    const [searchtext,setSearchtext]=useState("");
    const navigate=useNavigate();
    const location=useLocation();

    //지금 보고 있는 탭을 유지한 채로 검색한다
    const basePath=
        location.pathname.includes("/photo")
        ? `/userpage/${profileid}/photo`
        : location.pathname.includes("/highlight")
        ? `/userpage/${profileid}/highlight`
        : `/userpage/${profileid}`;

    const Searchsubmit=(e)=>{
        e.preventDefault();   //form 이라 엔터로도 검색된다
        const params=createSearchParams({
            option:searchOption,
            query:searchtext
        });
        navigate({
            pathname:basePath,
            search:`?${params.toString()}`
        })
    }

    return (
        <Wrapper onSubmit={Searchsubmit}>
            <Optionselect value={searchOption} onChange={(e)=>setSearchOption(e.target.value)}>
                <option value="title">제목</option>
                <option value="content">내용</option>
            </Optionselect>
            <Textinput
                value={searchtext}
                onChange={(e)=>setSearchtext(e.target.value)}
                placeholder="이 유저의 글 검색"
            />
            <Submitbutton type="submit" aria-label="검색">
                <FontAwesomeIcon icon={searchicon}/>
            </Submitbutton>
        </Wrapper>
    )
}
