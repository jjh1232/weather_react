import React, { useState } from "react";
import styled from "styled-components";

const Wrapper=styled.div`
    position: relative;
    overflow: auto;
    
`
const Header=styled.div`
    position: relative;
    float: left;
    width: 100%;
    height: 25px;
    border-bottom: 3px solid black;
`

const Exitbutton=styled.div`
    position: relative;
    width: 20px;
    height: 20px;
    cursor: pointer;

&::before{
    content:"";
    top: 25%;
    left: -1%;
    width: 15px;
    
    position: absolute;
    border-bottom: 3px solid black;
    transform:  rotate(45deg);
    
   
}
&::after{
    content:"";
    top:25%;
    left:-1%;
    width: 15px;
    position: absolute;
    border-bottom: 3px solid black;
    transform:  rotate(-45deg);
}
`
const H3title=styled.h3`
    position: relative;
    width: 100px;
    left: 21%;
    bottom:37px;
    
`
export default function NoticeDetach(props){
    const {deletemethod,detachs,setislibe}=props;
   
    //이거 어드민이랑 그냥버전 둘다만들어야함 ;

 

    const deletedetach=(id,rangeindex)=>{
        if(confirm("첨부목록삭제시글의내용도삭제됩니다")){
            deletemethod(id,rangeindex)
        }
    }
    return (
        <Wrapper>
            <Header>
                <Exitbutton onClick={()=>{setislibe(false)}}/>
                <H3title>첨부목록</H3title>
                
                </Header>

            {detachs&&detachs.map((data,key)=>{
        if(data.path===``){

        }else{
                return (        
                    <div key={key} style={{float:"left"}}>
                        {data.filename}

                        <button onClick={()=>{deletedetach(data.id,data.rangeindex)}}>삭제</button>

                    </div>
                )
            }
            })}
        </Wrapper>
    )

}