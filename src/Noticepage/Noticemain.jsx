import React,{useState,useEffect} from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../UI/Button";
import Loginpage from "../MemberPage/Loginpage";
import AuthCheck from "../customhook/authCheck";
import SelectBox from "../UI/SelectBox";
import Noticelist from "../List/Noticelist";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import NoticeText from "../UI/NoticeText";

function Noticemain(props){
const [notice,setNotice] =useState([]);
const [islogin,Setislogin] = useState();
//쿼리스트링이걸로페이징해야겟음내일 
const [searchParams, SetsearchParams]=useSearchParams({
  page:1,
  searchis:"0"
});
const searchis=searchParams.get("searchis")
const paging =parseInt(searchParams.get('page'));
const [currentpage,Setcurrentpage]=useState();
const navigate=useNavigate();
const columns=["번호","닉네임","타이틀","날짜"];

const counturl="/open/count"
const [count,setCount] =useState();
const [totalpages,Settotalpages]=useState(1)//Math.floor((count/10)+1);
const arrs=[];
const options = [
  {value:"title",name:"제목"}, 
  {value:"text",name:"내용"}, 
  {value:"titletext",name:"제목+내용"}, 
  {value:"name",name:"글쓴이"} 
]
const [selectoption,Setselectoption]=useState("title");
const [page,setPage]=useState(1);
const [searchtext,Setsearchtext]=useState("")

const url=`/open/notice`;
const searchurl=`/open/noticesearch`
//const [searchis,Setsearchis]=useState(false)




for(var i=1;i<totalpages+1;i++){
  
  arrs[i]=i;
  
   
 }

useEffect(()=>{
  if(searchis==="0"){
  axios.get(url,{
    params:{
      page:page
    }
    
  }).then((res)=>
  {
    //setTotalpage(res.data.totalPages)
   // console.log(res.data)
    Setcurrentpage(parseInt(paging))
    Settotalpages(res.data.totalPages);
    setNotice(res.data.content)
       
    
  })}
else{
  console.log("검색")
  axios.get(searchurl,{
    params:{
    page:paging,
    option:selectoption,
    keyword:searchtext
    }
  }).then((res)=>{
         
      
      Settotalpages(res.data.totalPages)
      setNotice(res.data.content)
      
      searchParams.set("option",selectoption)
      searchParams.set("keyword",searchtext)
      
      SetsearchParams(searchParams)
  })
}
},[paging,page])



const check=AuthCheck();

useEffect(()=>{
  Setislogin(check)
},[islogin])

const logincheck=()=>{


  if(islogin){
    navigate(`/noticecreate`)
    
    }
    else{
      alert("로그인후 글쓰기가가능합니다")
    }
}

const search=(e)=>{
e.preventDefault()
searchParams.set("searchis","1")
searchParams.set("page",1)
if(searchtext===""){
  alert("검색어를입력하세요")
}
else{
  axios.get(searchurl,{
    params:{
    
    option:selectoption,
    keyword:searchtext
    }
  }).then((res)=>{
    
      console.log(res.data)
     
      console.log(res.data.content)
      
      Settotalpages(res.data.totalPages)
      setNotice(res.data.content)
     
  })
}
}
return (
 
      <div>
        
        <NoticeText title="메인게시판" onClick={()=>{
          navigate(`/notice`)
          window.location.reload();
          
        }}/>

          
        
          
  
        <Noticelist 
        posts={notice}
        onClickItem={()=>{
          
        }}
    
        />


<Button onClick={logincheck}  title="글쓰기"/>

<form>
      <select onChange={(e)=>{Setselectoption(e.target.value)}}>
        {options.map((option)=>{
          return(
          <option
          key={option.value}
          value={option.value}
          
          >
            
            {option.name}
          </option>
          )
        })}
   </select>
   <input type="text" value={searchtext} onChange={(e)=>{
        Setsearchtext(e.target.value)
        
      }}/>
      
      <button onClick={search}>검색</button>
  </form>
 



  {
  paging===1? null
  :searchis?<button onClick={()=>{
  
    const prevpage=paging-1;
  
    navigate(`/notice?page=${prevpage}&searchis=${searchis}&option=${selectoption}&keyword=${searchtext}`);
  }}
  >이전</button>
  
  :<button onClick={()=>{
  
  const prevpage=paging-1;

  navigate(`/notice?page=${prevpage}`);
}}
>
  
  이전
</button>
  
  }



{  arrs.map((arr,index)=>{
  if(paging===arr){

    return (
      searchis
      ?<h4 key={index}><a  onClick={()=>{navigate(`/notice?page=${arr}&searchis=${searchis}&option=${selectoption}&keyword=${searchtext}`)}}>{arr}</a></h4>
      :<h4 key={index}><a  onClick={()=>{navigate(`/notice?page=${arr}`)}}>{arr}</a></h4>
    
      )
    }
    else{
      return (
        searchis
        ?<a  onClick={()=>{navigate(`/notice?page=${arr}&searchis=${searchis}&option=${selectoption}&keyword=${searchtext}`)}}>{arr}</a>
        :<a onClick={()=>{navigate(`/notice?page=${arr}`)}}>{arr}</a>
      
        )
    }
  })
}




{
paging===totalpages? null
:searchis?<button onClick={()=>{
  console.log("페이지")
  const  nextpage=paging+1
  setPage(nextpage)
  
}}
>
  다음
</button>

:<button onClick={()=>{
  const  nextpage=paging+1

  navigate(`/notice?page=${nextpage}`);
}}
>
  다음
</button>

}
<br/>
{searchis==="0"?"false":"true"}



      
      
     
      
      </div>        
)
}

export default Noticemain;