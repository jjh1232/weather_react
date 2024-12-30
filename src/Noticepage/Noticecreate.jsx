import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Button from "../UI/Button";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import ReactQuill from "react-quill";
import { useMemo } from "react";
import Header from "../MainPage/Header";
import CreateAxios from "../customhook/CreateAxios";
import "react-quill/dist/quill.snow.css"
import styled from "styled-components";

const Logo = () => (
  <svg className="icon" x="0px" y="0px" viewBox="0 0 24 24">
    <path fill="transparent" d="M0,0h24v24H0V0z"/>
    <path fill="#000" d="M20.5,5.2l-1.4-1.7C18.9,3.2,18.5,3,18,3H6C5.5,3,5.1,3.2,4.8,3.5L3.5,5.2C3.2,5.6,3,6,3,6.5V19 
     c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V6.5C21,6,20.8,5.6,20.5,5.2z M12,17.5L6.5,12H10v-2h4v2h3.5L12,17.5z M5.1,5l0.8-1h12l0.9,1  H5.1z"/>
  </svg>
);

const Wrapper=styled.div`

color:"white"
padding: 50px;
position:relative;
left:28.5%;
border:1px solid;
width:43%;
height:1000px;
top:14%;

`
function Noticecreate(props){
  

  const [title,settitle]=useState();
  const [content,setContent]=useState();
  const [titleerror,Settitleerror]=useState();
  const [texterror,Settexterror]=useState();
  const [cookie,Setcookie,removecookie]=useCookies();
  const navigate=useNavigate();
  const url=`/noticecreate`;
  const quillRef=useRef();
  const [filelist,setFilelist]=useState([{
  id:0,
  index:0,
  filename:'',
  url:''
  }   
    
  ])

const imagekey=useRef(0);
  
const axiosinstance=CreateAxios();
  const handlertitle = (e)=>{
    settitle(e.target.value)
  }
  const handlertext = (e)=>{
    settext(e.target.value)
  }
  const valdateFrom=()=>{
    let validate= true;
    if(!title){
      Settitleerror('글제목을입력해주세요');
      validate=false;
    }
   

    return validate;
  }
  //화살표함수로하면 제거ㄱ가안됨같은 이벤트라서;
  const  beforeunlo= (e)=>{
    e.preventDefault() //이거막으니까창안뜸
    console.log("아니")
      
        console.log(e)
      
     
  
    
    console.log("새로고침그냥서버에서하자")
 
  }
  //뒤로가기 설정
  const popst=(e)=>{
    //history.pushState(null, "", location.href);

    console.log("뒤로가기시작이세기가문제임")
    if(confirm("저장한내용은사라집니다")){
      
      console.log("뒤로가기스")
      filelist.map((data)=>{
        deletefile(e,data)
      })
      
    
    }else{
      console.log("취소")
     
    }
  }
  useEffect(()=>{
    
     window.addEventListener("beforeunload",beforeunlo);

    history.pushState(null, "", location.href);//뒤로정보
    
    window.addEventListener("popstate",popst)
      
      return ()=>{//유즈이펙트안에서 componentdid마운트같이끝나고 크릴어할떄사용
        window.removeEventListener("beforeunload",beforeunlo)
        window.removeEventListener("popstate",popst) //뒤로가기는popstate
      }
    },[filelist])

   
 

  const onLogin=(e)=>{
    e.preventDefault();
    if(valdateFrom()){
    axiosinstance.post(url,{
      
      username:cookie.userinfo["username"],
      nickname:cookie.userinfo["nickname"],
      title:title,
      text:content,
      files:filelist
    
    }
     
    
    ).then(function(response){
      alert("글이성공적으로 작성되었숩니당!")
      navigate("/notice")
      

    }).catch(function(error){
        alert("에러입니당..")
       
    })

  }
}


  //quill

  const imageHandler=()=>{
      
    //1.이미지를 저장할 인풋타임 파일돔만들기
    const input=document.createElement('input');
    //속성써주기
    input.setAttribute("type","file");
    input.setAttribute("accept","image/*");
    input.click()//에디터이미지버튼을 클릭하면 이 input이클릭됨
    //인풋이 클릭되면 파일선택창이 나타난다

    //input에변화가생긴다면=이미지를선택
    input.addEventListener(`change`,async()=>{
      //ex async함수의 앞에 붙여서 해당함수가 비동기임을 나타냄
      // await을 붙인것은 비동기 결과를기다리는키워드
        console.log("온채인지")
        const file=input.files[0];
        console.log(file)
        //multer에맞는 형식으로 데이터를만들어줌
        const formData=new FormData();
        formData.append("image",file);//form데이터는 키-밸류구조
        
        //백엔드 multer라우터에 이미지를보냄
        try{
            console.log("포스트리설트")
            const result = await axiosinstance.post('/contentimage', formData)
            
            console.log('성공 시, 백엔드가 보내주는 데이터', result);
            const IMG_URL = process.env.PUBLIC_URL+"/noticeimages/"+result.data;
            //src를 절대경로로 이해하기위해 위와같이핸들링
            console.log(IMG_URL)
            // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
            // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
            // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.
      
            // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
            const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
            // 1. 에디터 root의 innerHTML을 수정해주기
            // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
            // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
            // editor.root.innerHTML =
            //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.
            console.log("에디터확인");
            // 2. 현재 에디터 커서 위치값을 가져온다
            const range = editor.getSelection();            
            // 가져온 위치에 이미지를 삽입한다
            console.log("레인지확인");
            editor.insertEmbed(range.index, 'image', IMG_URL);//인덱스 ,타입 ,밸류
            
            console.log("인설트임베드확인후첨부파일에추가");
            console.log(filelist);
            
            setFilelist(filelist=>[...filelist,{
              id:imagekey.current,
              index:range.index,
              filename:file.name,
              url:IMG_URL}])
            imagekey.current+=1;
           
            
          } catch (error) {
            console.log('실패했어요ㅠ');
        }
    })
}
  

const modules =useMemo(()=>{ //유스메모 사용안하면 매랜더링마다다시생성됨 
  //유스메모는 메모리에저장한걸 다시가져옴 
return{//모듈
  
  toolbar:{ //툴바세팅
      container:[  //위에작업줄
          ["image"], //이미지추가
          [{header:[1,2,3,4,5,false]}], //크기
          ["bold","underline"], //볼드와밑줄
      ],
      handlers:{
          //이미지가 base64로너무길게저장되서 우리가핸들링해마 
          "image": imageHandler
          
      }
  },
};
},[])

const deletefile=(e,data)=>{
  e.preventDefault();
  console.log("삭제데이터"+data.index)
  if(data.id===0){
    console.log("첨빈값")
  }
  else{

      //db는 스케쥴러로 알아서 지울테니 그냥수정
    setFilelist(filelist.filter(list=>list.id!==data.id))
    quillRef.current.getEditor().deleteText(data.index,1);
    console.log("문제없이삭제")
 
}

}
const onchangecontent=(contents)=>{
  setContent(contents)
}


  return(
    <Wrapper>
    {cookie.userinfo&&
    <form >
   
  
  이메일:{cookie.userinfo["username"]}
<br/>

  닉네임:{cookie.userinfo["nickname"]}
<br/>

  제목:<input type="text"  value={title} onChange={handlertitle} />

    <div style={{color:'red'}}>{titleerror}</div>

  
  <ReactQuill //onChange={onchangecontent}//행동
        style={{width:"800px",height:"600px"}}//스타일
        modules={modules} //모듈추가 
        ref={quillRef}   //ref
        onChange={onchangecontent}
        />
        <br/><br/><br/>
  <div style={{color:'red'}}>{texterror}</div>
<div>
  <br/>
  
  <div>첨부목록:{filelist.map((data)=>{
    if(data.id===0){

    }else{
    return(<div key={data.id}>
      {data.id}
    {data.filename}
    
    <button onClick={(e)=>{deletefile(e,data)}}>삭제</button>
    </div>
)
     }})
}
    
  
    
    </div>


<Button title="제출" onClick={onLogin}
 />
 
</div>

</form>
}
</Wrapper>
  )
  }


export default Noticecreate;
