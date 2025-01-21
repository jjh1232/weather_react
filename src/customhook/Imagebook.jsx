import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import styled from "styled-components";
import CreateAxios from "./CreateAxios";

const Modalout=styled.div`
  position:fixed;
    width:100%;
    height: 100%;
    background:rgba(0,0,0,0.5);
//display:flex; //
justify-content:center;//왼쪽에서중간
align-items:center;
top: 0;
left: 0;
`

const Imagein=styled.img`
position: relative;
object-fit:cover;
 justify-content: center;
 align-items:center;
 max-width: 73%;
 max-height: 99%;
 
`

const Sidebar=styled.div`
   
    float: right;
    background-color: white;
    width: 20%;
    height: 100%;
`
//작은이미지모음
const Wrapper=styled.div`
    float: left;
    border: 1px solid black;
    width: 100%;
   
    height: 72.5%;
    overflow: auto;
    
`
//작은이미지 개당
const Miri=styled.img`
object-fit: fill;
width: 100%;
    height:100%;

//border: 1px solid black;
//float: left;
//position:relative;
//display: none;
`
const Checkbox=styled.input`
float: left;

z-index: 10;
position: absolute;




    
`
const Container=styled.div`
    position: relative;
    width: 32%;
    height:15%;
    float: left;
    border: 1px solid ${(props)=>props.selectcolor?"yellow":"black"}
`
export default function Imagebook(props){
const {images,setisimage,userdata,noticedata}=props;
const [activeindex,setActiveindex]=useState(0);
const axiosinstance=CreateAxios();
const queryclient=useQueryClient();
const [checkboxdata,setCheckboxdata]=useState([
    
]);
//단체수정
const [isupdate,setIsupdate]=useState(false)
const nextslide=()=>{
    if(activeindex<images.length-1) setActiveindex(activeindex+1);
    //else setActiveindex(0); 최대시
}
const prevslide=()=>{
    if(activeindex>0) setActiveindex(activeindex-1);
    //else setActiveindex(images.length-1);
}

//단일이미지벤
const imageban=useMutation({
    mutationFn:(data)=>{
        return axiosinstance.put(`/admin/imageban/${data.detachid}`)
    },
    onSuccess:(res)=>{
        alert("차단되었습니다"+res.data)
        queryclient.invalidateQueries([`noticeData`])
    }
})
//이미지벤다수 
const manyimageban=useMutation({
    mutationFn:(data)=>{
        return axiosinstance.put(`/admin/manyimageban`,{detachids:data})
        },
        onSuccess:()=>{
            alert("성공")
        }
})

const manyimagebanhandler=(data)=>{
    if(confirm("정말로차단하시겠습니까")){
        console.log(data)
        manyimageban.mutate(data

        )
    }
}
const imagebanhandler=(detachid)=>{
    if(confirm("정말로차단하시겠습니까")){
    imageban.mutate({
        detachid:detachid
    })
}
}

const Checkhandler=(checked,id)=>{
    if(checked){
        setCheckboxdata([...checkboxdata,id])
    }else{
        setCheckboxdata(checkboxdata.filter(item=>item !==id));
    }
}
return (
    <Modalout>
    <button onClick={()=>{setisimage(false)}}>창닫기</button>
    {activeindex>0&&
        <button onClick={prevslide}>이전이미지</button>}

    {images.map((data,key)=>{
        return(
           <>
            {key===activeindex&&
              <>      
              
            <Imagein src={process.env.PUBLIC_URL+data.path}/>
            <button onClick={()=>{imagebanhandler(data.id)}}>이미지밴</button>
            </>
              }
              
            </>
        )
    })}
    {activeindex<images.length-1&&
    <button onClick={nextslide}>다음이미지</button>

    }
    <Sidebar>
        <div>
    <img  src={process.env.PUBLIC_URL+"/userprofileimg"+userdata.profileimg}
   style={{objectFit:"cover",width:"30%",height:"10%"}} />
    <span style={{color:"black"}}>{userdata.username}</span><br/>
    </div>======================유저정보===============================
        <span style={{color:"black"}}>{noticedata.title}</span><br/>
        <span style={{color:"black"}}>{noticedata.likes}</span><br/>
        <span style={{color:"black"}}>{noticedata.red}</span><br/>
        ======================게시글정보===========================
        <span style={{color:"black"}}>이미지리스트</span> {checkboxdata}
        {isupdate?
        <>
        <button onClick={()=>{manyimagebanhandler(checkboxdata)}}>선택이미지차단</button>
        <button onClick={()=>{setIsupdate(false)}}>수정취소</button>
        <Wrapper>
            
            {images.map((data,key)=>{
                return (
                     <Container> 
                        
                        <Checkbox type="checkbox" id={`check${key}`} value={data.id}
                         onChange={(e)=>{Checkhandler(e.target.checked,e.target.value)}}/>
                        <label for={`check${key}`} >
                        <Miri src={process.env.PUBLIC_URL+data.path}  
                        /> 
                        </label>
                        
                        
                      
                        </Container> 
                )
            })}
            
        </Wrapper>
        </>
        : <> 
        <button onClick={()=>{setIsupdate(true)}}>수정모드</button>

        <Wrapper>
            
            {images.map((data,key)=>{
                return (
                    <>
                        
                      {activeindex===key?
                        <Container   selectcolor={true}> 
                         <Miri src={process.env.PUBLIC_URL+data.path} onClick={()=>{setActiveindex(key)}} 
                          
                         /> 
                         </Container> 
                      :
                      <Container   selectcolor={false}> 
                      <Miri src={process.env.PUBLIC_URL+data.path} onClick={()=>{setActiveindex(key)}} 
                      selectcolor={false}
                      /> 
                      </Container> 
                      }
                    
                        </>
                        
                        
                      
                        
                )
            })}
            
        </Wrapper>
        </>    
    }
    </Sidebar>
    
    </Modalout>
)

}