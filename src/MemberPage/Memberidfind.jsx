import React from "react";
import styled from "styled-components";

const Wrapper=styled.div`
position: relative;
left:28.5%;
width:43%;
height:100%;
 border: 1px solid;
 top: 8%;
`
function Memberidfind(){


  return (
    <Wrapper>
      본인확인 이메일을 작성해주십시요 
      <form >
    이름:<input type="text" />
    이메일:<input type="email"/>
    </form>
    </Wrapper>
  )
}

export default Memberidfind