import React from "react";
import styled from "styled-components";
import { useCookies } from "react-cookie";
import { useState,useEffect,useRef ,useMemo} from "react";
import CreateAxios from "../CreateAxios";
import ReactQuill from "react-quill";
import { Sky,Pty } from "./Weathersetting";
import NoticeDetach from "../NoticeDetach";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faImages} from '@fortawesome/free-regular-svg-icons'
const Modalout=styled.div`
width:100% ;
height:100% ;

top: 0%;
left :0%;
position: fixed;
background:rgba(0,0,0,0.5);
z-index: 10;

`

const Modalin=styled.div`
padding: 10px;
width: 900px;
height: 700px;
top: 5%;
left:31%;
position: fixed;
background-color: #FFFFFF;
//overflow: auto;
`
const Exitbutton  =styled.div`
position: fixed;
top: 0%;
left:27.5%;
width: 5%;
height: 10%;

display: inline-block;


 &::before {
    content: "";
    width: 80px;
    top: 40%;
    left: 0%;
    position: absolute;
    border-bottom: 10px solid black;
    transform:  rotate(45deg);
  }

  &::after {
    top: 40%;
    
    content: "";
    width: 80px;
    left:0%;
    position: absolute;
    border-bottom: 10px solid black;
    transform:  rotate(-45deg);
  }
`

const Weatherbox=styled.div`
    position: relative;
    float: right;
    right: 10%;
    bottom:0%;
    width: 40%;
    //width: 300px;
    min-width: 100px;
    border: 1px solid black;
`
const UserDatabox=styled.div`
    
    width:50%;
    left: -0.7%;
    position: relative;
    
`
const Title=styled.div`
    position: relative;
    float: left;
    left:0%;
`
const Noticebox=styled.div`
    width: 100%;
    height: 100%;
    top:1%;
    position: relative;
    //border: 1px solid black;
`
const DetachBox=styled.div`
    border:1px solid gray;
    position: absolute;
    float: right;
    top: 17.3%;
    right: 0%;
    width: 20%;
    height: 74.4%;
    z-index: 10;
    background-color: white;
    
`
const UpdateButton=styled.button`
    width: 85px;
    height: 50px;
    position: relative;
    left:40%;
    top:-3.2%;
    float: right;
    font-size: 15px;
padding: 1% 0%;
color: black;
//margin: px 1px 1px;//위옆아래 마진
border-radius: 10px; //모서리
text-align: center;
transition: top .04s linear;
text-shadow: 0 1px 0 rgba(0,0,0,0.15);
background-color: green;

`

