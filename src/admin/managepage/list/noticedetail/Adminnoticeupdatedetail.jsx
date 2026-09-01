import React from "react";
import styled from "styled-components";
import { useState, useRef, useMemo } from "react";
import CreateAxios from "../../../../customhook/CreateAxios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Sky,Pty } from "../../../../customhook/Admintools/Weathersetting";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel, Button }
    from "../../../AdminUI";
import { useConfirm, useToast } from "../../../../UI/Feedback/FeedbackProvider";
import { API_BASE } from "../../../../config/api";
import { detachimage } from "../../../../UI/profileimage";

//=====================================================================
// 관리자 게시글 수정.
//
// 예전엔 Wrapper 가 width:1530px, Main 이 1000px, 에디터가 인라인으로
// width:1000px 고정이었고 ImageList 는 position:fixed(left:71%) 라
// 본문 위에 겹쳐 떠 있었다. 거기에 디버그용 테두리(green/red/yellow)까지
// 남아 있어서 화면이 통째로 어긋나 보였다.
// 상세 화면(Adminnoticedetail)과 같은 [본문 + 첨부] 2단 grid 로 맞춘다.
//=====================================================================

const Columns=styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    gap: 14px;
    align-items: start;

    @media (max-width: 1100px) {
        grid-template-columns: minmax(0, 1fr);
    }
`
const Editorpanel=styled(Panel)`
    display: flex;
    flex-direction: column;
    min-width: 0;
`
const Formbody=styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 16px 18px;
`
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
//select(Sky/Pty)도 입력칸과 같은 모양이 되도록 자손까지 지정한다
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
/* 에디터. Quill 은 스스로 높이를 못 잡아서 감싼 쪽이 정해줘야 한다.
   위아래로 묶어두지 않으면 본문이 길 때 아래 버튼줄이 화면 밖으로 밀린다. */
const Editorbox=styled.div`
    display: flex;
    flex-direction: column;
    height: clamp(320px, 52vh, 620px);
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
    .ql-editor{ height: 100%; overflow-y: auto; }

    /* 원본 크기 그대로 그려져 에디터를 뚫고 나가던 걸 막는다 */
    .ql-editor img{ max-width: 100%; height: auto; display: block; }

    /* 다크모드에서 툴바 아이콘이 검정 그대로라 안 보였다 */
    .ql-snow .ql-stroke{ stroke: ${(props)=>props.theme.textMuted}; }
    .ql-snow .ql-fill{ fill: ${(props)=>props.theme.textMuted}; }
    .ql-snow .ql-picker{ color: ${(props)=>props.theme.textMuted}; }
`
const Foot=styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 18px;
    border-top: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`

//첨부 패널 - 상세 화면과 같은 모양. 스크롤을 내려도 따라온다.
const Sidepanel=styled(Panel)`
    display: flex;
    flex-direction: column;
    min-width: 0;

    position: sticky;
    top: 16px;
    max-height: calc(100vh - 32px);

    @media (max-width: 1100px) {
        position: static;
        max-height: none;
    }
`
const Sidehead=styled.div`
    padding: 12px 14px;
    border-bottom: 1px solid ${(props)=>props.theme.border};
    font-size: 13px;
    font-weight: 700;
`
const Sidebody=styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;

    @media (max-width: 1100px) {
        max-height: 420px;
    }
`
const Detachitem=styled.div`
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px;
    border: 1px solid ${(props)=>props.theme.border};
    border-radius: ${(props)=>props.theme.radiusSm};
    min-width: 0;
`
const Detachimg=styled.img`
    flex-shrink: 0;
    width: 46px;
    height: 46px;
    object-fit: cover;
    border-radius: ${(props)=>props.theme.radiusSm};
    border: 1px solid ${(props)=>props.theme.border};
    background: ${(props)=>props.theme.surfaceAlt};
`
const Detachmeta=styled.div`
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
`
const Detachname=styled.span`
    font-size: 11.5px;
    color: ${(props)=>props.theme.text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`
const Detachidx=styled.span`
    font-size: 10.5px;
    color: ${(props)=>props.theme.textFaint};
`
const Sideempty=styled.div`
    padding: 28px 12px;
    text-align: center;
    font-size: 12px;
    color: ${(props)=>props.theme.textFaint};
`

