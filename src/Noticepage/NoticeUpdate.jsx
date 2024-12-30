import React, { useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import Button from "../UI/Button";
import axios from "axios";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import { useMemo } from "react";
import { useEffect } from "react";
import "react-quill/dist/quill.snow.css"
import CreateAxios from "../customhook/CreateAxios";
import styled from "styled-components";

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
function NoticeUpdate(props){

  const [loginuser,Setloginuser,removeloginuser]=useCookies(['userinfo'])
  const {num}=useParams();
  
  const [noticedetail,setNoticedetail]=useState([]);
  const navigate=useNavigate();
 
  const [newtitle,setNewtitle]=useState()
  const [newtext,setNewtext]=useState()
  const [newdetach,setNewdetach]=useState([])
  const detachidx=useRef(0)
  const quillRef=useRef();
  const axiosinstance=CreateAxios();
  const noticeurl=`/noticeupdate/${num}`;
  const titlehandler=(e)=>{
    console.log(e)
    setNewtitle(e.target.value)
  }
 
  useEffect(()=>{
    //
    console.log("업데이트불러오기"+num)
    axiosinstance.get(noticeurl)
    .then((res)=>{
      
      setNoticedetail(res.data)
      console.log(res.data)
      setNewdetach(res.data.detachfiles)
      setNewtitle(res.data.title)
      setNewtext(res.data.text)
      if(res.data.detachfiles.length===0){
        maxidx=0;
        return maxidx;
      }else{
      const maxidx=res.data.detachfiles.reduce((prev,current)=>{
        return prev.idx>=current.idx ? prev.idx:current.idx
      })
      
      console.log("맥스값"+maxidx)
      detachidx.current = maxidx;
      console.log("맥스값"+detachidx.current)
    }
    })
  },[])


  const onupdate=()=>{
    console.log(newdetach)
axiosinstance.put(`/noticeupdate/${num}`,{
  
    title:newtitle,
    text:newtext,
    detach:newdetach
   
}).then(function(response){

    alert("글이 잘수정되었숨다")
    
  
    navigate(`/noticedetail/${num}`)
   
    
}).catch((error)=>{
  alert("로그인기한이지났습니다다시로그인해주세요!")
  
})

    }

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
          console.log("온채인지")
          const file=input.files[0];
          console.log(file)
          //multer에맞는 형식으로 데이터를만들어줌
          const formData=new FormData();
          formData.append("image",file);//form데이터는 키-밸류구조
          
          //백엔드 multer라우터에 이미지를보냄
          try{
  
              const result = await axiosinstance.post('http://localhost:8081/contentimage', formData
                
              );
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
              console.log("레인지확인:"+range.index);
              editor.insertEmbed(range.index, 'image', IMG_URL);
              console.log("인설트임베드확인후첨부파일에추가");
              
             
              setNewdetach(newdetach=>[...newdetach,{id:0,idx:detachidx.current,rangeindex:range.index,filename:file.name,path:IMG_URL}])
              detachidx.current +=1; 
             
              
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
  
  const deletefile=(detach,e)=>{
   e.preventDefault()
    console.log(detach)
    setNewdetach(newdetach.filter(data=>data.idx!==detach.idx))
    quillRef.current.getEditor().deleteText(detach.rangeindex,1)
   
  }

  const onchangecontent=(content)=>{
    setNewtext(content)
  }
  return(
    <Wrapper>
      글번호:{noticedetail.num}<br/>
      이메일:{noticedetail.username}<br/>
      작성자:{noticedetail.nickname}<br/>
      
      
      <form>
      제목:<input type ="text" value={newtitle} onChange={(e)=>{titlehandler(e)}}/><br/>
      내용:<ReactQuill //onChange={onchangecontent}//행동
        style={{width:"800px",height:"600px"}}//스타일
        modules={modules} //모듈추가 
        ref={quillRef}   //ref
        onChange={onchangecontent}
        value={newtext}

        />
      <br/>
      
      
      첨부목록:{newdetach &&newdetach.map((deta,key)=>{
        return(
          <div>
            {deta.idx}
            {deta.filename}
            <button onClick={(e)=>{deletefile(deta,e)}}>삭제</button>
          </div>
        )
     
        
      })}
      </form>
     날짜: {noticedetail.red}
    <br/>
    {newtext}
    <br/>
      <Button title="제출" onClick={onupdate}/>
    </Wrapper>
  )

}
export default NoticeUpdate;