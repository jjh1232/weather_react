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
import "react-quill/dist/quill.snow.css"
import { Button } from "../../admin/AdminUI";
import { useToast } from "../../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../../config/api";
//=====================================================================
// 게시글 수정 모달.
//
// 예전에는 요소마다 position:fixed/absolute + % 좌표였다.
//   Modalin  : left:31%, top:5%, 900x700 고정
//   Exitbutton: left:27.5% 에 fixed - 그래서 X 가 모달 밖 허공에 떠 있었다
//   Weatherbox: float:right + right:10%
//   DetachBox : top:17.3%, height:74.4%
// 창 크기가 조금만 달라져도 전부 어긋나서 날씨칸이 제목 위로 올라오고
// X 는 표 위에 찍혔다. 좌표를 걷어내고 flex/grid 로 다시 짰다.
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

export default function AdminNoticeupdate(props){
    const [cookie,Setcookie,removecookie]=useCookies();
    const {noticeid,setisupdate}=props;
    const axiosinstance=CreateAxios();
    const toast=useToast();
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
        const IMG_URL = API_BASE+"/noticeimages/"+result.data;
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
            toast.success("게시글을 수정했습니다.")
            window.location.reload();
            
            
            
        }).catch((err)=>{
            toast.error(err)
        })
    
    }
    //이건첨부파일제거로하고 
const filedelete=(id,range)=>{
   
    
    setFilelist(filelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    //에디터에는 넣어뒀던 첨부파일이 안들어가는듯;
    quillref.current.getEditor().deleteText(range,1)
}

/* 이미지 한 장을 "준비된 차단 이미지"로 교체한다.
   본문(notice.text)의 <img src> 치환은 서버(adminService.banimage)가 한다.
   여기서 따로 바꾸면 "글수정하기"를 눌러야만 반영되고, 안 누르고 닫으면
   첨부목록만 차단으로 보이는 어긋난 상태가 된다.
   화면에 보이는 것만 서버 결과에 맞춰 갱신한다. */
const BANIMAGE="/front/Subimages/chdan.png";

//서버가 붙이는 차단 주소와 같은 규칙(adminService.bannedurl)
const bannedurl=(id)=>`${BANIMAGE}?ban=${id}`;

//에디터에 열어둔 본문의 <img src> 도 서버와 같은 모습이 되게 맞춰준다
const swapinbody=(from,to)=>{
    setCrnotice((prev)=>({
        ...prev,
        text:(prev.text||"").split(API_BASE+from)
                            .join(API_BASE+to)
    }))
}

const imageban=(data)=>{
    axiosinstance.put(`/admin/imageban/${data.id}`)
    .then(()=>{
        const banned=bannedurl(data.id);
        swapinbody(data.path,banned);
        //복구 버튼이 뜨려면 originalpath 도 화면 상태에 들고 있어야 한다
        setFilelist((prev)=>prev.map((f)=>
            f.id===data.id?{...f,path:banned,originalpath:data.path}:f))

        toast.success("차단 이미지로 바꿨습니다.")
    }).catch((err)=>{
        toast.error(err)
    })
}

const imagerestore=(data)=>{
    axiosinstance.put(`/admin/imagerestore/${data.id}`)
    .then(()=>{
        swapinbody(data.path,data.originalpath);
        setFilelist((prev)=>prev.map((f)=>
            f.id===data.id?{...f,path:data.originalpath,originalpath:null}:f))

        toast.success("차단을 해제했습니다.")
    }).catch((err)=>{
        toast.error(err)
    })
}

    const close=()=>setisupdate(false);

    return (
        <Modalout onMouseDown={close}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>게시글 수정</Headtitle>
                <Headsub>#{crnotice.noticeid}</Headsub>
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
                                    {/* 예전엔 여기서 sky 를 덮어썼다(setCrnotice({...crnotice, sky:...})).
                                        그래서 기온을 고쳐도 저장되는 값은 그대로였다. */}
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
                                    {/* 위와 같은 실수로 여기는 pty 를 덮어쓰고 있었다 */}
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
                            <input type="text" defaultValue={crnotice.title}
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
                        value={crnotice.text}
                        onChange={texthandler}
                        />
                </Editorbox>
            </Body>

            <Foot>
                <Button type="button" onClick={close}>취소</Button>
                <Button type="button" $variant="primary"
                    onClick={createtwitnotice}>글수정하기</Button>
            </Foot>

            {islibe &&
            <DetachBox>
                <NoticeDetach detachs={filelist} deletemethod={filedelete}
                    banmethod={imageban} restoremethod={imagerestore}
                    setislibe={setIslibe}/>
            </DetachBox>}

        </Modalin>
        </Modalout>
    )
}
