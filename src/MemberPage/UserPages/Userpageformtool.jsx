import React, { useState } from "react";
import { createSearchParams, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass as icon } from "@fortawesome/free-solid-svg-icons";
const MenuDiv=styled.div`
  display: flex;
`
const Buttontool=styled.div`
  display: flex;
  border: 1px solid blue;
  width: 65%;
`
const ActiveLink=styled(NavLink)`
  display: flex;
  cursor: pointer;
  flex: 1;
  font-size: 18px;
  font-weight: 800;
  color: ${(props)=>props.Active? `${props.theme.text}`:"#8d8d8d"};
  justify-content: center;
  align-items: center;
  padding: 5px 5px;
  :hover{
   background-color: rgba(216, 216, 216, 0.747);
  }
`
const Searchdiv=styled.div`
  margin-left: auto;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Searchform=styled.input`


`
const Searchbox=styled.select`

`
const Submitdiv=styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${props=>props.theme.text};//검-화
  color: ${props=>props.theme.primary};
  cursor: pointer;
`
const Searchicon=styled(FontAwesomeIcon)`
  
`

export default function Userpageformtool({profileid}){

    const isPostsActive = location.pathname === `/userpage/${profileid}`;
  const isPhotoActive = location.pathname === `/userpage/${profileid}/photo`;
  const isHighlightActive = location.pathname === `/userpage/${profileid}/highlight`;

    const [searchOption,setSearchOption]=useState("title")
    const [searchtext,setSearchtext]=useState("");

    const navigate=useNavigate();
     const basePath = 
    location.pathname.includes("/photo")
      ? `/userpage/${profileid}/photo`
      : location.pathname.includes("/highlight")
      ? `/userpage/${profileid}/highlight`
      : `/userpage/${profileid}`;

  const Searchsubmit=()=>{
    const params= createSearchParams({
      option:searchOption,
      query:searchtext
    });

    navigate({
      pathname:basePath,
      search:`?${params.toString()}`
    })
  }
  const handlechange=()=>{
    setSearchOption("title")
    setSearchtext("")
  }
      return (
    <MenuDiv>
      <Buttontool>

     
      <ActiveLink to={`/userpage/${profileid}`} Active={isPostsActive}end onClick={handlechange}>
        Posts
      </ActiveLink>
      <ActiveLink to={`/userpage/${profileid}/photo`} Active={isPhotoActive} onClick={handlechange}>
        Image
      </ActiveLink>
      <ActiveLink to={`/userpage/${profileid}/highlight`} Active={isHighlightActive} onClick={handlechange}>
        Highlight
      </ActiveLink>
       </Buttontool>
       <Searchdiv>
        <Searchbox onChange={(e)=>setSearchOption(e.target.value)}>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </Searchbox>
        <Searchform  onChange={(e)=>setSearchtext(e.target.value)} placeholder="search"/>
        <Submitdiv onClick={Searchsubmit}>
          <Searchicon icon={icon} />
        </Submitdiv>

       </Searchdiv>
      
    </MenuDiv>
  );
}