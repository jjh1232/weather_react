import styled from "styled-components";
import React from "react";

export default function CommentPagination(props){
    const {currentpage,totalpage,setpage}=props;
    const startpage=currentpage-5>0?currentpage-5:1;
    const lastpage=currentpage+5<=totalpage?currentpage+5:totalpage;

    const pagearray=[];
    
    for (let i=startpage;i<=lastpage;i++){
        pagearray.push(i);
    }

    return (<React.StrictMode>
    {currentpage==1?""
    :<>
    {currentpage-5>startpage&&<>&#60;
    <button onClick={()=>{setpage(1)}}>...1</button>
    </>}
    </>}
    {pagearray.map((count,key)=>{
     return (
            <>
            {count===currentpage?<>
            {//현재페이지
                count }
            </>
        :
        <>
        {//다른페이지
            count
        }
        </>    
        }
            </>
        )
    })
}
    {currentpage<totalpage?
        <>
        {currentpage+5<totalpage&&
        <>
        다음

        <>
        ...{totalpage}
        </>
        </>
        }
        </>:""
    }
      
    
  

    </React.StrictMode>)

}