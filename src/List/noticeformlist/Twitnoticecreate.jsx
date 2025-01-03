import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import CreateAxios from "../../customhook/CreateAxios";
import styled from "styled-components";
import * as Weatherpa from "../../UI/Noticetools/Weatherpar"
import { useNavigate } from "react-router-dom";
const Wrapper=styled.div`
    overflow: auto;
    width:100%;
    height: 100%;
`
const Weathercss=styled.div`
    text-align: right;

`

export default function Twitnoticecreate(props){

    const [cookie,Setcookie,removecookie]=useCookies();

    const [title,setTitle]=useState()
    //quill을 사용할떈 하나로묶어서 못쓰겟음온채인지에그냥셋콘탠트너음
    const [content,setContent]=useState();

    const quillref=useRef();
  
    const axiosinstance=CreateAxios();
    const navigate=useNavigate();
    //그냥 이미지로쓰는거와 첨부는 따로 쓰자
    const [filelist,setFilelist]=useState([{
                
    }])
    let temp=cookie.weather.t1H
    let rain=cookie.weather.rn1
    let pty=Weatherpa.getpty(cookie.weather.pty);
    let sky=Weatherpa.getsky(cookie.weather.sky);
    //모듈 설정
    
    const fileindex=useRef(1)
const imagehandler=()=>{
    //인풋 생성
    console.log("이미지핸들러시작")
    const input =document.createElement("input")
    input.setAttribute("type","file");
    input.setAttribute("accept","image/*")
    //그걸클릭한효과
    input.click();

    input.onchange=async ()=>{
        console.log("이미지핸들러온채인지")
        const file=input.files[0];
        const formdata=new FormData();
        formdata.append("image",file)
        
        try{
            console.log("포스트리설트")
            const result = await axiosinstance.post('/contentimage', formdata)
            
            console.log('성공 시, 백엔드가 보내주는 데이터', result);
            
            const imgurl =process.env.PUBLIC_URL+"/noticeimages/"+result.data;
           //절대경로가안됨..
            console.log("절대경로"+imgurl)
            //ref를이용해 에디터구함
            const editor=quillref.current.getEditor();
            //에디터의 현재위치
            const range=editor.getSelection();

            console.log("레인지인덱스"+range.index)
            //이미지붙여넣기 (위치인덱스,자료형,해당파일url)
            editor.insertEmbed(range.index,`image`,imgurl)
            //커서위치조정 
            editor.setSelection(range.index+1)
            //파일리스트에저장
            console.log("파일리스트저장시작")
            setFilelist((filelist)=>[...filelist,{
                id:fileindex.current,
                index:range.index,
                filename:file.name,
                url:imgurl
                


            }])
            console.log("파일리스트저장종료")
            fileindex.current++;
        }
        catch(error){
            console.log("에러")
        }

    }
}
const modules=useMemo(()=>{
    return{
    toolbar:{
        container:[
            ["image"],
            [{header:[1,2,3,4,5,false]}],
            ["bold"]
        ],
        handlers:{
            "image":imagehandler
        }
    }
}
}
,[])

//이건첨부파일제거로하고 
const filedelete=(id,range)=>{
    console.log("파일딜리트아이디="+id +" 레인지 "+range)
    
    setFilelist(filelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    quillref.current.getEditor().deleteText(range,1)
}

//제출
const createtwitnotice=()=>{
   
    console.log("글작성 파일확인"+filelist)
    axiosinstance.post("/noticecreate",{
        username:cookie.userinfo["username"],
        nickname:cookie.userinfo["nickname"],
        title:title,
        text:content,
        temp:temp,
        sky:sky,
        pty:pty,
        rain:rain,
        files:filelist
    }).then((res)=>{
        alert("글작성성공")
        //사실어차피리로드해야해서리..
        props.setIscreate(false)
        props.redataget();
        
        
        
    })

}

    return (
        <Wrapper>
         <Weathercss> {//날씨css
         }       
        {temp},{rain},{sky},{pty}
        </Weathercss>
        이메일:{cookie.userinfo["username"]}
        <br/>
        닉네임:{cookie.userinfo["nickname"]}
        <br/>
        제목:<input onChange={(e)=>{setTitle(e.target.value)}}/>
        <br/>
        
        내용:<ReactQuill
        style={{width:"99%",height:"70%"}}//스타일
        modules={modules}
        onChange={setContent}
        ref={quillref}
        />
        <br/>
        <br/>
        
        첨부목록:{filelist&&filelist.map((list,index)=>{
            console.log("첨부파일:"+list)
                if(index==0){

                }else{
            return (
                <>
                <span key={index}>
                    {index}
                    {list.filename}
                    <button onClick={()=>{filedelete(list.id,list.range)}}>제거</button>
                </span>
                <br/>
                </>
                
            )
                }
        })}
    
        <br/>
        절대경로:{process.env.PUBLIC_URL}
        파일인덱스:{fileindex.current} 
        확인할내용2:{content} 
        <br/>
        <button onClick={createtwitnotice}>제출</button>
        </Wrapper>
    )
}