import React, { useEffect, useMemo, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import ReactQuill from "react-quill";
import CreateAxios from "../../customhook/CreateAxios";
import styled from "styled-components";
import * as Weatherpa from "../../UI/Noticetools/Weatherpar"
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun } from "@fortawesome/free-solid-svg-icons";
import { faCloud } from "@fortawesome/free-solid-svg-icons";
import { faCloudRain } from "@fortawesome/free-solid-svg-icons";
import { faTemperatureLow } from "@fortawesome/free-solid-svg-icons";
import { faDroplet } from "@fortawesome/free-solid-svg-icons";
import { faWind } from "@fortawesome/free-solid-svg-icons";
import { handletext } from "../../customhook/Userhandle";
import profileimage from "../../UI/profileimage";
import { API_BASE } from "../../config/api";
/* ─────────────────────────────────────────────────────────────
   글쓰기 모달.
   원래 개발용 뼈대 그대로였다 - 날씨는 "30,강수없음,맑음,없음 ,75,2" 처럼
   값을 쉼표로 이어붙여 찍었고, 제목은 맨살 input, 화면 아래엔
   절대경로/파일인덱스/본문HTML 같은 디버그 출력이 그대로 노출돼 있었다.
   ───────────────────────────────────────────────────────────── */

const Wrapper=styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    width:100%;
    height: 100%;
    color: ${(props)=>props.theme.text};
`
/* 작성자 + 날씨 한 줄. 날씨는 오른쪽 위. */
const Topbar=styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    padding-bottom: 12px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
`
const Writerimg=styled.img`
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Writertext=styled.div`
    display: flex;
    flex-direction: column;
    min-width: 0;
`
const Writername=styled.div`
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.02em;
    white-space: nowrap;
`
const Writerhandle=styled.div`
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`
/* 지금 날씨가 글에 자동으로 붙는다는 걸 보여주는 자리 */
const Weathercss=styled.div`
    margin-left: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 3px;
    flex-shrink: 0;
`
const Weatherlabel=styled.div`
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    color: ${(props)=>props.theme.textFaint};
`
const Weatherchips=styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
    justify-content: flex-end;
    padding: 5px 10px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Chip=styled.span`
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: ${(props)=>props.theme.textMuted};
    white-space: nowrap;

    b{
        color: ${(props)=>props.theme.text};
        font-weight: 600;
        font-variant-numeric: tabular-nums;
    }

    /* 칩 사이 가운뎃점 */
    & + &::before{
        content: "·";
        color: ${(props)=>props.theme.borderStrong};
        margin-right: 2px;
    }
`
const Chipicon=styled(FontAwesomeIcon)`
    font-size: 11px;
    color: ${(props)=>props.theme.accent};
`

const Field=styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`
const Label=styled.label`
    font-size: 12.5px;
    font-weight: 650;
    letter-spacing: -0.01em;
    color: ${(props)=>props.theme.textMuted};
`
const Titleinput=styled.input`
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border-radius: 10px;
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
    color: ${(props)=>props.theme.text};
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.01em;
    outline: none;
    transition: border-color ${(props)=>props.theme.transition},
                box-shadow ${(props)=>props.theme.transition};

    &::placeholder{
        color: ${(props)=>props.theme.textFaint};
        font-weight: 400;
    }
    &:focus{
        border-color: ${(props)=>props.theme.accent};
        box-shadow: 0 0 0 3px ${(props)=>props.theme.accentSoft};
    }
`
/* Quill 은 자기 색을 갖고 있어서 테마에 맞게 덮어써야 한다 */
const Editorbox=styled.div`
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: 10px;
    overflow: hidden;
    background: ${(props)=>props.theme.surfaceAlt};

    .ql-toolbar{
        border: none;
        border-bottom: 1px solid ${(props)=>props.theme.border};
        background: ${(props)=>props.theme.surface};
    }
    .ql-container{
        border: none;
        font-size: 14.5px;
        font-family: inherit;
    }
    .ql-editor{
        min-height: 260px;
        color: ${(props)=>props.theme.text};
    }
    .ql-editor.ql-blank::before{
        color: ${(props)=>props.theme.textFaint};
        font-style: normal;
    }
    /* 툴바 아이콘/글씨도 테마색으로 */
    .ql-stroke{ stroke: ${(props)=>props.theme.textMuted}; }
    .ql-fill{ fill: ${(props)=>props.theme.textMuted}; }
    .ql-picker-label{ color: ${(props)=>props.theme.textMuted}; }
    .ql-picker-options{
        background: ${(props)=>props.theme.surface};
        border-color: ${(props)=>props.theme.border};
    }
`
const Filelistbox=styled.div`
    display: flex;
    flex-direction: column;
    gap: 6px;
`
const Fileitem=styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: 8px;
    background: ${(props)=>props.theme.surfaceAlt};
    font-size: 12.5px;
    color: ${(props)=>props.theme.textMuted};
`
const Filename=styled.span`
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: ${(props)=>props.theme.text};
`
const Fileremove=styled.button`
    flex-shrink: 0;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 3px 10px;
    font-size: 11.5px;
    font-weight: 600;
    color: ${(props)=>props.theme.textMuted};
    background: ${(props)=>props.theme.surface};
    cursor: pointer;
    transition: color ${(props)=>props.theme.transition},
                border-color ${(props)=>props.theme.transition};

    &:hover{
        color: ${(props)=>props.theme.warning};
        border-color: ${(props)=>props.theme.warning};
    }
