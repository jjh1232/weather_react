import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Buttonlist=styled.div`

border:1px solid;

`
export default function Noticeformbutton(){

    const navigate=useNavigate();


    return (
        
        <Buttonlist>
        <button onClick={()=>{navigate(`/notice?form=noticeform`)
            window.location.reload();
        }}>
                게시
            </button>
            <button onClick={()=>{navigate(`/notice/twitform`)
window.location.reload();

            }}>
                일반게시글
            </button>
            <button onClick={()=>{navigate(`/favoritenotice`)
              window.location.reload();
            }}>
                좋아요 한게시글
            </button>
            
            </Buttonlist>
        
    )

}