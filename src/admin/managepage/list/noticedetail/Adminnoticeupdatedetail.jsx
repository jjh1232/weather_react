import React from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useState,useEffect,useRef ,useMemo} from "react";
import CreateAxios from "../../../../customhook/CreateAxios";
import ReactQuill from "react-quill";
import { Sky,Pty } from "../../../../customhook/Admintools/Weathersetting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";


export default function Adminnoticeupdatedetail(props){
    const [cookie,Setcookie,removecookie]=useCookies();
    const {data,setisupdate}=props;
    const axiosinstance=CreateAxios();
    const quillref=useRef();
    const imagekey=useRef(data.detachfiles[data.detachfiles.length-1]?.idx||0);
    
const navigate=useNavigate();
     //게시글정보
    //강수량때매 정규식추가
    const regex=/[^0-9]/g;

    const [crnotice,setCrnotice]=useState(
        {
            noticeid:data.num,
            username:data.username,
            nickname:data.nickname,
            title:data.title,
            text:data.text,
            temp:data.temp,
            rain:data.rain

        }
    )
    const [sky,setSky]=useState(data.sky);
    const [pty,setPty]=useState(data.pty);
    const queryclient=useQueryClient();
    //파일정보
      const [filelist,setFilelist]=useState(data.detachfiles)      
        
      //뮤테이트
      const mutation=useMutation({
        mutationFn:(newdata)=>{
            return axiosinstance.put(`/admin/noticeupdate/${newdata.noticeid}`,newdata)
            
             
            
        },
        onSuccess:()=>{
            setisupdate(false)
            queryclient.invalidateQueries([`noticeData`])
        }
      })
      const onupdate=()=>{
        mutation.mutate({
            noticeid:crnotice.noticeid,
            username:crnotice.username,
            nickname:crnotice.nickname,
            title:crnotice.title,
            text:crnotice.text,
            temp:crnotice.temp,
            rain:crnotice.rain,
            sky:sky,
            pty:pty,
            files:filelist
        })
      }
    
    
    const imageHandler=()=>{
        //인풋생성
        const input =document.createElement(`input`)
        input.setAttribute("type","file");
        input.setAttribute("accept","image/*");
        input.click()

        input.addEventListener(`change`,async()=>{
            //폼데이터로 파일 서버로보냄
            const file=input.files[0];
            const formData=new FormData();
        formData.append("image",file);

        const result=await axiosinstance.post('/contentimage', formData)
        //서버에 미리저장후 이미지rul리턴받고 주소저장
        const IMG_URL = process.env.PUBLIC_URL+"/noticeimages/"+result.data;
            //에디터객체 가져오기
        const editor=quillref.current.getEditor();
           // 2. 현재 에디터 커서 위치값을 가져온다
           const range = editor.getSelection();  
           //에디터에 삽입
           editor.insertEmbed(range.index, 'image', IMG_URL);//인덱스 ,타입 ,밸류
           editor.setSelection(range.index+1)
           setFilelist(filelist=>[...filelist,{
            idx:imagekey.current,
            rangeindex:range.index,
            filename:file.name,
            path:IMG_URL}])
            //이미지번호를위해
          imagekey.current+=1;
        
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
   
    //quill text
      const texthandler=(text)=>{
        setCrnotice({...crnotice,text:text})
      }
      //게시글작성
      
    //이건첨부파일제거로하고 
const filedelete=(id,range)=>{
   
    
    setFilelist(filelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    //에디터에는 넣어뒀던 첨부파일이 안들어가는듯;
    quillref.current.getEditor().deleteText(range,1)
}

    return (
        <>
       
        
            <div>
                기온:<input type="number" defaultValue={crnotice.temp} onChange={(e)=>{setCrnotice({...crnotice,sky:e.target.value})}}/> 
                하늘상태:<Sky setskyvalue={setSky} devalue={crnotice.sky}/>   {sky}
                강수형태:<Pty setptyvalue={setPty} devalue={crnotice.pty}/>   {pty}
                강수량:<input type="text" defaultValue={crnotice.rain} onChange={(e)=>{setCrnotice({...crnotice,pty:e.target.value})}}/> 
                mm 미만
            </div>
            {crnotice.title}
            이메일:<input type="text" defaultValue={crnotice.username} onChange={(e)=>{setCrnotice({...crnotice,username:e.target.value})}}/><br/>
            닉네임:<input type="text" defaultValue={crnotice.nickname} onChange={(e)=>{setCrnotice({...crnotice,nickname:e.target.value})}}/><br/>
            제목:<input type="text" defaultValue={crnotice.title} onChange={(e)=>{setCrnotice({...crnotice,title:e.target.value})}}/><br/>
            내용:<ReactQuill
            ref={quillref}
            style={{width:"90%",height:"70%"}}//스타일
            modules={modules}
            value={crnotice.text}
            onChange={texthandler}
            />
            <br/><br/>
             
        첨부목록:{filelist.length}<br/>
        {filelist&&filelist.map((list,key)=>{
            
            if(list.path===``){

            }else{
            return (
                <>
                <span key={key}>
                    
                    {list.filename}
                    <button onClick={()=>{filedelete(list.id,list.rangeindex)}}>제거</button>
                <br/>아이디값:{list.idx}
                </span>
                <br/>
                </>
                
            )
                }
        })}

            <button onClick={()=>{onupdate()}}>수정완료</button>
            <button onClick={()=>{setisupdate(false)}}>수정취소</button>
        </>
    )
}