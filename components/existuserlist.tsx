"use client"
import Image from "next/image"
import { useEffect } from "react"
import { Button } from "./ui/button"
import { ButtonGroup } from "./ui/button-group"
import { Badge } from "./ui/badge"
import { Collapsible } from "./ui/collapsible"
import { CollapsibleTrigger } from "./ui/collapsible"
import { CollapsibleContent } from "./ui/collapsible"
import { Userexistlistt } from "./store"
import { Toklue } from "./store"
import { Currentselecteduserconversationname } from "./store"
import { Conversationpagination } from "./store"
import { Chatypeose } from "./store"
import { Groupexists } from "./store"
import { Chatypepicked } from "./store"
import { UsercurrentId } from "./store"
import { Reloadeverything } from "./store"
import { ArrowBigRight } from "lucide-react"
import { ChevronRight } from "lucide-react"
import { set } from "@/socketserver/clientsidesocket"
import Imagee from '@/images/man.png'
import { groupmember } from "@/types/groupconversations"
import { grpstatustype } from "@/types/groupconversations"
export default function Existuserlist(){
    const usrsss=Userexistlistt(s=>s.users)
    const toklue=Toklue(s=>s.name)
    const setcurrentselecteduserconversationname=Currentselecteduserconversationname(s=>s.setname)
    const cursorId=Conversationpagination(s=>s.cursor_id)
    const chatype=Chatypeose(s=>s.type)
    const setchatype=Chatypeose(s=>s.setype)
    const groupexistlist=Groupexists(s=>s.groups)
    const chatypepicked=Chatypepicked(s=>s.type)
    const setchatypepicked=Chatypepicked(s=>s.settype)
    const usercurrentid=UsercurrentId(s=>s.name)
    const reloadgrpexistlist=Reloadeverything(s=>s.Grpexistlist)
    const reloadonetooneexistlist=Reloadeverything(s=>s.Onetooneexistlist)
    function handleonetooneconversationroom(senderId:string,name:string){
        setcurrentselecteduserconversationname(name)
        setchatypepicked("dm")
        console.log(senderId,name)
        set("request:conversations:onetooneconversations",{senderId:senderId,token:toklue})
    }
    console.log(cursorId)
    function handlegroupconversationroom(groupId:string){
      setchatypepicked("group")
        set("request:groupconversations:group",{groupId:groupId,token:toklue})
    }
    function gettext(value:groupmember[]){
        if(value.some(data=>data.id===usercurrentid)){
            return "admin"
        }
        else{
            return "member"
        }
    }
    function getcolor(value:grpstatustype){
        if(value==="active"){
            return "text-green-300"
        }
        else if(value==="deleted"){
            return "text-red-300"
        }
        else{
            return "text-gray"
        }
    }
    function getbgcolor(value:grpstatustype){
        if(value==="active"){
            return "bg-green-500/10"
        }
        else if(value==="deleted"){
            return "bg-red-500/10"
        }
        else{
            return "bg-gray-300/10"
        }
    }
    useEffect(()=>{
        console.log(usrsss)
    },[usrsss])
    useEffect(()=>{
        if(usrsss.length){
           const interval=setInterval(()=>{
            usrsss.forEach((value)=>{
                set("request:online:onetooneconversation",{token:toklue,id:value._id})
            })
           },1500)
           return ()=>clearInterval(interval)
        }
    },[usrsss])
    useEffect(()=>{
      set("request:reload:groupexistlist:group",{token:toklue})
      set("request:reload:conversation:onetooneconversation",{token:toklue})
    },[])
    useEffect(()=>{
      set("request:reload:grouprequestrecieve:group",{token:toklue})
      set("request:reload:grouprequestsend:group",{token:toklue})
      set("request:reload:onetooneconversationrequests:onetooneconversation",{token:toklue})
    },[])
    console.log(groupexistlist)
    return(<><div className="flex-1 flex flex-col items-center justify-start">
        <div className="w-full flex items-center px-6 py-6">
            <ButtonGroup>
                <Button variant={"outline"} className={`${chatype==="group"?"text-white bg-black":"text-black bg-white"}`} onClick={(e)=>{e.stopPropagation();setchatype("group")}}>Group chat</Button>
                <Button variant={"outline"} className={`${chatype==="onetoone"?"text-white bg-black":"text-black bg-white"}`} onClick={(e)=>{e.stopPropagation();setchatype("onetoone")}}>One to one chat</Button>
            </ButtonGroup>
        </div>
        <>{chatype==="onetoone"?<><div className="flex items-center justify-center text-xl text-gray-500 px-5 py-6">{`${usrsss.length} conversations exists`}</div>
        <div className="flex flex-col items-center justify-start space-y-5">{usrsss.map(data=>
            <div key={data._id} className="h-[73px] w-[397px] flex items-center rounded-md px-2 space-x-5 shadow-[0_0px_11px_2px_rgb(0,0,0,0.1)]">
               <Image src={Imagee} alt="An image" className="h-[53px] w-[53px] rounded-full"/>
               <div className="flex flex-col items-start justify-evenly py-2">
                <span className="text-black text-xs">{data.name}</span>
                <span className="text-gray-300 text-xs">{data.email}</span>
               </div>
               <div className="flex items-center justify-center ml-auto mr-2">
                <Button variant={"outline"} className="text-black" onClick={(e)=>{e.stopPropagation();handleonetooneconversationroom(data._id,data.name)}}><ChevronRight size={23} color="black"/></Button>
               </div>
               {data.unred_messages?<span className="text-white rounded-full bg-green-300 ml-auto">{data.unred_messages}</span>:<></>}
            </div>
        )}</div></>:<><div className="flex items-center justify-center text-xl text-gray-500 px-5 py-6">{`${groupexistlist.length} conversations exists`}</div>
        <div className="flex flex-col items-center justify-start space-y-5">{groupexistlist.map((data) => (
  <Collapsible
    key={data.groupId}
    className="w-[397px] rounded-xl border border-black/10 bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)] px-3 py-3"
  >
    {/* Top Row */}
    <div className="flex items-center gap-4">
      <Image
        src={Imagee}
        alt="Group image"
        className="h-[56px] w-[56px] rounded-full object-cover border border-black/10"
      />

      {/* Center */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-black truncate">
            {data.name}
          </span>

          <Badge
            variant="outline"
            className={`text-[10px] px-2 py-0 ${
              data.status === "active"
                ? "text-green-700 border-green-300 bg-green-50"
                : "text-red-700 border-red-300 bg-red-50"
            }`}
          >
            {data.status}
          </Badge>
        </div>

        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <Badge
            variant="secondary"
            className="text-[10px] font-normal bg-black/5 text-black"
          >
            {gettext(data.admins_info)}
          </Badge>

          <span className="text-[11px] text-gray-500">
            {data.member_no} members
          </span>
        </div>
      </div>
      {/* Right */}
      <CollapsibleTrigger asChild>
        <button className="h-8 w-8 rounded-md bg-black/5 hover:bg-black/10 flex items-center justify-center text-black text-sm transition">
          +
        </button>
      </CollapsibleTrigger>
      <Button variant={"outline"} className="text-primary" onClick={(e)=>{e.stopPropagation();handlegroupconversationroom(data.groupId)}}><ArrowBigRight size={15} color="black"/></Button>
    </div>

    {/* Expand Section */}
    <CollapsibleContent>
      <div className="mt-4 border-t border-black/10 pt-3 space-y-3">
        <div>
          <p className="text-[11px] text-gray-500">Description</p>
          <p className="text-xs text-black leading-relaxed">
            {data.description || "No description added"}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-500">Group Code</p>
            <p className="text-xs font-medium tracking-widest text-black">
              {data.code}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-gray-500">Created</p>
            <p className="text-xs text-black">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </CollapsibleContent>
  </Collapsible>
))}</div>
        </>}</>
        
    </div></>)
}