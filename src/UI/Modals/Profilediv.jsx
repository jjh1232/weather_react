import React from "react";
import styled from "styled-components";

const Profilecss=styled.div`
    position  :relative ;
    width: 100%;
    height: 100%;
    min-height: 20px;
    //margin: 3px;
    display: flex;
    justify-content: center;
    align-items: center;

`
const Profile = styled.img`
    position: relative;
    border:1px solid black;
    background-color: white;
    width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "100%"};
      
 

    
`
export default function Profilediv(props){
    const {url,width,height}=props;

    return (
                        <Profilecss>
                           {url===null?<Profile 
                           src={process.env.PUBLIC_URL + "/userprofileimg" + "/noprofile.png"}
                           width={width}
                           height={height}
                           />
                           : <Profile src={process.env.PUBLIC_URL + "/userprofileimg" + url}
                                width={width}
                                height={height}
                          />}
                          
                                                                
                         </Profilecss>
    )
}