`
const Footer=styled.div`
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
`
const Submitbutton=styled.button`
    border: none;
    border-radius: ${(props)=>props.theme.radiusPill};
    padding: 10px 26px;
    font-size: 14px;
    font-weight: 650;
    letter-spacing: -0.01em;
    color: #fff;
    background: ${(props)=>props.theme.accent};
    cursor: pointer;
    transition: background ${(props)=>props.theme.transition},
                opacity ${(props)=>props.theme.transition};

    &:hover:not(:disabled){ background: ${(props)=>props.theme.accentHover}; }
    &:disabled{ opacity:.45; cursor: not-allowed; }
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
        id:0,
        index:0,
        filename:'',
        url:''
    }])
    let temp=cookie.weather.t1H
    let rain=cookie.weather.rn1
    let pty=cookie.weather.pty;
    let sky=cookie.weather.sky;
    let reh=cookie.weather.reh
    let wsd=cookie.weather.wsd

  
    //모듈 설정
    
    const fileindex=useRef(1)
const imagehandler=()=>{
    //인풋 생성
    console.log("이미지핸들러시작")
    const input =document.createElement("input")
    input.setAttribute("type","file");
    input.setAttribute("accept","image/*")
    input.setAttribute("multiple","multiple")
    //그걸클릭한효과
    input.click();

    input.onchange=()=>{
        console.log("이미지핸들러온채인지")
        const files=input.files;
       if(!files || files.length===0) return ;
       Array.from(files).forEach((file)=>{
        const formdata=new FormData();
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
                console.log("이미지width:"+width)
                console.log("이미지height:"+height)
                ctx.drawImage(img,0,0,canvas.width,canvas.height);
                //캔버스를 데이터로 나타내고 이후 다시 파일로 변경
              const base64=canvas.toDataURL("image/png")
              
              let blobBin=atob(base64.split(`,`)[1]); //base64데이터디코딩
                   var array=[];
                for(var i=0;i<blobBin.length;i++){
                    array.push(blobBin.charCodeAt(i));
                }
                let profile=new Blob([new Uint8Array(array)],{type:`image/png`});
                console.log(profile)
                //폼에 새이미지파일추가
                formdata.append("image",profile);
        
        
        try{
            
            const result = await axiosinstance.post('/contentimage', formdata)
            
            
            const imgurl =API_BASE+"/noticeimages/"+result.data;
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
                idx:fileindex.current,
                index:range.index,
                filename:file.name,
                url:imgurl
                


            }])
            console.log("파일리스트저장종료")
            fileindex.current+=1;
        }
        catch(error){
            console.log("에러")
        }
    }})
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
        reh:reh,
        wsd:wsd,
        files:filelist
    }).then((res)=>{
        alert("글작성성공")
        props.setIscreate(false)
        //목록 새로고침. 안 넘겨준 화면도 있어서 있을 때만 부른다.
        //(예전엔 여기가 주석 처리돼 있어서 새 글이 목록에 안 나타났다)
        if(props.redataget){
            props.redataget();
        }
        
        
        
    })

}

    //하늘 상태에 맞는 아이콘 하나만 고른다(비/눈이면 비구름)
    const skyicon = (pty!=="0"&&pty!==0) ? faCloudRain : (sky==="1"?faSun:faCloud);

    return (
        <Wrapper>

            {/* 작성자 + 지금 날씨 */}
            <Topbar>
                <Writerimg src={profileimage(cookie.userinfo["profileimg"])} alt=""/>
                <Writertext>
                    <Writername>{cookie.userinfo["nickname"]}</Writername>
                    <Writerhandle>
                        {handletext(cookie.userinfo["profileid"],cookie.userinfo["username"])}
                    </Writerhandle>
                </Writertext>

                <Weathercss>
                    <Weatherlabel>글에 함께 기록되는 지금 날씨</Weatherlabel>
                    <Weatherchips>
                        <Chip>
                            <Chipicon icon={skyicon}/>
                            {Weatherpa.getsky(sky)}
                            {Weatherpa.getpty(pty)&&Weatherpa.getpty(pty)!=="없음"
                                ? ` · ${Weatherpa.getpty(pty)}` : ""}
                        </Chip>
                        <Chip><Chipicon icon={faTemperatureLow}/><b>{temp}</b>°C</Chip>
                        <Chip><Chipicon icon={faDroplet}/><b>{reh}</b>%</Chip>
                        <Chip><Chipicon icon={faWind}/><b>{wsd}</b>m/s</Chip>
                    </Weatherchips>
                </Weathercss>
            </Topbar>

            <Field>
                <Label htmlFor="noticetitle">제목</Label>
                <Titleinput id="noticetitle"
                    value={title||""}
                    placeholder="제목을 입력하세요"
                    onChange={(e)=>{setTitle(e.target.value)}}/>
            </Field>

            <Field>
                <Label>내용</Label>
                <Editorbox>
                    <ReactQuill
                        modules={modules}
                        onChange={setContent}
                        ref={quillref}
                        placeholder="무슨 일이 있었나요?"
                    />
                </Editorbox>
            </Field>

            {/* 첨부는 있을 때만 보여준다 */}
            {filelist&&filelist.length>1&&
            <Field>
                <Label>첨부</Label>
                <Filelistbox>
                {filelist.map((list,index)=>{
                    if(index===0) return null;
                    return (
                        <Fileitem key={index}>
                            <Filename>{list.filename}</Filename>
                            <Fileremove onClick={()=>{filedelete(list.id,list.range)}}>제거</Fileremove>
                        </Fileitem>
                    )
                })}
                </Filelistbox>
            </Field>
            }

            <Footer>
                <Submitbutton
                    disabled={!title||!title.trim()}
                    onClick={createtwitnotice}>등록</Submitbutton>
            </Footer>
        </Wrapper>
    )
}