export default function Adminnoticeupdatedetail(props){
    const {data,setisupdate}=props;
    const axiosinstance=CreateAxios();
    const quillref=useRef();
    const imagekey=useRef(data.detachfiles[data.detachfiles.length-1]?.idx||0);
    const queryclient=useQueryClient();
    const confirm=useConfirm();
    const toast=useToast();

    //강수량때매 정규식추가
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
    const [filelist,setFilelist]=useState(data.detachfiles)

    //뮤테이트
    const mutation=useMutation({
        mutationFn:(newdata)=>{
            return axiosinstance.put(`/admin/noticeupdate/${newdata.noticeid}`,newdata)
        },
        onSuccess:()=>{
            toast.success("게시글을 수정했습니다.")
            setisupdate(false)
            queryclient.invalidateQueries({ queryKey: [`noticeData`] })
        },
        onError:(err)=>{ toast.error(err) }
    })

    const onupdate=()=>{
        mutation.mutate({
            noticeid:crnotice.noticeid,
            username:crnotice.username,
            nickname:crnotice.nickname,
            title:crnotice.title,
            text:crnotice.text,
            temp:crnotice.temp,
            /* 불러올 때 숫자만 남기고 잘라두므로 보낼 때 단위를 다시 붙인다.
               예전엔 그냥 crnotice.rain 을 보내서, 이 화면으로 한 번 수정한 글만
               강수량이 "5mm 미만" 이 아니라 "5" 로 저장됐다. */
            rain:crnotice.rain+"mm 미만",
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
        })
    }

    const modules =useMemo(()=>{ //유스메모 사용안하면 매랜더링마다다시생성됨
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

    //이건첨부파일제거로하고
    const filedelete=async(id,range)=>{
        const ok=await confirm({
            title:"첨부를 목록에서 지울까요?",
            description:"글 본문에서도 그 이미지가 함께 지워집니다.",
            confirmText:"제거",
            danger:true,
        })
        if(!ok) return;

        setFilelist(filelist.filter((prev)=>prev.id !==id))
        quillref.current.getEditor().deleteText(range,1)
    }

    const files=(filelist||[]).filter((f)=>f&&f.path);

    return (
        <Page>
            <Pagehead>
                <Pagetitle>게시글 수정</Pagetitle>
                <Pagemeta>{data.num}번 · {data.red}</Pagemeta>
                <Headright>
                    <Button type="button" onClick={()=>{setisupdate(false)}}>수정취소</Button>
                    <Button type="button" $variant="primary"
                        disabled={mutation.isPending}
                        onClick={()=>{onupdate()}}>수정완료</Button>
                </Headright>
            </Pagehead>

            <Columns>
                <Editorpanel>
                    <Formbody>
                        <Field>
                            <Fieldname>제목</Fieldname>
                            <Control>
                                <input type="text" defaultValue={crnotice.title}
                                    onChange={(e)=>{setCrnotice({...crnotice,title:e.target.value})}}/>
                            </Control>
                        </Field>

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
                                            {/* 다른 두 화면과 똑같이 여기서도 sky 를 덮어쓰고 있었다.
                                                기온을 고쳐도 저장되는 값은 원래 값 그대로였다. */}
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

                        <Editorbox>
                            <ReactQuill
                                ref={quillref}
                                modules={modules}
                                value={crnotice.text}
                                onChange={texthandler}/>
                        </Editorbox>
                    </Formbody>

                    <Foot>
                        <Button type="button" onClick={()=>{setisupdate(false)}}>수정취소</Button>
                        <Button type="button" $variant="primary"
                            disabled={mutation.isPending}
                            onClick={()=>{onupdate()}}>수정완료</Button>
                    </Foot>
                </Editorpanel>

                <Sidepanel>
                    <Sidehead>첨부 이미지 {files.length}장</Sidehead>
                    {files.length===0
                        ? <Sideempty>첨부된 이미지가 없습니다.</Sideempty>
                        : <Sidebody>
                            {files.map((list,key)=>(
                                <Detachitem key={list.id??key}>
                                    <Detachimg src={detachimage(list.path)} alt=""/>
                                    <Detachmeta>
                                        <Detachname title={list.filename}>{list.filename}</Detachname>
                                        <Detachidx>idx {list.idx}</Detachidx>
                                    </Detachmeta>
                                    <Button type="button" $small $variant="danger"
                                        onClick={()=>{filedelete(list.id,list.rangeindex)}}>제거</Button>
                                </Detachitem>
                            ))}
                          </Sidebody>}
                </Sidepanel>
            </Columns>
        </Page>
    )
}
