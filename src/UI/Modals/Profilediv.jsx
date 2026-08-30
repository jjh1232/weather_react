import React from "react";
import styled from "styled-components";
import profileimage from "../profileimage";

const Profilecss=styled.div`
    position  :relative ;
    width: 100%;
    height: 100%;
    min-height: 20px;
    //margin: 3px;
    display: flex;
    justify-content: center;
    align-items: center;

`
const Profile = styled.img`
    position: relative;
    border:1px solid ${(props)=>props.theme.border};
    border-radius: 50%;
    object-fit: cover;
    background-color: ${(props)=>props.theme.surfaceAlt};
    width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
`
export default function Profilediv(props){
    const {url,width,height}=props;

    /* 예전엔 여기서 두 가지가 틀렸다.
         1) 기본 이미지를 "noprofile.png" 로 적었는데 실제 파일은 Noprofile.png 다.
            윈도우는 대소문자를 안 가려서 개발중엔 보이지만 리눅스에선 404 가 된다.
         2) url===null 로 엄격 비교라, 값이 undefined 면 폴백을 안 타고
            "/userprofileimg"+undefined 로 갔다.
       두 경우 모두 profileimage() 가 처리한다. */
    return (
                        <Profilecss>
                           <Profile src={profileimage(url)}
                                width={width}
                                height={height}
                          />
                         </Profilecss>
    )
}