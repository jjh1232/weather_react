import React, { useEffect, useState } from "react";
import styled from "styled-components";
import CreateAxios from "../../customhook/CreateAxios";
import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Profilediv from "./Profilediv";

const Modal = styled.div.attrs({ className: "chatroommenu" })`
 position:absolute;
 display: flex;
 flex-direction:column;
height:100%;
width:100%;
background:greenyellow;

animation: modaldown 0.5s linear;
`

const Headers = styled.div.attrs({ className: "chatroommenu" })`
    display: flex;
    border:1px solid blue;
`

const ExitButton = styled.div.attrs({ className: "chatroommenu" })`
    position: relative;
    width: 30px;
    height: 30px;
    

    &::before{
        content: " ";
        position: absolute;
        top: 40%;
        width: 30px;
        border-bottom: 8px solid black;
        transform: rotate(45deg);
    }
    &::after{
        content: " ";
        position: absolute;
        top: 40%;
        width: 30px;
        border-bottom: 8px solid black;
        transform: rotate(-45deg);
    }
`
const Invitebutton = styled.button.attrs({ className: "chatroommenu" })`
margin-left: auto;
width:55px;
background: rgb(247,150,192);
background: radial-gradient(circle, rgba(247,150,192,1) 0%, rgba(118,174,241,1) 100%);
  line-height: 15px;
  padding: 0;
  border: none;

`
const Userprofilecss=styled.div`
    width:40px;
    height:40px;
`
const HeaderText = styled.div`
    text-align:center;
   
    width: 200px;
    
    `
const Searchinput = styled.input.attrs({ className: "chatroommenu" })`
    
`
const Userlist = styled.div.attrs({ className: "chatroommenu" })`
    border:1px solid red;
`
const Userli = styled.div.attrs({ className: "chatroommenu" })`
    border: 1px solid yellow;
    display: flex;
`
const Usercheck = styled.input.attrs({ className: "chatroommenu" })`
    margin-left: auto;
    width: 20px;
    margin-right:10px;
`
const Username = styled.div.attrs({ className: "chatroommenu" })`

`
const ChatFollowlistmodal = (props) => {
    const { close, roomid, roomusers, invite, isinvitelist } = props;
    const axiosinstance = CreateAxios();

    const [checklist, setChecklist] = useState([])
    const [selectlist, setSelectlist] = useState([]);
    const [ischeck, setIscheck] = useState(false)
    const [search, setSearch] = useState(" ");

    const queryclient = useQueryClient();

    const { data: followlist, isLoading, error } = useQuery({
        queryKey: ['invitelist'],
        queryFn: async () => {
            const res = await axiosinstance.get("/followlist")
            return res.data;
        }

    })

    const clossmodal = () => {
        console.log("클릭")

        close();
    }

    //체크박스 데이터
    const checkhandler = (check, value) => {
        console.log("체크핸들러시작")
        if (check) {
            setChecklist((prev) => [...prev, value])

            return
        }
        if (!check && checklist.includes(value)) {
            setChecklist(checklist.filter((data) => data !== value))

            return
        }


        return
    }

    const Userinvite = useMutation({
        mutationFn: ({ roomid, checklist }) => {

            axiosinstance.post("/chatroominvite", {
                roomid: roomid,
                userlist: checklist
            })
        },
        onSuccess: (res) => {
            alert("성공적으로초대하였습니다")
            //다른컴포넌트라그냥새로
            queryclient.invalidateQueries("chatdata")
        },
        onError: (err) => {
            alert(err)
        }
    })

    const Invite = (roomid, checklist) => {
        if(checklist.length<1){
            alert("초대대상을선택해주세요")
        }else{
        Userinvite.mutate({ roomid, checklist })
        }
    }
    //채팅창 유저비교 

    const existinguser = (usernickname) => {

        let value = false;


        //roomusers.forEach((data)=>{})} 포이치문브레이크안되서효율이안조흐..return도continue고..
        for (var i = 0; i < roomusers.length; i++) {
            console.log("유저데이터:" + roomusers[i].membernickname)
            if (usernickname === roomusers[i].membernickname) {


                value = true;
                return value;
            }

        }
        console.log("끝")
        return value;


    }



    return (
        <Modal className="chatroommenu">
            <Headers>
                <ExitButton onClick={clossmodal}></ExitButton>

                <HeaderText>팔로우목록</HeaderText>

                <Invitebutton onClick={() => {
                    Invite(roomid, checklist)

                }} >

                    초대하기</Invitebutton>

            </Headers>
            {/*여기에 초대누른목록 추가 */}
            {/*검색 */}


            <Searchinput type="text" style={{ position: "relative", width: "80%" }}
                onChange={(e) => {

                    setSearch(e.target.value);
                }}
            />


            <Userlist>
                {/*친구목록 */}
                {followlist && followlist.filter((filter) => {
                    //하나씩 조건통과하면 리턴 아니면 리턴안함 ㅇ
                    if (search === " ") {
                        return filter
                    }

                    else if (filter.nickname.includes(search)) {
                        return filter;
                    }
                    else if (filter.username.includes(search)) {
                        return filter;
                    }
                })

                    .map((data) => {
                        //이프로검사
                        if (existinguser(data.nickname)) {
                            console.log("기존에있는경우!")
                            return (
                                <Userli>
                                    
                                    <Userprofilecss>
                                        <Profilediv url={data.profileurl} />
                                     </Userprofilecss>
                                    {data.nickname}
                                    <br />
                                    {data.username}

                                </Userli>
                            )
                        }
                        else {

                            return (

                                <label for={data.username} >
                                    <Userli>
                                        <Userprofilecss>
                                        <Profilediv url={data.profileurl} />
                                        </Userprofilecss>
                                        <Username>
                                            {data.nickname}
                                            <br />
                                            {data.username}
                                        </Username>
                                        <Usercheck id={data.username} type="checkbox"
                                            //checked={checked}
                                            onChange={(e) => {
                                                console.log("온채인지")
                                                checkhandler(e.target.checked, e.target.id)
                                            }}
                                            style={{ float: "right", borderRadius: "10px" }} />


                                        <br />

                                    </Userli>
                                </label>




                            )
                        }

                    })}
            </Userlist>
            {checklist.map((data) => {
                return (<>
                    {data}</>)
            })}
        </Modal>


    )


}
export default ChatFollowlistmodal