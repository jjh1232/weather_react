import React from "react";
import styled from "styled-components";
import { API_BASE } from "../../config/api";
import { detachimage } from "../../UI/profileimage";

//미리보기 격자의 한 칸.
//예전에는 200px 고정 + object-fit:fill 이라 사진이 늘어나 찌그러졌다.
//칸은 정사각형으로 두고 이미지는 cover 로 잘라서 채운다.
const Wrapper=styled.div`
    position: relative;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Prev=styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.25s ${(props)=>props.theme.ease};

    ${Wrapper}:hover & {
        transform: scale(1.04);
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
        ${Wrapper}:hover & { transform: none; }
    }
`

export default function ImageListitem(props){

    return (
        <Wrapper>
            <Prev src={detachimage(props.data.path)}
                  alt={props.data.filename||"첨부 이미지"}
                  loading="lazy"/>
        </Wrapper>
    )
}
