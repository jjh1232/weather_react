import React from "react"
import ReactQuill from "react-quill"
import styled from "styled-components"
import { useRef } from "react"
import { useMemo,useState } from "react"
import CreateAxios from "../CreateAxios"
import { Sky,Pty } from "./Weathersetting"
import { useCookies } from "react-cookie"
import NoticeDetach from "../NoticeDetach"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faImages} from '@fortawesome/free-regular-svg-icons'
import "react-quill/dist/quill.snow.css"
import { Button } from "../../admin/AdminUI"
import { useToast } from "../../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../../config/api";
//=====================================================================
// 게시글 작성 모달.
//
// 수정 모달(AdminNoticeupdate)과 완전히 같은 문제를 갖고 있었다.
//   Modalin   : left:31%, top:5%, 900x700 고정
//   Exitbutton: left:27.5% 에 fixed - X 가 모달 밖 표 위에 찍혔다
//   Weatherbox: float:right + right:10%
//   ReactQuill: height:85% + left:10% 인라인
// 두 화면은 같은 모양이어야 하므로 스타일도 같은 것을 쓴다.
//=====================================================================

const Modalout=styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
`

const Modalin=styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: min(980px, 100%);
    max-height: min(90vh, 860px);
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusLg};
    box-shadow: ${(props)=>props.theme.shadowLg};
    overflow: hidden;
`

const Head=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;
    padding: 14px 18px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Headtitle=styled.h2`
    margin: 0;
    font-size: 16px;
    font-weight: 750;
    letter-spacing: -0.02em;
`
const Headsub=styled.span`
    font-size: 12.5px;
    color: ${(props)=>props.theme.textFaint};
`
const Closebutton=styled.button`
    margin-left: auto;
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: none;
    color: ${(props)=>props.theme.textMuted};
    font-size: 17px;
    line-height: 1;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{
        background: ${(props)=>props.theme.surfaceHover};
        color: ${(props)=>props.theme.text};
    }
`

const Body=styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 18px;
    display: flex;
    flex-direction: column;
    gap: 14px;
`

//작성자 / 날씨를 좌우로. 좁으면 자동으로 한 줄씩 내려간다.
const Toprow=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
`
const Section=styled.fieldset`
    margin: 0;
    padding: 12px 14px 14px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Legend=styled.legend`
    padding: 0 6px;
    font-size: 12.5px;
    font-weight: 700;
    color: ${(props)=>props.theme.text};
`
const Grid=styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
`
const Field=styled.label`
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
`
const Fieldname=styled.span`
    font-size: 11.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
//select(Sky/Pty)도 같은 모양이 되도록 자손까지 지정한다
const Control=styled.div`
    display: flex;
    align-items: center;
    gap: 6px;

    input, select{
        width: 100%;
        min-width: 0;
        height: 34px;
        padding: 0 10px;
        border: 1px solid ${(props)=>props.theme.border};
        border-radius: ${(props)=>props.theme.radiusSm};
        background: ${(props)=>props.theme.surface};
        color: ${(props)=>props.theme.text};
        font-size: 13.5px;
        outline: none;
        transition: border-color ${(props)=>props.theme.transition},
                    box-shadow ${(props)=>props.theme.transition};
    }
    input:focus, select:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
const Unit=styled.span`
    flex-shrink: 0;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
    white-space: nowrap;
`

//제목 줄 - 입력칸이 폭을 다 쓰고 이미지함 버튼만 오른쪽에
const Titlerow=styled.div`
    display: flex;
    align-items: flex-end;
    gap: 8px;
`
const Imagebutton=styled.button`
    flex-shrink: 0;
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border: 1px solid ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.$on
        ? props.theme.accentSoft
        : props.theme.surface};
    color: ${(props)=>props.$on
        ? props.theme.accent
        : props.theme.textMuted};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    &:hover{ border-color: ${(props)=>props.theme.accent}; }
`

/* 에디터. Quill 은 높이를 스스로 못 잡아서 감싼 쪽이 정해줘야 한다.
   예전엔 height:85% + left:10% 를 인라인으로 줘서 툴바가 밀리고
   본문이 모달 밖으로 흘러나갔다. */
const Editorbox=styled.div`
    display: flex;
    flex-direction: column;
    /* 높이를 위아래로 묶어둔다. 안 묶으면 본문이 길거나 이미지가 크면
       에디터가 한없이 늘어나서 아래의 "글수정하기" 줄까지 밀려 내려간다. */
    height: clamp(260px, 42vh, 460px);
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radius};
    overflow: hidden;
    background: ${(props)=>props.theme.surface};

    .quill{ display: flex; flex-direction: column; flex: 1; min-height: 0; }
    .ql-toolbar{
        flex-shrink: 0;
        border: none;
        border-bottom: 1px solid ${(props)=>props.theme.border};
        background: ${(props)=>props.theme.surfaceAlt};
    }
    .ql-container{ border: none; flex: 1; min-height: 0; font-size: 14px; }
    /* 본문은 여기서만 스크롤된다 */
    .ql-editor{ height: 100%; overflow-y: auto; }

    /* ★ 이미지가 원본 크기 그대로 그려져서 에디터를 뚫고 나갔다.
       그래서 글 아래쪽으로 스크롤이 안 되는 것처럼 보였다. */
    .ql-editor img{
        max-width: 100%;
        height: auto;
        display: block;
    }

    /* 다크모드에서 툴바 아이콘이 검정 그대로라 안 보였다 */
    .ql-snow .ql-stroke{ stroke: ${(props)=>props.theme.textMuted}; }
    .ql-snow .ql-fill{ fill: ${(props)=>props.theme.textMuted}; }
    .ql-snow .ql-picker{ color: ${(props)=>props.theme.textMuted}; }
    .ql-editor.ql-blank::before{ color: ${(props)=>props.theme.textFaint}; }
`

