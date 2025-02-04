import React from "react";
import AdminLeft from "./AdminLeft";
import styled from "styled-components";
import AdminHeader from "../customhook/Admintools/AdminCss/AdminHeader";

const Wrapper=styled.div`
  
    position: relative;
    width: 1530px;
    top: 0%;
    left:18%;
   


`
export default function Adminmain(){



    return (
        <Wrapper>
        
        <AdminHeader>
            
            관리자페이지
        </AdminHeader>
        </Wrapper>
    )
}