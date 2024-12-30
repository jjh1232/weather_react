import Modal from "react-modal";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import authCheck from "../../customhook/authCheck";
import CreateAxios from "../../customhook/CreateAxios";
import { useNavigate } from "react-router-dom";

function Userdata(props){
    const {username, usernickname}=props
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalcss,setModalcss]=useState(
        {
            x:0,
            y:0
        }
    );
   
    const [tousername,setTousername]=useState([username])
    const [tousernickname,setTousernickname]=useState([usernickname])

    const navigate=useNavigate();

    const modalref=useRef();
    //팔로우체크
    const [followcheck,setFollowcheck]=useState();
    //유스이펙트로 모달외클릭 감지하기
    const logincheck=authCheck();
    //로그인계정
    const axiosinstance=CreateAxios();


    useEffect(()=>{
        console.log("실행감지")
        document.addEventListener("mousedown",modalclose)
         //리턴으로 이벤트 안지우면 계속실행됨
        return ()=>document.removeEventListener('mousedown',modalclose);
    },[modalIsOpen])
    const modalclose=(e)=>{

        console.log("실행감지1"+modalref.current)
            console.log("실행감지2"+e.target)
            if(modalIsOpen&&!modalref.current.contains(e.target)){
                console.log("모달열려있음")
                setModalIsOpen(false)
            }

        
    }
    //팔로우체크
    const onfollowcheck=()=>{
        if(logincheck){
            console.log("로그인되있음")
            axiosinstance.get("/followcheck?friendname="+username)
            .then((res)=>{
                console.log(res.data)
                setFollowcheck(res.data)
            }).catch((err)=>{
                console.log("에러")
            })
        }
        else{
            console.log("로그인안되있음")
        }
    }
    //팔로우 추가
    const onfollow=(e)=>{
        e.preventDefault();
        console.log("팔로잉실행!")
        if(logincheck){
        axiosinstance.get("/follow?friendname="+username)
        .then((res)=>{
            alert("팔로우성공!")
        }).catch((err)=>{
            alert("팔로우실패!")
        })
    } else{
        alert("로그인을먼저해주세요!")
    }
    }
    //팔로우취소
    const onunfollow=(e)=>{
        e.preventDefault();
        console.log("언팔로우!실행")
    
        axiosinstance.delete(`/followdelete/${username}`)
        .then((res)=>{
            alert("팔로우삭제성공!")

        }).catch((err)=>{
            alert("팔로우삭제실패!")
        })
    }
    //1대1채팅만들기
    const makechatroom=(e)=>{
        e.preventDefault()
        console.log(tousername)
        console.log(tousernickname)
        if(logincheck){
        axiosinstance.post(`http://localhost:8081/createchatroom`,{
            
        usernickname:tousernickname,
        memberlist:tousername
    }
        ).then((res)=>{
            console.log(res.data)
        
            navigate("/chatex?roomid="+res.data)
        }).catch((error)=>{
            console.log(error)
        })
    }else{
        alert("먼저로그인을해주세요!")
    }
    }
    /* 리액트 모달 라이브러리 사용
    const ModalStyle={ //모달스타일설정 
        overlay:{ //바깥쪽
            position:'fixed',
            top:modalcss.y-50,
            left:modalcss.x-50,
            right:0,
            bottom:0,
            
    
        },
        content: { //안쪽스타일 
            width:"80px",
            height:"80px"
        }
    }

    */
    const modalopen=(e)=>{
        e.preventDefault();
        console.log("모달오픈")
        setModalIsOpen(true)
    }
return (
    <>
    <div style={{zIndex:"10px"}}onClick={(e)=>{
        onfollowcheck();
        setModalcss({
            x:e.clientX,
            y:e.clientY
        })
        console.log(e.clientX)
        console.log(e.clientY)
        modalopen(e)}}>

{usernickname}<br/>
@{username}<br/>

    </div>
    {
        modalIsOpen&& <div className="selfmodal" ref={modalref} style={
            {
                width:"80px",
                height:"90px",
                position:"fixed", //포지션이걸로모달처럼표현가능
                justifyContent:"center",
                background:"blue",
                top:modalcss.y+"px",
                left:modalcss.x+"px"
            }
            }>{followcheck?<div onClick={(e)=>{onunfollow(e)}}>팔로우해제</div>
            :<div onClick={(e)=>{onfollow(e)}}>팔로우</div>}
            
            <div onClick={(e)=>{makechatroom(e)}}>채팅하기</div>
            <div>작성글검색</div>

        </div>
    }
    {/*  ref가 안되서 내가만들어보자 
    <Modal 
         //ref={modalref} //외부클릭은 기본 옵션이 없어서 이걸로 해야할듯 
         //ref가 지정이안되..컴포넌트형은 ref안되나봄
        isOpen={modalIsOpen}  //모달창이 표시되어야 하는지여부 true여야 모달창열림
        onRequestClose={()=>{setModalIsOpen(false)}} //모달이 닫힐때 실행될 함수
        style={ModalStyle}    //모달창과 모달창 바깥에 대한 style 지정
        ariaHideApp={false} //appelement를 숨길지 여부 true면 숨겨줌
      contentLabel="Pop up Message" //스크린리더 사용자에게 컨텐츠 전달할떄 방법메세지
      shouldCloseOnOverlayClick={true} //팝업창 바깥부분 클릭할떄 닫히도록할것인지 
                                //기본값은 true
         
     >
        {//모달창에담을컴포넌트
        }
        팔로우<br/>
        채팅하기<br/>

        </Modal>   
    */}
    </>
)
}export default Userdata;