export default function AdminNoticeupdate(props){
    const [cookie,Setcookie,removecookie]=useCookies();
    const {noticeid,setisupdate}=props;
    const axiosinstance=CreateAxios();
    const quillref=useRef();
    const imagekey=useRef(0);
    const [islibe,setIslibe]=useState(false)    

     //게시글정보
    //강수량때매 정규식추가
    const regex=/[^0-9]/g;

    const [crnotice,setCrnotice]=useState(
        {
            noticeid:``,
            username:``,
            nickname:``,
            title:'',
            text:'',
            temp:``,
            rain:``

        }
    )
    const [sky,setSky]=useState();
    const [pty,setPty]=useState();
    //파일정보
      const [filelist,setFilelist]=useState([{
      idx:0,
      rangeindex:0,
      filename:'',
      path:''
      }   
        
      ])
      
    
      useEffect(()=>{
        prevdataget()
      },[])
      const prevdataget=()=>{
        axiosinstance.get(`/admin/noticedetail/${noticeid}`)
        .then((res)=>{
            console.log(res)
           setCrnotice({
            noticeid:res.data.num,
            username:res.data.username,
            nickname:res.data.nickname,
            title:res.data.title,
            text:res.data.text,
            temp:res.data.temp,
            rain:res.data.rain.replace(regex,"")
           })
           setSky(res.data.sky)
           setPty(res.data.pty)
            setFilelist(res.data.detachfiles)
            imagekey.current=res.data.detachfiles[res.data.detachfiles.length-1].idx
            console.log("사이즈값:"+res.data.detachfiles[res.data.detachfiles.length-1].idx)
        }).catch((err)=>{
            console.log("수정데이터가져오기오류")
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
            const img=new Image();

            img.src=URL.createObjectURL(file);
          
           

           img.onload=async()=>{
                const canvas=document.createElement(`canvas`)
                const ctx=canvas.getContext(`2d`)
                //이미지 저장식인데 너무큰듯?
               // const scaleFactor=Math.min(1280/img.width,960/img.height);
               //일단 목적은 고정이라 고정해씀
               const maxsize=720;
               let width=img.width;
               let height=img.height;
               if(width>height){
                    if(width>maxsize){
                        height *=maxsize/width;
                        width=maxsize;
                    }
               }else{
                    if(height>maxsize){
                        width *=maxsize/height;
                        height=maxsize;
                    }
               }
                canvas.width=width //img.width*scaleFactor;
                canvas.height=height//img.height*scaleFactor;

                ctx.drawImage(img,0,0,canvas.width,canvas.height);
                //캔버스를 데이터로 나타내고 이후 다시 파일로 변경
              const files=canvas.toDataURL("image/png")
              
              let blobBin=atob(files.split(`,`)[1]); //base64데이터디코딩
                   var array=[];
                for(var i=0;i<blobBin.length;i++){
                    array.push(blobBin.charCodeAt(i));
                }
                let profile=new Blob([new Uint8Array(array)],{type:`image/png`});
                console.log(profile)
                //폼에 새이미지파일추가
                formData.append("image",profile);
        

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
   
    //quill text
      const texthandler=(text)=>{
        setCrnotice({...crnotice,text:text})
      }
      //게시글작성
      const createtwitnotice=()=>{
   
        
        axiosinstance.put(`/admin/noticeupdate/${crnotice.noticeid}`,{
            username:crnotice.username,
            nickname:crnotice.nickname,
            title:crnotice.title,
            text:crnotice.text,
            temp:crnotice.temp,
            sky:sky,
            pty:pty,
            rain:crnotice.rain+"mm 미만",
            files:filelist
        }).then((res)=>{
            alert("글작성성공")
            window.location.reload();
            
            
            
        }).catch((err)=>{
            alert("에러"+err)
        })
    
    }
    //이건첨부파일제거로하고 
const filedelete=(id,range)=>{
   
    
    setFilelist(filelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    //에디터에는 넣어뒀던 첨부파일이 안들어가는듯;
    quillref.current.getEditor().deleteText(range,1)
}

    return (
        <>
       
        <Modalout>
       
        <Modalin>
        <Exitbutton onClick={()=>{setisupdate(false)}}/>
            
            <Weatherbox>
                <div style={{float:"left",textAlign:"left" ,border:"1px solid black",width:"100%"}}>
                기온:<input type="number" 
                defaultValue={crnotice.temp} 
                onChange={(e)=>{setCrnotice({...crnotice,sky:e.target.value})}}
                style={{width:"40px"}}
                /> 
                하늘상태:<Sky setskyvalue={setSky} devalue={sky}/>   
                </div>
                <div style={{float:"left",textAlign:"left" ,border:"1px solid black",width:"100%"}}>
                강수형태:<Pty setptyvalue={setPty} devalue={pty}/> 

                강수량:<input type="text" 
                defaultValue={crnotice.rain} 
                onChange={(e)=>{setCrnotice({...crnotice,pty:e.target.value})}}
                style={{width:"30px"}}
                /> 
                mm 미만
                </div>
            </Weatherbox>
           < UserDatabox>
            이메일:<input type="text" defaultValue={crnotice.username} 
            onChange={(e)=>{setCrnotice({...crnotice,username:e.target.value})}}/>
            닉네임:<input type="text" defaultValue={crnotice.nickname}
             onChange={(e)=>{setCrnotice({...crnotice,nickname:e.target.value})}}/><br/>
          
           </UserDatabox>
           
           <UpdateButton onClick={createtwitnotice}>글수정하기</UpdateButton>
           <Noticebox>
            <Title>
            제목:<input type="text" 
            defaultValue={crnotice.title} 
            onChange={(e)=>{setCrnotice({...crnotice,title:e.target.value})}}
            style={{width:"300px"}}
            />
            </Title>
              {
            //폰트받아온거사용
           }
            <FontAwesomeIcon icon={faImages} onClick={()=>{setIslibe(!islibe)}}
            style={{cursor:"pointer"}}
        />
           
        <ReactQuill
            ref={quillref}
            style={{width:"100%",height:"85%",left:"10%"}}//스타일
            modules={modules}
            value={crnotice.text}
            onChange={texthandler}
            />
            <br/><br/>

            </Noticebox>

        

        

        {islibe?
        <DetachBox>
        <NoticeDetach detachs={filelist} deletemethod={filedelete} setislibe={setIslibe}/>
        </DetachBox>
        :""} 
        
       
        
            
        </Modalin>

        </Modalout>
        </>
    )
}