//첨부 이미지함 - 모달 오른쪽에 붙는 패널
const DetachBox=styled.div`
    position: absolute;
    top: 57px;
    right: 0;
    bottom: 62px;
    width: min(280px, 60%);
    z-index: 5;
    overflow-y: auto;
    padding: 10px;
    border-left: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surface};
    box-shadow: ${(props)=>props.theme.shadow};
`

const Foot=styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    flex-shrink: 0;
    padding: 12px 18px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`

export default function AdminNoticecreate(props){
    //quill관련
     const [cookie,Setcookie,removecookie]=useCookies();
    const axiosinstance=CreateAxios();
    const toast=useToast();
    const [islibe,setIslibe]=useState(false)
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
          
            const img=new Image();

            img.src=URL.createObjectURL(file);
          
            const formData=new FormData();

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
            
         
                     

       
                //온로드에 비동기를 줘서 받아야할듯 blob으로저장되는데 잘모루겟다 
        const result=await axiosinstance.post('/contentimage', formData)
        //서버에 미리저장후 이미지rul리턴받고 주소저장
        
        const IMG_URL = API_BASE+"/noticeimages/"+result.data;
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
            rain:cookie.weather.rn1.replace(regex,""),
            /* 서비스 글작성(Twitnoticecreate)은 습도·풍속도 같이 보내는데
               여기만 빠져 있어서, 관리자가 쓴 글은 상세에서 습도·풍속 자리가
               비어 있었다(칩이 "null%" 로 찍히던 원인). */
            reh:cookie.weather.reh,
            wsd:cookie.weather.wsd

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
            reh:crnotice.reh,
            wsd:crnotice.wsd,
            files:filelist
        }).then((res)=>{
            toast.success("게시글을 작성했습니다.")
            window.location.reload();
            
            
            
        }).catch((err)=>{
            toast.error(err)
        })
    
    }
    //이건첨부파일제거로하고 
const filedelete=(id,range)=>{
   
    
    setFilelist(filelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    quillref.current.getEditor().deleteText(range,1)
}

    const close=()=>props.setiscreate(false);

    return (
        <Modalout onMouseDown={close}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>게시글 작성</Headtitle>
                <Headsub>관리자</Headsub>
                <Closebutton type="button" onClick={close} title="닫기">×</Closebutton>
            </Head>

            <Body>
                <Toprow>
                    <Section>
                        <Legend>작성자</Legend>
                        <Grid>
                            <Field>
                                <Fieldname>이메일</Fieldname>
                                <Control>
                                    <input type="text" defaultValue={crnotice.username}
                                        onChange={(e)=>{setCrnotice({...crnotice,username:e.target.value})}}/>
                                </Control>
                            </Field>
                            <Field>
                                <Fieldname>닉네임</Fieldname>
                                <Control>
                                    <input type="text" defaultValue={crnotice.nickname}
                                        onChange={(e)=>{setCrnotice({...crnotice,nickname:e.target.value})}}/>
                                </Control>
                            </Field>
                        </Grid>
                    </Section>

                    <Section>
                        <Legend>날씨</Legend>
                        <Grid>
                            <Field>
                                <Fieldname>기온</Fieldname>
                                <Control>
                                    {/* 수정 모달과 똑같이 여기서 sky 를 덮어쓰고 있었다.
                                        기온을 고쳐도 저장되는 값은 쿠키에서 읽은 그대로였다. */}
                                    <input type="number" defaultValue={crnotice.temp}
                                        onChange={(e)=>{setCrnotice({...crnotice,temp:e.target.value})}}/>
                                    <Unit>℃</Unit>
                                </Control>
                            </Field>
                            <Field>
                                <Fieldname>하늘상태</Fieldname>
                                <Control><Sky setskyvalue={setSky} devalue={sky}/></Control>
                            </Field>
                            <Field>
                                <Fieldname>강수형태</Fieldname>
                                <Control><Pty setptyvalue={setPty} devalue={pty}/></Control>
                            </Field>
                            <Field>
                                <Fieldname>강수량</Fieldname>
                                <Control>
                                    {/* 여기는 pty 를 덮어쓰고 있었다 */}
                                    <input type="text" defaultValue={crnotice.rain}
                                        onChange={(e)=>{setCrnotice({...crnotice,rain:e.target.value})}}/>
                                    <Unit>mm 미만</Unit>
                                </Control>
                            </Field>
                        </Grid>
                    </Section>
                </Toprow>

                <Titlerow>
                    <Field style={{flex:1}}>
                        <Fieldname>제목</Fieldname>
                        <Control>
                            <input type="text" placeholder="제목을 입력하세요"
                                onChange={(e)=>{setCrnotice({...crnotice,title:e.target.value})}}/>
                        </Control>
                    </Field>
                    <Imagebutton type="button" $on={islibe} title="첨부 이미지함"
                        onClick={()=>{setIslibe(!islibe)}}>
                        <FontAwesomeIcon icon={faImages}/>
                    </Imagebutton>
                </Titlerow>

                <Editorbox>
                    <ReactQuill
                        ref={quillref}
                        modules={modules}
                        onChange={texthandler}
                        />
                </Editorbox>
            </Body>

            <Foot>
                <Button type="button" onClick={close}>취소</Button>
                <Button type="button" $variant="primary"
                    onClick={createtwitnotice}>글작성하기</Button>
            </Foot>

            {islibe &&
            <DetachBox>
                <NoticeDetach detachs={filelist} deletemethod={filedelete} setislibe={setIslibe}/>
            </DetachBox>}

        </Modalin>
        </Modalout>
    )
}
