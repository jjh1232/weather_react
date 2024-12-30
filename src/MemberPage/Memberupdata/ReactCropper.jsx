import React, { useCallback, useEffect } from "react";
import { Cropper } from "react-cropper";
import { useState,useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"
import styled from "styled-components";

const Wrapper=styled.div`
    
`
const Preview=styled.div`
    border:1px solid;
    width:45px;
    height:45px;
`
export default function ReactCrpooer(){

    const [imagesrc,setImagesrc]=useState();
    const [crop,SetCrop]=useState({
        unit:`%`, //자르는단위?
        x:15,
        y:15,
        height:70,
        width:70,
        aspect:50/50, //크롭비율을 설정할수있음
    }

    );
    //크롭한이미지저장

    const [cropsrc,setCropsrc]=useState();
    
    const imageref=useRef();

        // 프로필 이미지 화면에 보여주기
    const Selectfilehandler=(e)=>{
        if(e.target.files&&e.target.files.length>0){
           const image=URL.createObjectURL(e.target.files[0])
           //일단파일리더로해봄  
           setImagesrc(image);
        //   setCropsrc(image)
            //안쓸떈리보크로 삭제해야함
            
            /*//파일리더=======================
            const reader=new FileReader();

            reader.readAsDataURL(e.target.files[0])
            reader.onload=()=>{
                setImagesrc(reader.result)
            }
            *///==============================



            //URL.revokeObjectURL(image)
        }

        
    }
    
    const imageloaded=(image,crop)=>{
        console.log("이미지로드완료")
      
        imageref.current=image
        console.log(crop)
        
    }
    const onCropchange=(crop)=>{
        console.log("이미지크롭변경")
        //setCropsrc(crop)
    }
    const OnCropComplete=(crop)=>{
        console.log("이미지크롭변경완료")
        makeClientCrop(crop)
    }

    async function makeClientCrop(crop){
        console.log(crop)
        if(imageref.current&&crop.width&&crop.height){
            console.log("메이크크롭실행:"+imageref.current)
            const crooppedImageUrl=await getCropimg(
                imageref.current,
                crop,
                "newFile.jpeg",
            );

            
            setCropsrc(crooppedImageUrl)
        }
    }
    const getCropimg=(image,crop,filename)=>{
        const canvas = document.createElement("canvas"); // document 상에 canvas 태그 생성
        // 캔버스 영역을 크롭한 이미지 크기 만큼 조절
        canvas.width = crop.width;
        canvas.height = crop.height;
        // getContext() 메서드를 활용하여 캔버스 렌더링 컨텍스트 함수 사용
        // 이 경우 drawImage() 메서드를 활용하여 이미지를 그린다
        const ctx = canvas.getContext("2d");
        
        const img=new Image();
        img.src=image;
        console.log("에러쳌드로우이미지전"+img.src)

       
            console.log("이밎로드"+img.src)
            
        ctx.drawImage(
            img,//원본이미지 객체
            crop.x, //크롭한 이미지x좌표
            crop.y,//크롭한이미지 y좌표 
            crop.width,//크롭한이미지가로길이
            crop.height, //크롭이미지세로길이
            //캔버스영역
            0,//캔버스에서이미지시작x좌표
            0,//캔버스에서 이미지시작y좌표
            crop.width,//캔버스위에 그려질 넓이
            crop.height //그려질높이
        )
        
        // canvas 이미지를 base64 형식으로 인코딩된 URI 를 생성한 후 반환한다
  
        
        console.log("에러쳌"+canvas)
        return new Promise(resolve=>{
          
            resolve(canvas.toDataURL())
        })
    }

   
    const parentdev=()=>{
        //opener.document.getElementById("pinput").value=cropsrc
        //localStorage.setItem("newprofileimage",cropsrc)
        opener.parentCallback(cropsrc);
        window.close();
    }
return (
    <Wrapper>
    <div>
     
    <input
    type="file"
    accept="image/jpeg, image/png, image/jpg"
    onChange={Selectfilehandler}
    
    />

    </div>
    <div>
        {//imagesrc&&<img src={imagesrc}/>
        }<br/>
       
    </div>
    {imagesrc&&
    <>
    원하는부분을 드래그해주세요<br/>
    <ReactCrop
        src={imagesrc}
        
        crop={crop}
        onChange={(e)=>{SetCrop(e)}}
        onComplete={OnCropComplete}
        onImageLoaded={imageloaded(imagesrc,crop)}
        
        
    /*
        src={}
        crop={}

        onComplete={}
        onChange={}
        */
        >
        {//
        
}

<img src={imagesrc} ref={imageref}/> 
</ReactCrop>
        
        <br/>
        {cropsrc &&
        <>
        미리보기<br/>
        <Preview>
        <img src={cropsrc} style={{objectFit:"fill",width:"100%",height:"100%"}}/>
        </Preview>
        </>}
        </>
    }

    <button onClick={parentdev}>프로필이미지저장</button>
    </Wrapper>

)
}