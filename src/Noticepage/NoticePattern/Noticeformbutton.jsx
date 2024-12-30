import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Buttonlist=styled.div`
width:28%;
border:1px solid;
float:right;
`
export default function Noticeformbutton(){

    const navigate=useNavigate();


    return (
        
        <Buttonlist>
        <button onClick={()=>{navigate(`/notice?form=noticeform`)
            window.location.reload();
        }}>
                게시판형
            </button>
            <button onClick={()=>{navigate(`/notice/twitform`)
window.location.reload();

            }}>
                트위터형
            </button>
            <button onClick={()=>{navigate(`/notice?form=previewform`)
              window.location.reload();
            }}>
                미리보기형
            </button>
            
            </Buttonlist>
        
    )

}