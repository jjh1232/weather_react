import React from "react";
import Detachlistitem from "./Detachlistitem";

function Detachlist(props){

    const {detachlist,onClick}=props;



    return(
        <>
        {detachlist && detachlist.map((data,key)=>{
            
            return(
                <>&nbsp;&nbsp;
                <Detachlistitem detach={data}/>
                </>
                
            )
        })}
        </>
    )
}
export default Detachlist;