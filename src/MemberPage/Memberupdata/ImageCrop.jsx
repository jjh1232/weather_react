import React, { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import styled from "styled-components";

 const ImageCropper=({cropimage,//크롭할이미지
setCroppedpixels,//이미지 길이넓이 잘린값
width,
height,
cropshape//이미지 모양 ex ) round설정시 원임    
})=>{
const [crop,setCrop]=useState({x:0,y:0})
const [zoom,setZoom]=useState(1);

const onCropComplete=useCallback((Croppedpixels)=>{
    setCroppedpixels(Croppedpixels);
},[])



return (
    <>
    <Cropper
    image={cropimage}
    crop={crop}
    zoom={zoom}
    aspect={width/height}
    onCropChange={setCrop}
    onCropComplete={onCropComplete}
    onZoomChange={setZoom}
    cropShape={cropshape}
    />
    </>
)

}

export default ImageCropper;