
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import CreateAxios from "../../customhook/CreateAxios";
import styled from "styled-components";



const Modalouter=styled.div`
    position:fixed;
    width:45%;
    height: 80%;
    background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center;
top: 10%;

`
const Modaliner=styled.div`
    
padding: 15px;
width:90%;
height:70%;
background-color: #FFFFFF;
overflow: auto;

`
export default function Twitformnoticeupdate(props){

    const {noticeid}=props
    const [cookie,Setcookie,removecookie]=useCookies();

    const [newtitle,setNewtitle]=useState()
    //quill을 사용할떈 하나로묶어서 못쓰겟음온채인지에그냥셋콘탠트너음
    const [newcontent,setNewcontent]=useState();

    const quillref=useRef();
  
    const axiosinstance=CreateAxios();

    //그냥 이미지로쓰는거와 첨부는 따로 쓰자
    const [newfilelist,setNewfilelist]=useState([{
                
    }])
    //모듈 설정
    
    const fileindex=useRef(0)


    const prevdataget=()=>{
        axiosinstance.get(`noticeupdate/${noticeid}`)
        .then((res)=>{
            console.log(res)
            setNewtitle(res.data.title)
            setNewcontent(res.data.text)
            setNewfilelist(res.data.detachfiles)
            fileindex.current=res.data.detachfiles[res.data.detachfiles.length-1].idx
        }).catch((err)=>{
            console.log("수정데이터가져오기오류")
        })
    }

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
            const imgurl = process.env.PUBLIC_URL+"/noticeimages/"+result.data;
           
            
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
            setNewfilelist((filelist)=>[...filelist,{
                idx:fileindex.current,
                rangeindex:range.index,
                filename:file.name,
                path:imgurl


            }])
            console.log("파일리스트저장종료")
            fileindex.current+=1;
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
    
    setNewfilelist(newfilelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    //quillref.current.getEditor().deleteText(range,1)
}

//제출
const twitnoticecreate=()=>{

    console.log("글작성 파일확인"+newfilelist)
    axiosinstance.put(`/noticeupdate/${noticeid}`,{
        username:cookie.userinfo["username"],
        nickname:cookie.userinfo["nickname"],
        title:newtitle,
        text:newcontent,
        detach:newfilelist
    }).then((res)=>{
        alert("글작성성공")
        //사실어차피리로드해야해서리..
        
        window.location.reload();
        
        
    }).catch((err)=>{
        alert("에러"+err)
    })

}

useEffect(()=>{
    prevdataget()
},[])

    return (
        <Modalouter>
            <Modaliner>

        이메일:{cookie.userinfo["username"]}
        <br/>
        닉네임:{cookie.userinfo["nickname"]}
        <br/>
        제목:<input value ={newtitle} onChange={(e)=>{setNewtitle(e.target.value)}}/>
        <br/>
        
        내용:<ReactQuill
        style={{width:"99%",height:"70%"}}//스타일
        modules={modules}
        onChange={setNewcontent}
        ref={quillref}
        value={newcontent}
        />
        <br/>
        <br/>
        
        첨부목록:{newfilelist&&newfilelist.map((list,index)=>{
             if(list.path===``){

             }else{
                
            return (
                <>
                <span key={index}>
                    {index}
                    {list.filename}
                    <button onClick={()=>{filedelete(list.id,list.rangeindex)}}>제거</button>
                <br/>아이디값:{list.idx}
                </span>
                <br/>
                </>
                
            )
                }
 } )}
    
        <br/>
        
        확인할내용2:{newcontent} 
        <br/>
        <button onClick={twitnoticecreate}>제출</button>
        </Modaliner>
        </Modalouter>
    )
    

}