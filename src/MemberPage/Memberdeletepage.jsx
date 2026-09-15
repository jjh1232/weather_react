import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";
const Wrapper=styled.div`
position: relative;
width:100%;
/* left/width/top 은 grid 이전의 고정 레이아웃 보정값이었다.
   특히 top:8% 는 부모 높이 기준이라 내용이 길어질수록 아래로 밀린다. */
padding: 18px;
`
/*
 * [2026-09-15] 예전에는 서버가 탈퇴 코드를 **응답으로 돌려주고**, 이 화면이 그 값과
 * 입력값을 브라우저 안에서 비교했다(화면에 코드를 그대로 찍기까지 했다).
 * 응답을 들여다보면 메일 없이 코드를 알 수 있었고, 요청의 이메일만 바꾸면 남의 계정도 됐다.
 *
 * 이제 코드는 메일로만 가고, 비교는 서버가 한다. 대상도 서버가 로그인 정보로 정한다.
 */
function Memberdeletepage(){
    const [,,removeloginuser]=useCookies()
      const  [deletecode,Setdeletecode]=useState("");
      const [sent,Setsent]=useState(false);
      const navigate=useNavigate();
      const axiosinstance=CreateAxios();

      const logoutlocal=()=>{
        removeloginuser("userinfo");
        removeloginuser("Refreshtoken");
        removeloginuser("Acesstoken");
      }

      const deletemailsend=()=>{
        axiosinstance.post(`/memberdeletemail`,{})
        .then(()=>{
          Setsent(true)
          alert("회원님의 이메일로 삭제 코드를 발송했습니다!")
        }).catch(()=>{
          alert("로그인 기간이 만료됐습니다. 다시 로그인해주세요!")
          logoutlocal()
        })
      }

      const deletemember=()=>{
        if(!deletecode.trim()){
          alert("메일로 받은 삭제 코드를 입력해주세요")
          return
        }
        axiosinstance.delete(`/memberdelete`,{
          data:{ authkey:deletecode.trim() }
        })
        .then(()=>{
          alert("삭제가 완료되었습니다")
          logoutlocal()
          navigate("/main")
        }).catch((error)=>{
          if(error?.response?.status===400){
            alert("삭제 코드를 확인해주세요")
          }else{
            alert("삭제하지 못했습니다. 잠시 후 다시 시도해주세요")
          }
        })
      }
  return(
    <Wrapper>
      삭제하기위해 본인명의의 이메일인증이필요합니다.<Button title={sent?"삭제코드 다시 보내기":"삭제코드보내기"} onClick={()=>{
        deletemailsend()
      }}/>
      삭제코드번호:<input type="text" value={deletecode} onChange={(e)=>{Setdeletecode(e.target.value)}}/>
      <br/>
      <Button title="확인" onClick={deletemember}/>
    </Wrapper>
  )
}

export default Memberdeletepage
