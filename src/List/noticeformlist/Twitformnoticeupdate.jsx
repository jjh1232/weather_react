import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CreateAxios from "../../customhook/CreateAxios";
import styled from "styled-components";
import { useConfirm, useToast } from "../../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../../config/api";

//=====================================================================
// 글 수정(서비스). 피드 카드의 ··· 메뉴에서 연다.
//
// 고친 것
//  - 닫을 방법이 아예 없었다. props 로 setIsupdate 를 받아놓고
//    `const {noticeid}=props` 로 꺼내지도 않아, 한 번 열면 제출하거나
//    새로고침하기 전에는 빠져나올 수 없었다.
//  - Modalouter 가 width:45%; height:80%; top:10% 인데 left 가 없어서
//    position:fixed 의 기준이 흐름상 위치가 됐다. 이 모달은 피드 카드
//    (Noticefooter) 안에서 그려지므로 화면 한복판이 아니라 그 카드 언저리에
//    떴고, 어두운 배경도 화면의 45%만 덮었다.
//    body 로 포털해서 화면 전체를 덮게 한다.
//  - 본문 아래에 `확인할내용2:{newcontent}` 로 원본 HTML 이 그대로 찍히고 있었다.
//=====================================================================

const Modalout=styled.div`
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background: ${(props)=>props.theme.overlay};
    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
`
const Modalin=styled.div`
    display: flex;
    flex-direction: column;
    width: min(92vw, 780px);
    max-height: min(88vh, 820px);
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
const Field=styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
`
const Fieldname=styled.span`
    font-size: 12px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
`
const Input=styled.input`
    width: 100%;
    height: 40px;
    padding: 0 12px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.text};
    font-size: 14px;
    outline: none;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    &::placeholder{ color: ${(props)=>props.theme.textFaint}; }
    &:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
/* Quill 은 스스로 높이를 못 잡는다. 감싼 쪽이 정해주지 않으면 본문이 길거나
   이미지가 클 때 아래 버튼줄이 화면 밖으로 밀린다. */
const Editorbox=styled.div`
    display: flex;
    flex-direction: column;
    height: clamp(240px, 40vh, 420px);
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
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
    .ql-editor{ height: 100%; overflow-y: auto; }
    .ql-editor img{ max-width: 100%; height: auto; display: block; }

    /* 다크모드에서 툴바 아이콘이 검정 그대로라 안 보였다 */
    .ql-snow .ql-stroke{ stroke: ${(props)=>props.theme.textMuted}; }
    .ql-snow .ql-fill{ fill: ${(props)=>props.theme.textMuted}; }
    .ql-snow .ql-picker{ color: ${(props)=>props.theme.textMuted}; }
`
//첨부 목록
const Filelist=styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`
const Fileitem=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 6px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    min-width: 0;
`
const Filethumb=styled.img`
    flex-shrink: 0;
    width: 38px;
    height: 38px;
    object-fit: cover;
    border-radius: ${(props)=>props.theme.radiusSm};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Filename=styled.span`
    flex: 1;
    min-width: 0;
    font-size: 12px;
    color: ${(props)=>props.theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Empty=styled.div`
    padding: 14px 8px;
    text-align: center;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
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
const Button=styled.button`
    height: 36px;
    padding: 0 16px;
    border-radius: ${(props)=>props.theme.radiusPill};
    font-size: 13.5px;
    font-weight: 650;
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition},
                color ${(props)=>props.theme.transition};

    border: 1px solid ${(props)=>props.$primary
        ? "transparent"
        : props.theme.border};
    background: ${(props)=>props.$primary
        ? props.theme.accent
        : props.theme.surface};
    color: ${(props)=>props.$primary
        ? "#fff"
        : props.theme.textMuted};

    &:hover:not(:disabled){
        background: ${(props)=>props.$primary
            ? props.theme.accentHover
            : props.theme.surfaceHover};
        color: ${(props)=>props.$primary?"#fff":props.theme.text};
    }
    &:disabled{ opacity:.45; cursor:default; }
`
const Smallbutton=styled.button`
    flex-shrink: 0;
    height: 24px;
    padding: 0 9px;
    border-radius: ${(props)=>props.theme.radiusPill};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surface};
    color: ${(props)=>props.theme.textMuted};
    font-size: 11.5px;
    font-weight: 600;
    cursor: pointer;

    &:hover{
        border-color: ${(props)=>props.theme.warning};
        color: ${(props)=>props.theme.warning};
    }
`

