import React from "react"
import ReactQuill from "react-quill"
import styled from "styled-components"
import { useRef } from "react"
import { useMemo,useState } from "react"
import CreateAxios from "../CreateAxios"
import { Sky,Pty } from "./Weathersetting"
import { useCookies } from "react-cookie"
const Modalout=styled.div`
width:45% ;
height:85% ;
position: fixed;
background:rgba(0,0,0,0.5);
display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center; //위로부터 중간
`

const Modalin=styled.div`
padding: 15px;
width:90%;
height:70%;
background-color: #FFFFFF;
overflow: auto;
`

export default function AdminNoticecreate(props){
    //quill관련
     const [cookie,Setcookie,removecookie]=useCookies();
    const axiosinstance=CreateAxios();
    const quillref=useRef();
    const imagekey=useRef(0);
    const url=`/noticecreate`;
    const imageHandler=()=>{
        //인풋생성
        const input =document.createElement(`input`)
        input.setAttribute("type","file");
        input.setAttribute("accept","image/*");
        input.click()

        input.addEventListener(`change`,async()=>{
            //폼데이터로 파일 서버로보냄
            const file=input.files[0];
            //저장크기를 일정하게 해야할듯
            console.log("파일:"+file.filename)
            const img=new Image();

            img.src=URL.createObjectURL(file);
            console.log("이미지:"+img);
            console.log("이미지src:"+img.src);
            const formData=new FormData();

           img.onload=async()=>{
                const canvas=document.createElement(`canvas`)
                const ctx=canvas.getContext(`2d`)
                const scaleFactor=Math.min(1280/img.width,960/img.height);
                canvas.width=img.width*scaleFactor;
                canvas.height=img.height*scaleFactor;
                ctx.drawImage(img,0,0,canvas.width,canvas.height);

              const files=canvas.toDataURL("image/png")
              let blobBin=atob(files.split(`,`)[1]); //base64데이터디코딩
                   var array=[];
                for(var i=0;i<blobBin.length;i++){
                    array.push(blobBin.charCodeAt(i));
                }
                let profile=new Blob([new Uint8Array(array)],{type:`image/png`});
                console.log(profile)
                
                formData.append("image",profile);
            
            
                      


       

        const result=await axiosinstance.post('/contentimage', formData)
        //서버에 미리저장후 이미지rul리턴받고 주소저장
        
        const IMG_URL = process.env.PUBLIC_URL+"/noticeimages/"+result.data;
        console.log("이미지유알엘"+IMG_URL)
            //에디터객체 가져오기
        const editor=quillref.current.getEditor();
           // 2. 현재 에디터 커서 위치값을 가져온다
           const range = editor.getSelection();  
           //에디터에 삽입
           editor.insertEmbed(range.index, 'image', IMG_URL);//인덱스 ,타입 ,밸류
           setFilelist(filelist=>[...filelist,{
            idx:imagekey.current,
            index:range.index,
            filename:file.name,
            url:IMG_URL}])
            //이미지번호를위해
          imagekey.current+=1;
           //onload마무리괄호 
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
    //게시글정보
    //강수량때매 정규식추가
    const regex=/[^0-9]/g;

    const [crnotice,setCrnotice]=useState(
        {
            username:cookie.userinfo.username,
            nickname:cookie.userinfo.nickname,
            title:'',
            text:'',
            temp:cookie.weather.t1H,
            rain:cookie.weather.rn1.replace(regex,"")

        }
    )
    const [sky,setSky]=useState(cookie.weather.sky);
    const [pty,setPty]=useState(cookie.weather.pty);
    //파일정보
      const [filelist,setFilelist]=useState([{
      idx:0,
      index:0,
      filename:'',
      url:''
      }   
        
      ])
    
    //quill text
      const texthandler=(text)=>{
        setCrnotice({...crnotice,text:text})
      }
      //게시글작성
      const createtwitnotice=()=>{
   
        
        axiosinstance.post("/noticecreate",{
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
    quillref.current.getEditor().deleteText(range,1)
}

    return (
        <>
        <button onClick={()=>{props.setiscreate(false)}}>창닫기</button>
        <Modalout>
        <Modalin>
            <div>
                기온:<input type="number" defaultValue={crnotice.temp} onChange={(e)=>{setCrnotice({...crnotice,sky:e.target.value})}}/> 
                하늘상태:<Sky setskyvalue={setSky} devalue={crnotice.sky}/>   {sky}
                강수형태:<Pty setptyvalue={setPty} devalue={crnotice.pty}/>   {pty}
                강수량:<input type="text" defaultValue={crnotice.rain} onChange={(e)=>{setCrnotice({...crnotice,pty:e.target.value})}}/> 
                mm 미만
            </div>
            
            이메일:<input type="text" defaultValue={crnotice.username} onChange={(e)=>{setCrnotice({...crnotice,username:e.target.value})}}/><br/>
            닉네임:<input type="text" defaultValue={crnotice.nickname} onChange={(e)=>{setCrnotice({...crnotice,nickname:e.target.value})}}/><br/>
            제목:<input type="text" onChange={(e)=>{setCrnotice({...crnotice,title:e.target.value})}}/><br/>
            내용:<ReactQuill
            ref={quillref}
            style={{width:"90%",height:"70%"}}//스타일
            modules={modules}
            onChange={texthandler}
            />
            <br/><br/><br/>
            
             
        첨부목록:{filelist&&filelist.map((list,key)=>{
            
                if(list.url===``){

                }else{
            return (
                <>
                <span key={key}>
                    
                    {list.filename}
                    <button onClick={()=>{filedelete(list.id,list.index)}}>제거</button>
                <br/>아이디값:{list.idx}
                </span>
                <br/>
                </>
                
            )
                }
        })}

            <button onClick={createtwitnotice}>글작성하기</button>
        </Modalin>

        </Modalout>
        </>
    )
}