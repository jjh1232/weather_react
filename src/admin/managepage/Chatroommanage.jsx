import React from "react";
import CreateAxios from "../../customhook/CreateAxios";
import { useSearchParams } from "react-router-dom";
import Chatroomlist from "./list/Chatroomlist";
import AdminSearchtools from "../../customhook/AdminSearchtools";
import { useQuery } from "@tanstack/react-query";
import { Page, Pagehead, Pagetitle, Pagemeta, Headright, Panel,
         Tablewrap, Table, Th, Emptyrow, Adminpaging } from "../AdminUI";

export default function Chatroommanage(){

    const axiosintance=CreateAxios();
    const [query]=useSearchParams();
    const querydata={
        page:parseInt(query.get("page")) || 1,
        option:query.get("option") ,
        keyword:query.get("keyword")
    }

    const options=[
        {value:"roomname",name:"채팅방 이름"},
        {value:"partilist",name:"참가자"},
        {value:"email", name:"이메일"}
    ]

    //예전엔 useQuery 로 받아온 걸 useEffect 로 다시 useState 에 옮겨 담았다.
    //한 박자 늦게 그려지고 상태가 두 벌이 되므로 쿼리 결과를 바로 쓴다.
    const {data,isLoading}=useQuery({
        queryKey:["adminchatroomlist", querydata.page, querydata.option, querydata.keyword],
        queryFn:async ()=>{
            const res=await axiosintance.get("/admin/chatroommanage",{
                params:{page:querydata.page,
                    option:querydata.option,
                    searchtext:querydata.keyword}
            })
            return res.data;
        },
    })

    const chatroom=data?.content;

    return (
        <Page>
            <Pagehead>
                <Pagetitle>채팅방 관리</Pagetitle>
                <Pagemeta>총 {data?.totalElements??0}개 · {data?.totalPages??1}페이지</Pagemeta>

                <Headright>
                    <AdminSearchtools
                        searchdatas={querydata}
                        options={options}
                        url={"/admin/chatroom"}
                    />
                </Headright>
            </Pagehead>

            <Panel>
                <Tablewrap>
                    <Table>
                        <thead>
                            <tr>
                                <Th $align="center">번호</Th>
                                <Th>채팅방 이름</Th>
                                <Th>참가자</Th>
                                <Th>마지막 대화</Th>
                                <Th $align="center">채팅수</Th>
                                <Th>최근 대화일</Th>
                                <Th>생성일</Th>
                                <Th $align="center">관리</Th>
                            </tr>
                        </thead>

                        {chatroom && chatroom.length>0
                            ? <tbody>
                                {chatroom.map((room)=>(
                                    <Chatroomlist key={room.roomid} data={room}/>
                                ))}
                              </tbody>
                            : <Emptyrow colspan={8}>
                                {isLoading?"불러오는 중입니다"
                                    :querydata.keyword?"검색 결과가 없습니다":"채팅방이 없습니다"}
                              </Emptyrow>}
                    </Table>
                </Tablewrap>
            </Panel>

            <Adminpaging totalpage={data?.totalPages} url={"/admin/chatroom"} querydata={querydata}/>
        </Page>
    )
}
