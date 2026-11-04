"use client"
import { useEffect } from "react"
import Image, { StaticImageData } from "next/image"
import { Userlist } from "./store"
import { Card } from "./ui/card"
import { CardContent } from "./ui/card"
import { Avatar } from "./ui/avatar"
import { AvatarImage } from "./ui/avatar"
import { AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { ArrowBigRightDash } from "lucide-react"
import { SearchX } from "lucide-react"
import Imagee from '@/images/man.png'
import { Onetooneconversationsendrequest } from "./store"
import { Toklue } from "./store"
import { UsercurrentId } from "./store"
import { Parmkey } from "./store"
import { Switchvalue } from "./store"
import { Searchexistgrouplist } from "./store"
import { onetoonerequest } from "@/types/request"
import { groupmember, grpstatustype } from "@/types/groupconversations"
import toast from "react-hot-toast"
import { set } from "@/socketserver/clientsidesocket"
import { status } from "@/types/1to1conversations"
export default function Userlistttttt(){
    const users=Userlist(s=>s.users)
    const message=Userlist(s=>s.message)
    const onetooneconversationsendrequest=Onetooneconversationsendrequest(s=>s.requsts)
    const setonetooneconversationsendrequest=Onetooneconversationsendrequest(s=>s.setrequests)
    const toklue=Toklue(s=>s.name)
    const userid=UsercurrentId(s=>s.name)
    const parmkey=Parmkey(s=>s.name)
    const grouporonetoone=Switchvalue(s=>s.value)
    const searchgroupexistlist=Searchexistgrouplist(s=>s.groups)
    const usercurrentid=UsercurrentId(s=>s.name)
    function gettext(value:string,valuee:string){
        if(value==="send"){
            return <span className="text-gray-500 text-sm">Request already send</span>
        }
        else if(value==="recieved"){
            return <div className="h-full flex flex-col items-start space-y-2">
                <span className="text-gray-500 text-sm">Request recieved</span>
                <Button variant={"outline"} className="text-black text-sm">See requests</Button>
            </div>
        }
        else{
            return <Button variant={"outline"} className="text-black" onClick={(e)=>{e.stopPropagation();handlerequestfor1to1conversation(userid,valuee)}}>Send request</Button>
        }
    }
    function handlerequestfor1to1conversation(senderId:string,recieverId:string){
        console.log("request send",senderId,recieverId,toklue)
            set("request:onetooneconversation",{token:toklue,senderId:senderId,recieverId:recieverId})
            if(!onetooneconversationsendrequest.find(data=>(data.recieverId===recieverId&&data.senderId===senderId))){
            setonetooneconversationsendrequest({senderId:senderId,recieverId:recieverId,sendAt:new Date(),status:"pending"})
            }
        }
        function getbadge(value:groupmember[]){
            if(value?.some(data=>data.id===usercurrentid)){
                return "Admin"
            }
            else{
                return "No member"
            }
        }
      function handlesendgrouprequest(groupId:string){
        console.log("groupsendrequest")
        set("request:sendgrouprequest:group",{groupId:groupId,token:toklue,status:"pending",type:"group_join_request"})
    }
        useEffect(()=>{
        console.log(users)
    },[users])
    console.log("paramkey",parmkey)
    console.log("searchgrouplist",searchgroupexistlist)
    console.log(grouporonetoone)
    return(
       <>{(users.length||searchgroupexistlist)?<div className="flex-1 h-full w-full flex flex-col items-center justify-start"><div className="w-full flex items-center justify-center text-xl text-gray py-5 px-6">
        <span>{`${message}`}</span>
        </div><div className="flex flex-col items-center justify-start space-y-5">{grouporonetoone?searchgroupexistlist.map(data=><Popover key={data.groupId}>
  <div
    key={data.groupId}
    className="w-[397px] rounded-xl border border-black/10 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] px-3 py-3 transition hover:shadow-md"
  >
    <div className="flex items-center gap-4">
      {/* Group Image */}
      <Image
        src={Imagee}
        alt="Group image"
        className="h-[54px] w-[54px] rounded-full object-cover border border-black/10"
      />

      {/* Center Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-black truncate">
            {data.name}
          </h2>

          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0 ${
              data.status === "active"
                ? "border-green-300 bg-green-50 text-green-700"
                : "border-red-300 bg-red-50 text-red-700"
            }`}
          >
            {data.status}
          </Badge>
        </div>

        <p className="mt-1 text-[12px] text-gray-500 line-clamp-1">
          {data.description || "No description available"}
        </p>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] text-gray-500">
            {data.member_no} members
          </span>
        </div>
      </div>

      {/* Right Action */}
      <PopoverTrigger asChild>
        <button className="h-9 px-3 rounded-lg bg-black text-white text-xs font-medium hover:bg-black/90 transition">
          Join
        </button>
      </PopoverTrigger>
    </div>
  </div>

  {/* Popover */}
  <PopoverContent
    align="end"
    className="w-[260px] rounded-xl border border-black/10 p-4"
  >
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-black">
          Join {data.name}?
        </h3>

        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
          A join request will be sent to the admins of this group.
        </p>
      </div>

      <div className="rounded-lg bg-black/5 p-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Group Code</span>
          <span className="font-medium tracking-wider text-black">
            {data.code}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-gray-500">Created</span>
          <span className="text-black">
            {new Date(data.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button className="flex-1 h-9 rounded-lg border border-black/10 text-sm hover:bg-black/5 transition">
          Cancel
        </button>

        <button
          onClick={(e)=>{e.stopPropagation();handlesendgrouprequest(data.groupId)}}
          className="flex-1 h-9 rounded-lg bg-black text-white text-sm hover:bg-black/90 transition"
        >
          Send Request
        </button>
      </div>
    </div>
  </PopoverContent>
</Popover>):users.map(data=><div key={data._id} className="w-[407px] h-[73px] flex items-center rounded-md px-2 space-x-5 shadow-[0_0_11px_2px_rgb(0,0,0,0.1)]">
            <Image src={Imagee} alt="An image" className="h-[53px] w-[53px] rounded-full"/>
            <div className="min-h-full flex flex-col items-start justify-evenly py-2">
                <span className="text-black text-xs">{data.name}</span>
                {userid===data._id?<Badge variant={"outline"} className="bg-green-300 text-black">You</Badge>:<span className="text-gray-300 text-xs">{data.email}</span>}
            </div>
            <div className="h-full flex items-center justify-center ml-auto">
                {gettext(data.request_send,data._id)}
            </div>
           </div>)}</div></div>:<div className="h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
            <span className="text-xl text-black">{message}</span>
            <SearchX size={53} color="black"/>
        </div>
        </div>}</>
    )
}