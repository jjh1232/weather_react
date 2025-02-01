import React from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useState,useEffect,useRef ,useMemo} from "react";
import CreateAxios from "../../../../customhook/CreateAxios";
import ReactQuill from "react-quill";
import { Sky,Pty } from "../../../../customhook/Admintools/Weathersetting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const Wrapper=styled.div`
    position: absolute;
    width: 1530px;
    top: 0%;
    left:0%;
    border: 1px solid black;
`
const Header=styled.div`
background-color: black;
text-align: center;
border: 2px solid green;
height: 50px;
`
const Main=styled.div`
    position: relative;
    width: 1000px;
    border:1px solid blue;
`
const NoticeData=styled.div`
position: relative;
border:3px solid black;

height: 45px;
`
const Profile=styled.img`
    position: relative;
    width: 40px;
    bottom:147%;
    border: 1px solid black;
    object-fit: fill;
    height: 40px;
   // display: inline-block;
`
const UserName=styled.div`
    height: 40px;
    left: -0.5%;
    width: fit-content;
   
    position: relative;
    display: inline-block;
    
`
const MainData=styled.div`
    
    border:1px solid black;
`
const Weatherdata=styled.div`
    position: relative;
    top:40%;
    left:14.5%;
    float: right;
    border: 1px solid yellow;
`
const ImageList=styled.div`
      position: fixed;
    border: 1px solid green;
    width: 325px;
    height: 75%;
    left:71%;
    top: 8%;
    z-index: 100;
    float: right;
`
const CommentCss=styled.div`
  
`

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
            rain:data.rain.replace(/[^0-9]/g,"")

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
        <Wrapper>
            <Main>
            <Header>
            <h3 style={{color:"white"}}>게시글수정</h3>
            <span style={{float:"right",position:"relative",bottom:"20%"}}>
            {data.red}
        </span>
            </Header>

            제목:<input type="text" defaultValue={crnotice.title} onChange={(e)=>{setCrnotice({...crnotice,title:e.target.value})}}/><br/>
            <span style={{float:"right"}}>
            {crnotice.red}
        </span>
           <NoticeData>

            <UserName>
            이메일:<input type="text" defaultValue={crnotice.username} onChange={(e)=>{setCrnotice({...crnotice,username:e.target.value})}}/><br/>
            닉네임:<input type="text" defaultValue={crnotice.nickname} onChange={(e)=>{setCrnotice({...crnotice,nickname:e.target.value})}}/><br/>
            </UserName>
          
            <Weatherdata>
                기온:<input type="number" style={{width:"35px"}}
                defaultValue={crnotice.temp} onChange={(e)=>{setCrnotice({...crnotice,sky:e.target.value})}}/> 
                하늘상태:<Sky setskyvalue={setSky} devalue={sky}/>   
                강수형태:<Pty setptyvalue={setPty} devalue={pty}/>   
                강수량:<input type="text" style={{width:"50px"}}
                 defaultValue={crnotice.rain} 
                 onChange={(e)=>{setCrnotice({...crnotice,pty:e.target.value})}}/> 
                mm 미만
            </Weatherdata>
            </NoticeData>
            <MainData>
            <ReactQuill
            ref={quillref}
            style={{width:"1000px",height:"70%"}}//스타일
            modules={modules}
            value={crnotice.text}
            onChange={texthandler}
            />
            <br/><br/>
            </MainData>
        <ImageList>
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
            </ImageList>
            <button onClick={()=>{onupdate()}}>수정완료</button>
            <button onClick={()=>{setisupdate(false)}}>수정취소</button>
            </Main>
        </Wrapper>
    )
}