export default function Twitformnoticeupdate(props){

    //setIsupdate 를 안 받고 있어서 닫기가 불가능했다
    const {noticeid,setIsupdate}=props
    const [cookie]=useCookies(['userinfo']);
    const toast=useToast();
    const confirm=useConfirm();

    const [newtitle,setNewtitle]=useState("")
    //quill을 사용할떈 하나로묶어서 못쓰겟음온채인지에그냥셋콘탠트너음
    const [newcontent,setNewcontent]=useState("");
    const [saving,setSaving]=useState(false);

    const quillref=useRef();
    const axiosinstance=CreateAxios();

    //그냥 이미지로쓰는거와 첨부는 따로 쓰자
    const [newfilelist,setNewfilelist]=useState([])
    const fileindex=useRef(0)

    const close=()=>{ if(setIsupdate) setIsupdate(false) };

    const prevdataget=()=>{
        axiosinstance.get(`noticeupdate/${noticeid}`)
        .then((res)=>{
            setNewtitle(res.data.title||"")
            setNewcontent(res.data.text||"")
            const files=res.data.detachfiles||[];
            setNewfilelist(files)
            fileindex.current=files[files.length-1]?.idx||0
        }).catch((err)=>{
            toast.error(err)
        })
    }

const imagehandler=()=>{
    //인풋 생성
    const input =document.createElement("input")
    input.setAttribute("type","file");
    input.setAttribute("accept","image/*")
    //그걸클릭한효과
    input.click();

    input.onchange=async ()=>{
        const file=input.files[0];
        const formData=new FormData();
        const img=new Image();

            img.src=URL.createObjectURL(file);

           img.onload=async()=>{
                const canvas=document.createElement(`canvas`)
                const ctx=canvas.getContext(`2d`)
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
                canvas.width=width
                canvas.height=height

                ctx.drawImage(img,0,0,canvas.width,canvas.height);
                //캔버스를 데이터로 나타내고 이후 다시 파일로 변경
              const files=canvas.toDataURL("image/png")

              let blobBin=atob(files.split(`,`)[1]); //base64데이터디코딩
                   var array=[];
                for(var i=0;i<blobBin.length;i++){
                    array.push(blobBin.charCodeAt(i));
                }
                let profile=new Blob([new Uint8Array(array)],{type:`image/png`});
                //폼에 새이미지파일추가
                formData.append("image",profile);

        try{
            const result = await axiosinstance.post('/contentimage', formData)
            const imgurl = API_BASE+"/noticeimages/"+result.data;

            //ref를이용해 에디터구함
            const editor=quillref.current.getEditor();
            //에디터의 현재위치
            const range=editor.getSelection();
            //이미지붙여넣기 (위치인덱스,자료형,해당파일url)
            editor.insertEmbed(range.index,`image`,imgurl)
            //커서위치조정
            editor.setSelection(range.index+1)
            //파일리스트에저장
            setNewfilelist((filelist)=>[...filelist,{
                idx:fileindex.current,
                rangeindex:range.index,
                filename:file.name,
                path:imgurl
            }])
            fileindex.current+=1;
        }
        catch(error){
            toast.error("이미지를 올리지 못했습니다.")
        }
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
const filedelete=async(id,range)=>{
    const ok=await confirm({
        title:"첨부를 목록에서 지울까요?",
        description:"목록에서만 빠지고 본문에 넣은 이미지는 그대로 남습니다.",
        confirmText:"제거",
        danger:true,
    })
    if(!ok) return;
    setNewfilelist(newfilelist.filter((prev)=>prev.id !==id))
    //이거 너무마음에안들어서 아마 에디터를 새로만들어야할듯?
    //quillref.current.getEditor().deleteText(range,1)
}

//제출
const twitnoticecreate=()=>{
    setSaving(true);
    axiosinstance.put(`/noticeupdate/${noticeid}`,{
        username:cookie.userinfo["username"],
        nickname:cookie.userinfo["nickname"],
        title:newtitle,
        text:newcontent,
        detach:newfilelist
    }).then((res)=>{
        //사실어차피리로드해야해서리..
        window.location.reload();
    }).catch((err)=>{
        setSaving(false);
        toast.error(err)
    })
}

useEffect(()=>{
    prevdataget()
},[])

//ESC 로 닫기
useEffect(()=>{
    const onkey=(e)=>{ if(e.key==="Escape") close() }
    document.addEventListener("keydown",onkey)
    return ()=>document.removeEventListener("keydown",onkey)
},[])

    const files=(newfilelist||[]).filter((f)=>f&&f.path);

    /* 이 모달은 피드 카드 안에서 그려진다. 카드에는 overflow/transform 이
       걸려 있을 수 있어 화면 전체를 덮으려면 body 로 포털해야 한다. */
    return ReactDOM.createPortal(
        <Modalout onMouseDown={close}>
        <Modalin onMouseDown={(e)=>e.stopPropagation()}>

            <Head>
                <Headtitle>글 수정</Headtitle>
                <Headsub>{cookie.userinfo?.nickname}</Headsub>
                <Closebutton type="button" onClick={close} title="닫기(Esc)">×</Closebutton>
            </Head>

            <Body>
                <Field>
                    <Fieldname>제목</Fieldname>
                    <Input value={newtitle} placeholder="제목을 입력하세요"
                        onChange={(e)=>{setNewtitle(e.target.value)}}/>
                </Field>

                <Field as="div">
                    <Fieldname>내용</Fieldname>
                    <Editorbox>
                        <ReactQuill
                            modules={modules}
                            onChange={setNewcontent}
                            ref={quillref}
                            value={newcontent}/>
                    </Editorbox>
                </Field>

                <Field as="div">
                    <Fieldname>첨부 이미지 {files.length}장</Fieldname>
                    {files.length===0
                        ? <Empty>첨부된 이미지가 없습니다.</Empty>
                        : <Filelist>
                            {files.map((list,index)=>(
                                <Fileitem key={list.id??index}>
                                    <Filethumb src={API_BASE+list.path} alt=""/>
                                    <Filename title={list.filename}>{list.filename}</Filename>
                                    <Smallbutton type="button"
                                        onClick={()=>{filedelete(list.id,list.rangeindex)}}>제거</Smallbutton>
                                </Fileitem>
                            ))}
                          </Filelist>}
                </Field>
            </Body>

            <Foot>
                <Button type="button" onClick={close}>취소</Button>
                <Button type="button" $primary
                    disabled={saving||!newtitle||!newtitle.trim()}
                    onClick={twitnoticecreate}>수정완료</Button>
            </Foot>

        </Modalin>
        </Modalout>,
        document.body)
}
