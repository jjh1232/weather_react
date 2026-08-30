import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import ReactDom from "react-dom";
import ToastStack from "./ToastStack";
import ConfirmDialog from "./ConfirmDialog";

//=====================================================================
// 알림 한 곳으로 모으기
//  - alert()  → toast.success / toast.error / toast.info
//  - confirm() → await confirm({ ... })
//
// alert 과 다른 점이 하나 있다: 토스트는 실행을 멈추지 않는다.
// alert 뒤에 이어지던 코드가 "사용자가 확인을 누른 뒤"를 전제했다면
// 그 자리는 toast 가 아니라 confirm 으로 바꿔야 한다.
//=====================================================================

const FeedbackContext=createContext(null);

const MAXTOAST=4;          // 이보다 쌓이면 오래된 것부터 밀어낸다
let seq=0;

//서버 에러를 사람이 읽을 수 있는 문장으로 바꾼다.
//기존 코드 곳곳의 alert(err) 는 화면에 [object Object] 나
//"AxiosError: Request failed with status code 500" 을 그대로 띄우고 있었다.
export function messageFromError(err,fallback="문제가 생겼습니다. 잠시 후 다시 시도해주세요."){
    if(!err) return fallback;
    if(typeof err==="string") return err;

    const data=err.response?.data;
    if(typeof data==="string"&&data.trim()) return data.trim();
    if(data&&typeof data==="object"){
        const m=data.message||data.error||data.msg;
        if(typeof m==="string"&&m.trim()) return m.trim();
    }

    const status=err.response?.status;
    if(status===401) return "로그인이 필요합니다.";
    if(status===403) return "권한이 없습니다.";
    if(status===404) return "찾을 수 없습니다. 이미 지워졌을 수 있습니다.";
    //서버의 요청 제한(RateLimitInterceptor)에 걸린 경우
    if(status===429) return "요청이 너무 잦습니다. 잠시 후 다시 시도해주세요.";
    if(status>=500) return "서버에 문제가 생겼습니다. 잠시 후 다시 시도해주세요.";
    if(err.code==="ERR_NETWORK") return "서버에 연결하지 못했습니다. 네트워크를 확인해주세요.";

    return fallback;
}

function FeedbackProvider({children}){
    const [toasts,setToasts]=useState([]);
    const [confirmoptions,setConfirmoptions]=useState(null);
    const resolveref=useRef(null);

    const dismiss=useCallback((id)=>{
        setToasts((list)=>list.filter((t)=>t.id!==id));
    },[])

    const push=useCallback((tone,message,options)=>{
        const text=typeof message==="string"?message:messageFromError(message);
        if(!text) return null;

        const id=++seq;
        //에러는 읽는 데 시간이 더 걸린다.
        const duration=options?.duration??(tone==="error"?5200:3200);

        setToasts((list)=>{
            const next=[...list,{id,tone,message:text,duration}];
            return next.length>MAXTOAST?next.slice(next.length-MAXTOAST):next;
        })
        return id;
    },[])

    //toast("...") 로도, toast.success("...") 로도 쓸 수 있게 함수에 메서드를 달아둔다.
    const toast=useMemo(()=>{
        const fn=(message,options)=>push("info",message,options);
        fn.success=(message,options)=>push("success",message,options);
        fn.error=(message,options)=>push("error",message,options);
        fn.info=(message,options)=>push("info",message,options);
        fn.dismiss=dismiss;
        return fn;
    },[push,dismiss])

    const confirm=useCallback((options)=>{
        return new Promise((resolve)=>{
            //이미 떠 있는 확인창이 있으면 그건 취소로 정리한다.
            if(resolveref.current) resolveref.current(false);
            resolveref.current=resolve;
            setConfirmoptions(typeof options==="string"?{title:options}:(options||{}));
        })
    },[])

    const answer=useCallback((ok)=>{
        const resolve=resolveref.current;
        resolveref.current=null;
        setConfirmoptions(null);
        if(resolve) resolve(ok);
    },[])

    const value=useMemo(()=>({toast,confirm}),[toast,confirm]);

    //토스트/다이얼로그는 앱 레이아웃 밖(#modal-root)에 그린다.
    //안쪽에 두면 상위의 overflow:hidden 이나 transform 에 잘린다.
    const portaltarget=typeof document!=="undefined"
        ?(document.getElementById("modal-root")||document.body)
        :null;

    const layer=(
        <>
            <ToastStack toasts={toasts} onClose={dismiss}/>
            {confirmoptions&&<ConfirmDialog options={confirmoptions} onAnswer={answer}/>}
        </>
    )

    return (
        <FeedbackContext.Provider value={value}>
            {children}
            {portaltarget?ReactDom.createPortal(layer,portaltarget):layer}
        </FeedbackContext.Provider>
    )
}

function usefeedback(hookname){
    const ctx=useContext(FeedbackContext);
    if(!ctx) throw new Error(`${hookname} 은 FeedbackProvider 안에서만 쓸 수 있다.`);
    return ctx;
}

export function useToast(){
    return usefeedback("useToast").toast;
}

export function useConfirm(){
    return usefeedback("useConfirm").confirm;
}

export default FeedbackProvider;
