"use client"
import { useRef } from "react"
import { useRouter } from "next/navigation"
import { Userlist, Usrlst } from "@/components/store"
import { Onetooneconversationrequest } from "@/components/store"
import { Onetooneconversationsendrequest } from "@/components/store"
import { Onetooneconversationdetails } from "@/components/store"
import { Userexistlistt } from "@/components/store"
import { Parmkey } from "@/components/store"
import { Typingindicator } from "@/components/store"
import { Onlineindicator } from "@/components/store"
import { Conversationpagination } from "@/components/store"
import { Toklue } from "@/components/store"
import { UsercurrentId } from "@/components/store"
import { Searchexistgrouplist} from '@/components/store'
import { Groupsendrequest } from "@/components/store"
import { Grouprecieverequest } from "@/components/store"
import { Groupexists } from "@/components/store"
import { Grouppicked } from "@/components/store"
import { Grouptypinglist } from "@/components/store"
import { Grouppagination } from "@/components/store"
import { GroupuserseenmessageId } from "@/components/store"
import { Grouptypingonline } from "@/components/store"
import toast from "react-hot-toast"
import { conversations, messagestatus, oneto1conversation, status } from "@/types/1to1conversations"
import { authenticate, usrlist, usrlistt } from "@/types/user"
import { messagetypee } from "@/types/1to1conversations"
import { groupconversation, groupconversations, grouprequest, groupsettings, groupsexistlist, grpconversations, grpstatustype, promote } from "@/types/groupconversations"
import { groupmember } from "@/types/groupconversations"
import { grouponlinetyping } from "@/types/groupconversations"
import { Reloadeverything } from "@/components/store"
import { Userdetails } from "@/components/store"
import { Colabexistroomlist } from "@/components/store"
import { Colabsearchroomlist } from "@/components/store"
import { Colabsearchuserlist } from "@/components/store"
import { Colabrequests } from "@/components/store"
import { Roompicked } from "@/components/store"
import { Onlinelist } from "@/components/store"
import { Documentupload } from "@/components/store"
import { Dashboarddetails } from "@/components/store"
import { Activitylist } from "@/components/store"
import { StringDecoder } from "string_decoder"
import { id } from "date-fns/locale"
import { onetoonerequest } from "@/types/request"
import { activity, Colabrequest, collabrole, IDocument, message, Room, RoomMemberEntry, roomtype, SearchRoom, Searchuser } from "@/types/collab"
import room from "@/models/room"
import { Router } from "next/router"
type Listener=(data:any)=>void
const Listeners=new Map<string,Listener[]>()
let socketinstanceref:WebSocket|null=null
export function socket(){
  if(socketinstanceref) socketinstanceref
  const setuserlist=Userlist.getState().setusrs
  const setmessage=Userlist.getState().setmessage
  const setremovesearchuserlist=Userlist.getState().setremoveuser
  const setonetooneconversationrequest=Onetooneconversationrequest.getState().setrequests
  const setremoveonetooneconversationrequest=Onetooneconversationrequest.getState().setremovespecificrequest
  const setmarkonetooneconversationrequest=Onetooneconversationrequest.getState().setmarkspecificrequest
  const setonetooneconversationrecieverequests=Onetooneconversationrequest.getState().setrequsts
  const setremoveonetooneconversationsendrequest=Onetooneconversationsendrequest.getState().setremovespecificrequest
  const setmarkonetooneconversationsendrequest=Onetooneconversationsendrequest.getState().setmarkspecificrequest
  const setonetooneconversationsendrequests=Onetooneconversationsendrequest.getState().setrequsts
  const onetooneconversationdetails=Onetooneconversationdetails.getState().onetooneconversationdetails
  const setonetooneconversationdetails=Onetooneconversationdetails.getState().setonetooneconversationdetails
  const setonetooneconversationdetailsmessage=Onetooneconversationdetails.getState().setmessage
  const setparamkey=Parmkey.getState().setname
  const setonetooneconversationdetailsmarkstatusmessage=Onetooneconversationdetails.getState().setmarkmessagestatus
  const setonetooneconversationdetailsmarkglobalmessage=Onetooneconversationdetails.getState().setmarkmessagestatusglobalid
  const setprependmessagesonetooneconversation=Onetooneconversationdetails.getState().setprependmessages
  const setmarkonetooneconversationdetails=Onetooneconversationdetails.getState().setmarkonetooneconversationdetails
  const setonetooneconversationmessageslice=Onetooneconversationdetails.getState().setslicemessage
  const setsendername=Onetooneconversationdetails.getState().setsendername
  const setrecievername=Onetooneconversationdetails.getState().setrecievername
  const setsenderdescription=Onetooneconversationdetails.getState().setsenderdescription
  const setrecieverdescription=Onetooneconversationdetails.getState().setrecieverdescription
  const seteditmessageonetooneconversation=Onetooneconversationdetails.getState().seteditmessage
  const setuserexistlistt=Userexistlistt.getState().setusrs
  const setuserexistlist=Userexistlistt.getState().setuser
  const userexistmessage=Userexistlistt.getState().message
  const existuserlist=Userexistlistt.getState().users
  const setuserexistmessage=Userexistlistt.getState().setmessage
  const setremoveuserexistlist=Userexistlistt.getState().setremoveuser
  const setusersexistlist=Userexistlistt.getState().setusrs
  const setuserexistlistunredmessages=Userexistlistt.getState().setunreadmesages
  const setuserexistlistseenmessages=Userexistlistt.getState().setseenmesages
  const settypingid=Typingindicator.getState().setid
  const settypingstatus=Typingindicator.getState().settyping
  const setonlineid=Onlineindicator.getState().setid
  const setonlinestatus=Onlineindicator.getState().setonline
  const setseenon=Onlineindicator.getState().setseenon
  const setcursorid=Grouppagination.getState().setcursorid
  const sethasmore=Grouppagination.getState().sethasmore
  const setonetooneconversationsendrequest=Onetooneconversationsendrequest.getState().setrequestss
  const setonetooneconversationrecieverequest=Onetooneconversationrequest.getState().setrequestss
  const token=Toklue.getState().name
  const usercurrentid=UsercurrentId.getState().name
  const searchexistgrouplist=Searchexistgrouplist.getState().groups
  const setsearchexistgrouplist=Searchexistgrouplist.getState().setgroups
  const setsearchexistgrouplistmessage=Searchexistgrouplist.getState().setmessage
  const setstatussearchgroupexist=Searchexistgrouplist.getState().setstatus
  const setremovesearchgroupexist=Searchexistgrouplist.getState().removegroup
  const setaddmembersearchgroupexist=Searchexistgrouplist.getState().setaddmember
  const setremovemembersearchgroupexistlist=Searchexistgrouplist.getState().setremovemember
  const setremoveadminsearchgroupexistlist=Searchexistgrouplist.getState().setremoveadmin
  const setsendgrouprequest=Groupsendrequest.getState().setrequest
  const setgroupsendrequests=Groupsendrequest.getState().setrequests
  const setstatussendgrouprequest=Groupsendrequest.getState().setrequeststatus
  const setremovegroupsendrequest=Groupsendrequest.getState().removerequest
  const setrecievegrouprequest=Grouprecieverequest.getState().setrequest
  const setrecievegrouprequests=Grouprecieverequest.getState().setrequests
  const setstatusrecievegrouprequest=Grouprecieverequest.getState().setrequeststatus
  const setremovegrouprecieverequest=Grouprecieverequest.getState().removerequest
  const setaddmembergroupexistlist=Groupexists.getState().setaddmember
  const setaddgroupexistlist=Groupexists.getState().setgroup
  const setaddgroupsexistlist=Groupexists.getState().setgroups
  const setremovegroupexistlist=Groupexists.getState().removegroup
  const setremovemembergroupexistlist=Groupexists.getState().setremovemember
  const setremoveadmingroupexistlist=Groupexists.getState().setremoveadmin
  const setaddadmingroupexistlist=Groupexists.getState().setaddadmin
  const setaddgrouppicked=Grouppicked.getState().setconversation
  const setaddgroupconversations=Grouppicked.getState().setconversations
  const setaddgroupsngleconversations=Grouppicked.getState().setsngleconversations
  const setviewgroupmessage=Grouppicked.getState().setviewmessage
  const setaddgroupadmin=Grouppicked.getState().setgroupadmin
  const setremovegroupadmin=Grouppicked.getState().removegroupadmin
  const setremovemembergrouppicked=Grouppicked.getState().removegroupmember
  const grouppicked=Grouppicked.getState().group
  const setgrouppagimessages=Grouppicked.getState().setpagimessages
  const setgroupslicemessage=Grouppicked.getState().setslicemessage
  const setgroupmessagestatuschange=Grouppicked.getState().setconversationchangestatus
  const setgroupconversationmessageedit=Grouppicked.getState().setconversationmessageedit
  const setgroupsettings=Grouppicked.getState().setgroupsettings
  const setgroupname=Grouppicked.getState().setgroupname
  const setgroupdescription=Grouppicked.getState().setgroupdescription
  const addtypingmember=Grouptypinglist.getState().setaddtyping
  const removetypingmember=Grouptypinglist.getState().setremovetyping
  const setchangestatustyping=Grouptypinglist.getState().settyping
  const typinggrouplist=Grouptypinglist.getState().typing
  const grouphasMore=Grouppagination.getState().hasMore
  const groupcursorId=Grouppagination.getState().cursor_id
  const setgroupcursorId=Grouppagination.getState().setcursorid
  const setgrouphasmore=Grouppagination.getState().sethasmore
  const setgroupuserseenmessageid=GroupuserseenmessageId.getState().setname
  const setgrouptypingonlinelist=Grouptypingonline.getState().setlist
  const setgrouptypingstatus=Grouptypingonline.getState().setchangetypingstatus
  const grouptypinglist=Grouptypingonline.getState().list
  const setreloadgrpexistlist=Reloadeverything.getState().setgrpexistlist
  const setreloadgrprequestsrecieve=Reloadeverything.getState().setgrprequestsrecieve
  const setreloadgrprequestssend=Reloadeverything.getState().setgrprequestssend
  const setreloadonetooneexistlist=Reloadeverything.getState().setonetooneexistlist
  const setreloadonetoonerequests=Reloadeverything.getState().setonetoonerequests
  const setusername=Userdetails.getState().setname
  const setuseremail=Userdetails.getState().setemail
  const setcolabexistroomlist=Colabexistroomlist.getState().setroom
  const setcolabexistrooms=Colabexistroomlist.getState().setrooms
  const setcolabexistroommember=Colabexistroomlist.getState().setroommember
  const setcolabexistroomremovemember=Colabexistroomlist.getState().setroomremovemember
  const setcolabexistroomremoveroom=Colabexistroomlist.getState().setremoveroom
  const setcolabexistroomname=Colabexistroomlist.getState().setname
  const setcolabexistroomdescription=Colabexistroomlist.getState().setdescription
  const setcolabexistroomcode=Colabexistroomlist.getState().setcode
  const setcolabremoveroom=Colabexistroomlist.getState().setremoveroom
  const setdocumentcount=Colabexistroomlist.getState().setdocumentcount
  const setcolabsearchroomslist=Colabsearchroomlist.getState().setrooms
  const setcolabsearchuserlist=Colabsearchuserlist.getState().setusrs
  const setcolabrequests=Colabrequests.getState().setrequests
  const setcolabrequeststatus=Colabrequests.getState().setrequeststatus
  const setroompicked=Roompicked.getState().setroom
  const setroommessages=Roompicked.getState().setmessages
  const setroomdocuments=Roompicked.getState().setdocuments
  const setroomdocument=Roompicked.getState().setdocument
  const removeroomdocument=Roompicked.getState().removedocument
  const setroomdocumentcontenttext=Roompicked.getState().setdocumentcontenttext
  const setroomdocumentcontentcanvas=Roompicked.getState().setdocumentcontentcanvas
  const setroommessage=Roompicked.getState().setmessage
  const setroommemberstatus=Roompicked.getState().setroommemberrole
  const setroomdocumentlockedBy=Roompicked.getState().setdocumentlockedBy
  const setroommessagestatus=Roompicked.getState().setmessagestatus
  const setroommemberlastseenmessageid=Roompicked.getState().setmemberlastseenmessageid
  const setroomeditmessage=Roompicked.getState().setmessageedit
  const setroompagimessages=Roompicked.getState().setpagimessages
  const setroommembermute=Roompicked.getState().setroommembermuted
  const setroomname=Roompicked.getState().setroomname
  const setroomdescription=Roompicked.getState().setroomdescription
  const setroomremovemember=Roompicked.getState().setroomremovemember
  const setroomcode=Roompicked.getState().setroomcode
  const setroomdocumentvisibility=Roompicked.getState().setdocumentvisibility
  const setroomdocumenttitle=Roompicked.getState().setdocumenttitle
  const setroommemberonline=Roompicked.getState().setroommemberonline
  const setroommembertyping=Roompicked.getState().setroommembertyping
  const setroomdocumentstatus=Roompicked.getState().setroomdocumentstatus
  const setonlinelist=Onlinelist.getState().setlist
  const setisuploadingdocument=Documentupload.getState().setisuploading
  const setisuploadeddocument=Documentupload.getState().setisuploaded
  const settextdocument=Documentupload.getState().settext
  const dashboarddocuments=Dashboarddetails.getState().documents
  const setdashboarddocuments=Dashboarddetails.getState().setdocuments
  const setdashboardlastseen=Dashboarddetails.getState().setlastactivity
  const setactivitys=Activitylist.getState().setactivitys
  const setusrlst=Usrlst.getState().setusers
  const setremoveusers=Usrlst.getState().removeusers
  const setuserchangename=Usrlst.getState().setuserchangename
  socketinstanceref=new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}?token=${token}`)
  function handlemessage(){
    toast.error("no user found")
    setmessage("No user found")
    setuserlist([])
  }
  function handletoast(message:string){
    toast.error(message)
  }
  function handlerecievertoast(){
    toast.success("You have an new request")
  }
  function handlesendertoast(message:string){
    toast.success(message)
  }
  function handlesenderacceptedtoast(message:string){
    toast.success(message)
  }
  function handlerecieveracceptedtoast(message:string){
    toast.success(message)
  }
  function handlesenderrejectedtoast(message:string){
    toast.error(message)
  }
  function handlerecieverrejectedtoast(message:string){
    toast.error(message)
  }
  function getkey(senderId:string,recieverId:string){
    const array=[senderId,recieverId].sort((a,b)=>a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase())).join(":")
    return array
  }
  function handleonetooneconversationmessages(senderId:string,recieverId:string,createdAt:Date,message:string,_id:string,status:messagestatus,senderwho:string,global_id:string,messages_seen:{unred_messages:number,seen:boolean},replyto:{global_id:string,message:string}){
    setonetooneconversationdetailsmessage({senderId:_id,message:message,createdAt:createdAt,status:status,global_id:global_id,replyto:replyto})
    if(_id!==UsercurrentId.getState().name){
      setuserexistlistunredmessages(messages_seen.unred_messages,_id)
      setuserexistlistseenmessages(messages_seen.seen,_id)
    }
    setonetooneconversationmessageslice()
  }
  function handleonetooneconversationdeletedmessages(message:string,createdAt:Date,_id:string,senderwho:string,globalId:string){
    setonetooneconversationdetailsmarkglobalmessage(globalId,"deleted")
    if(senderwho==="sender"){
      toast.success("message deleted for everyone")
    }
  }
  function handleonetooneconversationviewmessages(global_id:string,status:messagestatus,messages_seen:{unred_messages:number,seen:boolean},_id:string,senderId:string){
    setonetooneconversationdetailsmarkglobalmessage(global_id,status)
    if(_id===UsercurrentId.getState().name){
      setuserexistlistunredmessages(messages_seen.unred_messages,senderId)
      setuserexistlistseenmessages(messages_seen.seen,senderId)
    }
  }
  function handleremoveonetooneconversationrequest(senderId:string,recieverId:string){
    setremovesearchuserlist(recieverId)
  }
  function handleaddexistuser(userr:usrlistt){
    setuserexistlist(userr)
  }
  function handleremoveonetooneconversationrecrequest(senderId:string){
    setremovesearchuserlist(senderId)
  }
  function handletypingonetooneconversation(id:string,typing:boolean){
    settypingid(id)
    settypingstatus(typing)
  }
  function handleuserstatusonetooneconversation(id:string,status:boolean){
    setonlineid(id)
    setonlinestatus(status)
  }
  function handleloadmoreonetooneconversations(hasMore:boolean,cursor_id:string,messages:messagetypee[]){
    console.log("infunction",hasMore,cursor_id,messages)
    setprependmessagesonetooneconversation(messages)
    setcursorid(cursor_id)
    sethasmore(hasMore)
  }
  function handleleaveconversationtoast(value:string){
    toast.success(value)
    setmarkonetooneconversationdetails("deleted")
  }
  function handledeleteformetoast(message:string,messageId:string,status:messagestatus){
    setonetooneconversationdetailsmarkglobalmessage(messageId,status)
    toast.success(message)
  }
  function handlenamechangeonetooneconversation(message:string,_id:string,name:string){
    const senderId=Onetooneconversationdetails.getState().onetooneconversationdetails.senderId._id
    const recieverId=Onetooneconversationdetails.getState().onetooneconversationdetails.recieverId._id
    if(senderId===_id){
        setsendername(name)
    }
    else if(recieverId===_id){
      setrecievername(name)
    }
    toast.success(message)
  }
  function handledescriptionchangeonetooneconversation(message:string,_id:string,description:string){
    const senderId=Onetooneconversationdetails.getState().onetooneconversationdetails.senderId._id
    const recieverId=Onetooneconversationdetails.getState().onetooneconversationdetails.recieverId._id
    if(senderId===_id){
      setsenderdescription(description)
    }
    else if(recieverId===_id){
      setrecieverdescription(description)
    }
  }
  function handlelogoutonetooneconversation(id:string,date:Date){
      setonlineid(id)
      setonlinestatus(false)
      setseenon(date)
  }
  function handleeditmessageonetooneconversation(global_id:string,message:string,_id:string){
    if(UsercurrentId.getState().name===_id){
      toast.success("Message edited successfully")
    }
    seteditmessageonetooneconversation(global_id,message)
  }
  function handlenogrouptoast(message:string){
      toast.success(message)
  }
  function handlesearchgroupexistlist(groups:groupsexistlist[],message:string){
      setsearchexistgrouplist(groups)
      setsearchexistgrouplistmessage(message)
  }
  function handletoaststatuserrorchange(message:string){
    toast.error(message)
  }
  function handlegroupstatuschange(groupId:string,status:grpstatustype){
    setstatussearchgroupexist(status,groupId)
  }
  function handlesendgrouprequest(message:string,request:grouprequest){
    if(message!=="Request already send"){
    setsendgrouprequest(request)
    toast.success(message)
    }
    else{
      toast.error(message)
    }
  }
  function handlerecievegrouprequest(message:string,request:grouprequest){
    setrecievegrouprequest(request)
    toast.success(message)
  }
  function handlerecievergrouprequesterror(message:string){
    toast.success(message)
  }
  function handlerecievergrouprequestaccept(groupId:string,member:groupmember,status:status){
    setstatusrecievegrouprequest(status,groupId,member.id)
    setaddmembergroupexistlist(groupId)
    setaddmembersearchgroupexist(groupId)
    toast.success("You accepted request")
  }
  function handlesendergrouprequesterror(message:string){
    toast.error(message)
  }
  function handlesendergrouprequestaccept(group:groupsexistlist,groupId:string,sendBy:string,status:status){
    setstatussendgrouprequest(status,groupId,sendBy)
    setremovesearchgroupexist(groupId)
    setaddmembersearchgroupexist(groupId)
    setaddmembergroupexistlist(groupId)
    setaddgroupexistlist(group)
    toast.success("Ur request got accepted")
  }
  function handlecreategrouperror(message:string){
    toast.error(message)
  }
  function handlecreategroup(group:groupsexistlist){
    setaddgroupexistlist(group)
    toast.success("Group created Successfully")
  }
  function handlegroupinviterequestalreadysend(message:string){
    toast.error(message)
  }
  function handlegroupinviterequestsend(request:grouprequest,message:string){
    setsendgrouprequest(request)
    toast.success(message)
  }
  function handlegroupinviteacceptsendto(groupId:string,sendBy:string,group:groupsexistlist,message:string){
    setstatusrecievegrouprequest("accepted",groupId,sendBy)
    setaddmembersearchgroupexist(groupId)
    setaddmembergroupexistlist(groupId)
    setaddgroupexistlist(group)
    toast.success(message)
  }
  function handlegroupinviteacceptsendby(groupId:string,sendTo:string,message:string){
    setstatussendgrouprequest("accepted",groupId,usercurrentid)
    setaddmembersearchgroupexist(groupId)
    setaddmembergroupexistlist(groupId)
    toast.success(message)
  }
  function handlegroupinviterequestrecieve(request:grouprequest,message:string){
    setrecievegrouprequest(request)
    toast.success(message)
  }
  function handlegroupconversation(group:groupconversation,groupmessages:groupconversations[]){
    setaddgroupconversations(groupmessages)
    setaddgrouppicked(group)
    setparamkey(group.groupId)
  }
  function handlegroupsendmessagetoast(value:string){
    toast.error(value)
  }
  function handlegroupsendmessage(conversation:groupconversations,message:string){
    setaddgroupsngleconversations(conversation)
    setgroupslicemessage()
    toast.success(message)
  }
  function handleviewgroupmessage(groupId:string,globalId:string,messageId:string){
    setviewgroupmessage(usercurrentid,messageId)
    setgroupuserseenmessageid(messageId)
  }
  function handlechangememberstatustoast(message:string){
    toast.error(message)
  }
  function handlechangememberstatus(promoteId:string,status:promote,name:string,extramessage:string){
    if(status==="admin"){
      setaddgroupadmin(promoteId,name)
    }
    else if(status==="member"){
      setremovegroupadmin(promoteId)
    }
    toast.success(extramessage)
  }
  function handlememberleavegroup(id:string,groupId:string){
     if(id===UsercurrentId.getState().name){
        setremovegroupexistlist(groupId)
        setremovesearchgroupexist(groupId)
        setremovegroupsendrequest(groupId,id)
        setremovegrouprecieverequest(groupId,id)
     }
     else{
      setremovemembergroupexistlist(id,groupId)
      if(groupId===Grouppicked.getState().group.groupId){
      setremovemembergrouppicked(id)
      }
      setremovemembersearchgroupexistlist(id,groupId)
      setremovegroupsendrequest(groupId,id)
      setremovegrouprecieverequest(groupId,id)
     }
  }
  function handledeletegroupleave(id:string,groupId:string){
     if(id===UsercurrentId.getState().name){
      setremovegroupexistlist(groupId)
      setremovesearchgroupexist(groupId)
      setremovegroupsendrequest(groupId,id)
      setremovegrouprecieverequest(groupId,id)
     }
     else{
      setremoveadmingroupexistlist(id,groupId)
      setremovemembergroupexistlist(id,groupId)
      setremoveadmingroupexistlist(id,groupId)
      setremoveadminsearchgroupexistlist(id,groupId)
      setremovegroupsendrequest(groupId,id)
      setremovegrouprecieverequest(groupId,id)
      if(groupId===Grouppicked.getState().group.groupId){
        setremovemembergrouppicked(id)
        setremovegroupadmin(id)
      }
     }
  }
  function handlegrouptyping(id:string,name:string,status:"admin"|"member",online:boolean,typing:boolean){
    setgrouptypingstatus(typing,id)
  }
  function handlechangegroupnametoast(message:string){
     toast.success(message)
  }
  function handlechangegroupname(groupId:string,message:string,name:string,id:string){
    if(id===UsercurrentId.getState().name){
      toast.success("name change successfull")
      setgroupname(name)
    }
    else{
      toast.success("Name of group has been changed")
      setgroupname(name)
    }
    
  }
  function handlegrouppagination(hasMore:boolean,cursorId:string,conversations:groupconversations[]){
    if(hasMore&&cursorId&&conversations){
      console.log(hasMore&&cursorId&&conversations)
        setgrouphasmore(hasMore)
        setgroupcursorId(cursorId)
        setgrouppagimessages(conversations)
    }
  }
  function handlerejectgrouprequest(id:string,type:string,groupId:string,message:string,status:status){
    if(type==="sender"){
      setstatussendgrouprequest(status,groupId,id)
      toast.error(message)
    }
    else if(type==="reciever"){
      setstatusrecievegrouprequest(status,groupId,id)
      toast.error(message)
    }
  }
  function handlegroupsenderrequestcancelreciever(id:string,status:status,groupId:string,message:string){
    setstatusrecievegrouprequest(status,groupId,id)
    toast.error(message)
  }
  function handlegroupsenderrequestcancelsender(status:status,groupId:string,message:string){
    setstatussendgrouprequest(status,groupId,UsercurrentId.getState().name)
    toast.error(message)
  }
  function handlegrouptypingonlinelist(list:grouponlinetyping,groupId:string){
    console.log(list,groupId,grouppicked)
    if(Grouppicked.getState().group.groupId===groupId){
      console.log(list)
      if(!Grouptypingonline.getState().list.some(data=>data.id===list.id))
    setgrouptypingonlinelist(list)
    }
  }
  function handlegroupmessagestatuschange(groupId:string,messageId:string,status:grpconversations){
    setgroupmessagestatuschange(messageId,status)
    toast.success("status of message changed")
  }
  function handlegroupmessageedit(globalId:string,editmessage:string,sender:boolean){
    setgroupconversationmessageedit(globalId,editmessage)
    if(sender){
      toast.success("Message edit succesfull")
    }
  }
  function handlegrouptypingonlinetyping(groupId:string,status:boolean,id:string){
    if(Grouppicked.getState().group.groupId===groupId)
    setgrouptypingstatus(status,id)
  }
  function handlegroupmemberstatuschange(message:string,id:string,status:promote){
    if(status==="admin"){
      setaddgroupadmin(id,"")
    }
    else if(status==="member"){
      setremovegroupadmin(id)
    }
    toast.success(message)
  }
  function handlegroupsettingschange(settings:groupsettings,value:boolean,message:string){
    if(settings==="OnlyAdminCanEditInfo")
    setgroupsettings(1,value)
    if(settings==="OnlyAdminCanEditMessage")
    setgroupsettings(0,value)

    toast.success(message)
  }
  function handlesendergroupsettingschange(settings:groupsettings,value:boolean,message:string){
    if(settings==="OnlyAdminCanEditInfo"){
      setgroupsettings(1,value)
    }
    if(settings==="OnlyAdminCanEditMessage"){
      setgroupsettings(0,value)
    }
    toast.success(message)
  }
  function handleloadgroupexistlist(grouplist:groupsexistlist[]){
    setaddgroupsexistlist(grouplist)
    setreloadgrpexistlist(true)
  }
  function handleloadgrouprequestrecieve(grouprequestrecieve:grouprequest[]){
    setrecievegrouprequests(grouprequestrecieve)
    setreloadgrprequestsrecieve(true)
  }
  function handleloadgrouprequestsend(grouprequestsend:grouprequest[]){
    setgroupsendrequests(grouprequestsend)
    setreloadgrprequestssend(true)
  }
  function handleloadonetooneconversationrequests(onetooneconversationrecieverequests:onetoonerequest[],onetooneconversationsendrequests:onetoonerequest[]){
    setonetooneconversationsendrequests(onetooneconversationsendrequests)
    setonetooneconversationrecieverequests(onetooneconversationrecieverequests)
    setreloadonetoonerequests(true)
  }
  function handlesendergroupmemberstatuschange(message:string,id:string,status:promote){
    if(status==="admin"){
      setaddgroupadmin(id,"")
    }
    else if(status==="member"){
      setremovegroupadmin(id)
    }
  }
  function handlegroupdescriptionchange(sender:boolean,description:string,message:string){
    setgroupdescription(description)
    toast.success(message)
  }
  function handlecreateroom(room:Room,message:string){
    setcolabexistroomlist(room)
    toast.success(message)
  }
  function handlesearchroomlist(room:SearchRoom[],message:string){
  setcolabsearchroomslist(room)
  toast.error(message)
  }
  function handlecolabsearchusers(users:Searchuser[]){
    setcolabsearchuserlist(users)
  }
  function handlecolabrequest(request:Colabrequest,message:string){
    setcolabrequests(request)
    toast.success(message)
  }
  function handlecolabrecieverrequest(request:Colabrequest,message:string){
    setcolabrequests(request)
    toast.success(message)
  }
  function handlecolabuserrequest(request:Colabrequest,message:string){
    setcolabrequests(request)
    toast.success(message)
  }
  function handlecolabrecieveruserrequest(request:Colabrequest,message:string){
    setcolabrequests(request)
    toast.success(message)
  }
  function handlecolabroomaccept(member:RoomMemberEntry,admin:boolean,roomId:string,requestId:string){
    setcolabexistroommember(roomId,member)
    if(admin){
      setcolabrequeststatus("accepted",requestId)
      toast.success("Your request to user got accepted")
    }
    else{
      toast.success("A member got added by admin")
    }
  }
  function handlecolabacceptorroomaccept(room:Room,message:string,requestId:string){
    setcolabrequeststatus("accepted",requestId)
    setcolabexistroomlist(room)
    toast.success(message)
  }
  function handlecolabacceptoruseraccept(room:Room,message:string,requestId:string){
    setcolabrequeststatus("accepted",requestId)
    setcolabexistroomlist(room)
    toast.success(message)
  }
  function handlecolabuseraccept(member:RoomMemberEntry,admin:boolean,roomId:string,requestId:string){
    setcolabexistroommember(roomId,member)
    if(admin){
      setcolabrequeststatus("accepted",requestId)
      toast.success("You accepted the request")
    }
    else{
      toast.success("A member got added by admin")
    }
  }
  function handleroomcolab(room:Room,messages:message[],documents:IDocument[]){
    setroompicked(room)
    setroomdocuments(documents)
    setroommessages(messages)
    setparamkey(room.id)
    toast.success("Room shows successfully")
  }
  function handlecolabdocumentadd(document:IDocument,roomId:string,documents:number){
    if(Roompicked.getState().room.id===roomId)
    setroomdocument(document)
    setdocumentcount(documents,roomId)
  }
  function handlecolabdocumentcontent(document:IDocument,roomId:string){
    if(Roompicked.getState().room.id===roomId){
      console.log("document content",roomId,document)
      if(document.type==="text")
        setroomdocumentcontenttext(document.content,document.id)
      if(document.type==="canvas")
        setroomdocumentcontentcanvas(document.content,document.id)
    }
  }
  function handlecolabmessagesend(message:message,roomId:string){
    if(Roompicked.getState().room.id===roomId)
      setroommessage(message)
  }
  function handlecolabmemberstatus(status:collabrole,memberId:string,roomId:string,change:string){
    if(change===UsercurrentId.getState().name){
      toast.success("status changes successfully")
    }
    if(Roompicked.getState().room.id===roomId)
    setroommemberstatus(status,memberId)
  }
  function handlecolablockrelease(roomId:string,documentId:string,id:string){
   if(Roompicked.getState().room.id===roomId){
    if(UsercurrentId.getState().name===id){
     toast.success("Lock released")
    }
    else{
     toast.success("Lock is released on document")
    }
    setroomdocumentlockedBy("",documentId)
   }
  }
  function handlecolablockedby(roomId:string,documentId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Document lock acquired")
      }
      setroomdocumentlockedBy(id,documentId)
    }
  }
  function handlerevokecolablockedby(roomId:string,documentId:string,message:string){
    if(Roompicked.getState().room.id===roomId){
      setroomdocumentlockedBy("",documentId)
      toast.success(message)
    }
  }
  function handlecolabviewmessage(roomId:string,messageId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroommemberlastseenmessageid(messageId,id)
    }
  }
  function handlecolabmessagestatus(roomId:string,messageId:string,status:grpconversations){
    if(Roompicked.getState().room.id===roomId){
      setroommessagestatus(status,messageId)
    }
  }
  function handlecolabeditmessage(roomId:string,messageId:string,id:string,content:string){
    if(Roompicked.getState().room.id===roomId){
    if(UsercurrentId.getState().name===id){
      toast.success("message edited successfully")
    }
    setroomeditmessage(content,messageId)
  }
  }
  function handlecolabmessagereply(roomId:string,messagee:message,id:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Reply message send successfully")
      }
      setroommessage(messagee)
    }
  }
  function handlecolabpagimessages(hasMore:boolean,cursorId:string,pagimessages:message[]){
     sethasmore(hasMore)
     setcursorid(cursorId)
     setroompagimessages(pagimessages)
  }
  function handlecolabforcereleaselock(documentId:string,roomId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Lock is successfully released")
      }
      setroomdocumentlockedBy("",documentId)
    }
  }
  function handlecolabrevokeforcereleaselock(roomId:string,documentId:string,message:string){
    if(Roompicked.getState().room.id===roomId){
      setroomdocumentlockedBy("",documentId)
      toast.success(message)
    }
  }
  function handlecolabassignlock(roomId:string,documentId:string,id:string,memberId:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Lock assigning successfull")
      }
      setroomdocumentlockedBy(memberId,documentId)
    }
  }
  function handlecolabrevokeassignlock(roomId:string,documentId:string,message:string){
     if(Roompicked.getState().room.id===roomId){
      setroomdocumentlockedBy("",documentId)
      toast.success(message)
     }
  }
  function handlecolabmembermute(roomId:string,memberId:string,id:string,muted:boolean){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Member muting status updates successfully")
      }
      setroommembermute(muted,memberId)
    }
  }
  function handlecolabroomdetails(roomId:string,mode:number,value:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
         toast.success("Room details changed successfully")
      }
      if(mode===1){
        setcolabexistroomname(value,roomId)
        setroomname(value)
      }
      else if(mode===2){
        setcolabexistroomdescription(value,roomId)
        setroomdescription(value)
      }
    }
  }
  function handlecolabkickmember(roomId:string,memberId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroomremovemember(memberId)
    }
    if(UsercurrentId.getState().name===memberId){
      const functions=Listeners.get("kick")
      functions?.forEach((value)=>{
        value("hello")
      })
    }
    if(UsercurrentId.getState().name===id){
      toast.success("Member kicked successfully")
    }
    setcolabexistroomremovemember(memberId,roomId)
  }
  function handlecolabmemberkickmember(roomId:string,message:string){
    setcolabexistroomremoveroom(roomId)
    toast.success(message)
  }
  function handlecolabchangecode(roomId:string,code:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroomcode(code)
    }
    if(UsercurrentId.getState().name===id){
      toast.success("Room code changed successfully")
    }
    setcolabexistroomcode(code,roomId)
  }
  function handlecolabdocumentvisibility(roomId:string,documentId:string,visibility:roomtype,id:string,documents:number){
     if(Roompicked.getState().room.id===roomId){
       setroomdocumentvisibility(visibility,documentId)
       setdocumentcount(documents,roomId)
     }
     if(UsercurrentId.getState().name===id){
      toast.success("Document visibility changes successfully")
     }
  }
  function handlecolabdocumenttitle(roomId:string,documentId:string,title:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroomdocumenttitle(title,documentId)
    }
    if(UsercurrentId.getState().name===id){
      toast.success("Document title changes successfully")
    }
  }
  function handlecolabmemberonline(roomId:string,online:boolean,id:string,name:string,roomname:string){
     if(Roompicked.getState().room.id===roomId){
      setroommemberonline(online,id)
     }
     setonlinelist({id:id,roomId:roomId,name:name,roomname:roomname})
  }
  function handlecolabtypingmember(roomId:string,id:string,status:boolean){
     if(Roompicked.getState().room.id===roomId){
      setroommembertyping(status,id)
     }
  }
  function handlecolabdocumentupload(text:string,Success:boolean,message:string,roomId:string){
     if(Roompicked.getState().room.id===roomId){
      if(Success){
          setisuploadingdocument(false)
          setisuploadeddocument(true)
          settextdocument(text)      
      }
      else{
        toast.error(message)
      }
     }
  }
  function handlecolabdocumentclone(roomId:string,document:IDocument,id:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Document cloned successfully")
      }
      setroomdocument(document)
    }
  }
  function handlecolabdocumentdelete(roomId:string,documentId:string,documents:number,id:string){
    if(Roompicked.getState().room.id===roomId){
      if(UsercurrentId.getState().name===id){
        toast.success("Document removed successfully successfully")
      }
      setroomdocumentvisibility("private",documentId)
    }
    setdocumentcount(documents,roomId)
  }
  function handlecolabroomleave(roomId:string,memberId:string){
    if(Roompicked.getState().room.id===roomId){
      setroomremovemember(memberId)
    }
    toast.success("a member leave the room")
  }
  function handlecolableaveroomleave(roomId:string){
     setcolabremoveroom(roomId)
     toast.success("Room leaved successfully")
      const fucnctions=Listeners.get("navigate")
      fucnctions?.forEach((value)=>{
        value("hello")
      })
  }
  function handlealldocumentscolab(value:number){
      setdashboarddocuments(value)
  }
  function handlelastseencolab(date:Date){
      setdashboardlastseen(date)
  }
  function handleactivitycolab(activity:activity[]){
      setactivitys(activity)
  }
  function handledocumenttrashed(documentId:string,roomId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroomdocumentstatus("trashed",documentId)
      if(UsercurrentId.getState().name===id){
        toast.success("Document trashed successfully")
      }
    }
  }
  function handledocumentrestor(documentId:string,roomId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroomdocumentstatus("none",documentId)
      if(UsercurrentId.getState().name===id){
        toast.success("Document restore successfully")
      }
    }
  }
  function handledocumentpermdel(documentId:string,roomId:string,id:string){
    if(Roompicked.getState().room.id===roomId){
      setroomdocumentstatus("deleted",documentId)
      if(UsercurrentId.getState().name===id){
        toast.success("Document trashed successfully")
      }
      setroomdocumentstatus("deleted",documentId)
    }
  }
   socketinstanceref.onmessage=(eventt)=>{
   const {event,payload}=JSON.parse(eventt.data)
   console.log("event",event,"payload",payload)
   if(event==="login:request:response"){
    const {verify,name,email}=payload
    if(verify){
      const fucnctions=Listeners.get("login/register")
      fucnctions?.forEach((value)=>{
        value(verify)
      })
      setusername(name)
      setuseremail(email)
      const user:authenticate={
        _id:UsercurrentId.getState().name,
        name:name,
        email:email
      }
      setusrlst(user)
    }
  }
  if(event==="register:request:response"){
    const {verify,name,email}=payload
    console.log(verify,"register:response")
    const functions=Listeners.get("login/register")
    functions?.forEach((value)=>{
      value(verify)
    })
    setusername(name)
    setuseremail(email)
    const user:authenticate={
      _id:UsercurrentId.getState().name,
      name:name,
      email:email
    }
    setusrlst(user)
  }
  if(event==="search:response"){
    const {users,message}=payload
    if(!users.length&&message==="No user found"){
      handlemessage()
    }
    else if(users.length){
      setmessage(`${users.length} similar users found`)
      setuserlist(users)
    }
  }
  if(event==="request:response:sender:onetooneconversation"){
    const {message}=payload
    handletoast(message)
  }
  if(event==="request:response:reciever:onetooneconversation"){
    const {request}=payload
    setonetooneconversationrequest(request)
    handlerecievertoast()
  }
  if(event==="request:response:sender:successfull:onetooneconversation"){
    const {message}=payload
    handlesendertoast(message)
  }
  if(event==="request:response:sender:accepted:onetooneconversation"){
    const {message,senderId,recieverId,userr}=payload
    console.log(message,senderId,recieverId,userr)
    handlesenderacceptedtoast(message)
    setmarkonetooneconversationsendrequest(senderId,recieverId,"accepted")
    handleremoveonetooneconversationrequest(senderId,recieverId)
    handleaddexistuser(userr)
    setuserexistmessage(`${existuserlist.length+1} conversation exists`)
  }
  if(event==="request:response:reciever:accepted:onetooneconversation"){
    const {senderId,recieverId,message,userr}=payload
    console.log(senderId,recieverId,message,userr)
    handlerecieveracceptedtoast(message)
    setmarkonetooneconversationrequest(senderId,recieverId,"accepted")
    handleaddexistuser(userr)
    setuserexistmessage(`${existuserlist.length} conversation exists`)
    handleremoveonetooneconversationrecrequest(senderId)
  }
  if(event==="request:response:sender:rejected:onetooneconevrsation"){
    const {senderId,recieverId,message}=payload
    handlesenderrejectedtoast(message)
    setmarkonetooneconversationsendrequest(senderId,recieverId,"deleted")
  }
  if(event==="request:response:reciever:rejected:onetooneconversation"){
    const {senderId,recieverId,message}=payload
    handlerecieverrejectedtoast(message)
    setmarkonetooneconversationsendrequest(senderId,recieverId,"deleted")
  }
  if(event==="request:response:conversation:onetooneconversations"){
    const {onetooneconversationsdetails,senderId,recieverId,cursor_id,hasMore,messages_seen}=payload
    setonetooneconversationdetails(onetooneconversationsdetails)
    console.log(getkey(senderId,recieverId))
    setparamkey(getkey(senderId,recieverId))
    setcursorid(cursor_id)
    sethasmore(hasMore)
    setuserexistlistunredmessages(messages_seen.unred_messages,senderId)
    setuserexistlistseenmessages(messages_seen.seen,senderId)
    }
  if(event==="message:response:sent:onetooneconversation"){
    const {senderId,recieverId,createdAt,message,_id,status,senderwho,global_id,messages_seen,replyto}=payload
    console.log(payload)
    handleonetooneconversationmessages(senderId,recieverId,createdAt,message,_id,status,senderwho,global_id,messages_seen,replyto)
  }
  if(event==="message:response:deleted:onetooneconversation"){
    const {message,createdAt,_id,senderwho,globalId}=payload
    handleonetooneconversationdeletedmessages(message,createdAt,_id,senderwho,globalId)
  }
  if(event==="message:response:view:onetooneconversation"){
    const {global_id,status,messages_seen,_id,senderId}=payload
    handleonetooneconversationviewmessages(global_id,status,messages_seen,_id,senderId)
  }
  if(event==="message:response:typing:onetooneconversation"){
    const {id,typing}=payload
    console.log("triggering typing")
    handletypingonetooneconversation(id,typing)
  }
  if(event==="user:status:onetooneconversation"){
    const {id,online}=payload
    handleuserstatusonetooneconversation(id,online)
  }
  if(event==="message:response:loadmore:conversations"){
    const {data}=payload
    console.log(data)
    handleloadmoreonetooneconversations(data.hasMore,data.cursor_id,data.messages)
  }
  if(event==="login:response:existlist:onetooneconversation"){
    const {users}=payload
    setuserexistlist(users)
  }
  if(event==="login:response:requests:onetooneconversation"){
    const {request_send,request_recieve}=payload
    setonetooneconversationsendrequest(request_send)
    setonetooneconversationrecieverequest(request_recieve)
  }
  if(event==="message:response:cursorid"){
    const {cursor_id}=payload
    setcursorid(cursor_id)
  }
  if(event==="request:response:onetooneconversation:leave"){
    const {senderId,recieverId,_id,message}=payload
    setremoveuserexistlist(_id)
    setparamkey("")
    handleleaveconversationtoast(message)
  }
  if(event==="message:response:deleteforme:onetooneconversation"){
    const {message,messageId,status}=payload
    handledeleteformetoast(message,messageId,status)
  }
  if(event==="request:response:namechange:onetooneconversation"){
    const {message,_id,name}=payload
    handlenamechangeonetooneconversation(message,_id,name)
  }
  if(event==="request:response:descriptionchange:onetooneconversation"){
    const {message,_id,description}=payload
    handledescriptionchangeonetooneconversation(message,_id,description)
  }
  if(event==="user:status:logout:onetooneconversation"){
    const {id,date}=payload
    handlelogoutonetooneconversation(id,date)
  }
  if(event==="request:response:userexist"){
    const {users}=payload
    setusersexistlist(users)
  }
  if(event==="request:response:userrooms:colab"){
    const {rooms,Success}=payload
    if(Success){
      setcolabexistrooms(rooms)
    }
  }
  if(event==="message:response:sent:edit:onetooneconversation"){
    const {global_id,message,_id}=payload
    handleeditmessageonetooneconversation(global_id,message,_id)
  }
  if(event==="request:response:groups:search"){
    const {groups,message}=payload
    if(groups.length<=0){
      handlenogrouptoast(message)
    }
    else{
      handlesearchgroupexistlist(groups,message)
    }
  }
  if(event==="request:response:statuschange:group"){
    const {groupId,status,message}=payload
    if(message==="An error occurred"){
      handletoaststatuserrorchange(message)
    }
    else{
      handlegroupstatuschange(groupId,status)
    }
  }
  if(event==="request:response:sendgrouprequest:group"){
    const {message,request}=payload
    if(message!=="Error"){
    handlesendgrouprequest(message,request)
    }
    else{
      toast.error("Some error occurred")
    }
  }
  if(event==="request:response:recieve:sendgrouprequest:group"){
    const {message,request}=payload
    handlerecievegrouprequest(message,request)
  }
  if(event==="request:response:reciever:grouprequestaccept:group"){
    const {message,groupId,member,status}=payload
    if(message!=="Success"){
      handlerecievergrouprequesterror(message)
    }
    else{
      handlerecievergrouprequestaccept(groupId,member,status)
    }
  }
  if(event==="request:response:sender:grouprequestaccept:group"){
    const {group,groupId,sendBy,status,message}=payload
    if(message!=="Success"){
      handlesendergrouprequesterror(message)
    }
    else{
      handlesendergrouprequestaccept(group,groupId,sendBy,status)
    }
  }
  if(event==="request:response:creategroup"){
    const {message,group}=payload
    if(message!=="Success"){
      handlecreategrouperror(message)
    }
    else{
      handlecreategroup(group)
    }
  }
  if(event==="request:response:sendgroupinviterequest:group"){
    const {message,request}=payload
    if(message!=="Error"){
    if(message!=="Request already send"){
      handlegroupinviterequestalreadysend(message)
    }
    else{
      handlegroupinviterequestsend(request,message)
    }
  }
  else{
    toast.error("Some error occurred")
  }
  }
  if(event==="request:response:recieve:sendgroupinviterequest:group"){
    const {request,message}=payload
    handlegroupinviterequestrecieve(request,message)
  }
  if(event==="request:response:groupinviteaccept:group"){
    const {groupId,sendBy,sendTo,name,group,message}=payload
    if(usercurrentid===sendTo){
      if(message==="You accepted request"){
      handlegroupinviteacceptsendto(groupId,sendBy,group,message)
      }
      else{
        toast.error(message)
      }
    }
    else if(usercurrentid===sendBy){
      if(message==="Your invite got accepted"){
      handlegroupinviteacceptsendby(groupId,sendTo,message)
      }
      else{
        toast.error(message)
      }
    }
  }
  if(event==="request:response:groupconversations:group"){
    const {group,groupmessages,message}=payload
    if(message!=="Group dosent exist anymore"){
      handlegroupconversation(group,groupmessages)
    }
    else{
      toast.error(message)
    }
  }
  if(event==="request:response:sendmessage:group"){
    const {message,conversation}=payload
    if(message!=="Success"){
      handlegroupsendmessagetoast(message)
    }
    else{
      handlegroupsendmessage(conversation,message)
    }
  }
  if(event==="request:response:viewmessage:group"){
    const {groupId,globalId,messageId}=payload
    handleviewgroupmessage(groupId,globalId,messageId)
  }
  if(event==="request:response:changememberstatus:group"){
    const {status,message,promoteId,extramessage,name}=payload
    if(message!=="Success"){
      handlechangememberstatustoast(message)
    }
    else{
      handlechangememberstatus(promoteId,status,name,extramessage)
    }
  }
    if(event==="request:response:leavegroup:group"){
      const {id,deletee,admin,groupId}=payload
      if(admin){
        if(deletee){
          handledeletegroupleave(id,groupId)
        }
      }
      else{
        handlememberleavegroup(id,groupId)
      }
    }
    if(event==="request:response:grouptyping:group"){
      const {id,name,status,online,typing}=payload
        handlegrouptyping(id,name,status,online,typing)
    }
    if(event==="request:response:changename:group"){
      const {groupId,message,name,id}=payload
      if(message!=="Success"){
        handlechangegroupnametoast(message)
      }
      else{
        handlechangegroupname(groupId,message,name,id)
      }
    }
    if(event==="request:response:pagimoremessage:group"){
      const {hasMore,cursorId,pagiconversations}=payload
      handlegrouppagination(hasMore,cursorId,pagiconversations)
    }
    if(event==="request:response:grouprecieverejectrequest:group"){
      const {id,type,groupId,message,status}=payload
      handlerejectgrouprequest(id,type,groupId,message,status)
    }
    if(event==="request:response:reciever:groupsenderrequestcancel:group"){
      const {id,status,groupId,message}=payload
      handlegroupsenderrequestcancelreciever(id,status,groupId,message)
    }
    if(event==="request:response:sender:groupsenderrequestcancel:group"){
      const {status,groupId,message}=payload
      handlegroupsenderrequestcancelsender(status,groupId,message)
    }
    if(event==="request:response:grouptypingonline:group"){
      const {memberstatus,groupId}=payload
      console.log("triggered grouptypingonline")
      handlegrouptypingonlinelist(memberstatus,groupId)
    }
    if(event==="request:response:messagestatuschange:group"){
      const {message,groupId,messageId,status}=payload
      if(message==="Success"){
        handlegroupmessagestatuschange(groupId,messageId,status)
      }
    }
    if(event==="request:response:editmessage:group"){
      const {globalId,editmessage,sender,message}=payload
       if(message){
        toast.error(message)
       }
       else{
        handlegroupmessageedit(globalId,editmessage,sender)
       }
    }
    if(event==="request:response:grouptypingonlinetyping:group"){
      const {groupId,status,id}=payload
      handlegrouptypingonlinetyping(groupId,status,id)
    }
    if(event==="request:response:memberstatus:group"){
      const {Success,message,id,status}=payload
      if(Success){
        handlegroupmemberstatuschange(message,id,status)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:sender:memberstatus:group"){
      const {Success,message,id,status}=payload
      if(Success){
        handlesendergroupmemberstatuschange(message,id,status)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:groupsettings:group"){
      const {settings,value,message}=payload
      handlegroupsettingschange(settings,value,message)
    }
    if(event==="request:response:sender:groupsettings:group"){
      const {settings,value,message}=payload
      handlesendergroupsettingschange(settings,value,message)
    }
    if(event==="request:response:reload:groupexistlist:group"){
      const {grouplist}=payload
      handleloadgroupexistlist(grouplist)
    }
    if(event==="request:response:reload:grouprequestrecieve:group"){
      const {grouprequestsrecieve}=payload
      handleloadgrouprequestrecieve(grouprequestsrecieve)
    }
    if(event==="request:response:reload:grouprequestsend:group"){
      const {grouprequestsend}=payload
      handleloadgrouprequestsend(grouprequestsend)
    }
    if(event==="request:response:reload:onetooneconversationrequests:onetooneconversation"){
      const {onetooneconversationrecieverequests,onetooneconversationsendrequests}=payload
      handleloadonetooneconversationrequests(onetooneconversationrecieverequests,onetooneconversationsendrequests)
    }
    if(event==="request:response:groupdescription:group"){
      const {Success,sender,description,message}=payload
      if(Success){
        handlegroupdescriptionchange(sender,description,message)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:reload:conversation:onetooneconversation"){
      const {onetooneconversations}=payload
      setuserexistlistt(onetooneconversations)
    }
    if(event==="request:response:createroom:colab"){
      const {room,message,Success}=payload
      if(Success){
        handlecreateroom(room,message)
      }
      else{
        toast.error(message)     
      }
    }
    if(event==="request:response:rooms:search"){
      const {rooms,message}=payload
      handlesearchroomlist(rooms,message)
    }
    if(event==="request:response:users:search"){
      const {users,Success}=payload
      if(Success){
        handlecolabsearchusers(users)
      }
      else{
        toast.success("some error occurred")
      }
    }
    if(event==="request:response:roomrequest:colab"){
      const {Success,message,request}=payload
      if(Success){
        handlecolabrequest(request,message)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:reciever:roomrequest:colab"){
      const {Success,request,message}=payload
      if(Success){
        handlecolabrecieverrequest(request,message)
      }
    }
    if(event==="request:response:userrequest:colab"){
      const {Success,request,message}=payload
      if(Success){
        handlecolabuserrequest(request,message)
      }
      else{
        toast.success(message)
      }
    }
    if(event==="request:response:reciever:userrequest:colab"){
      const {Success,request,message}=payload
      if(Success){
        handlecolabrecieveruserrequest(request,message)
      }
    }
    if(event==="request:response:roomaccept:colab"){
      const {Success,member,admin,roomId,requestId}=payload
      if(Success){
        handlecolabroomaccept(member,admin,roomId,requestId)
      }
    }
    if(event==="request:response:acceptor:roomaccept:colab"){
      const {room,Success,message,requestId,documents}=payload
      if(Success){
        handlecolabacceptorroomaccept(room,message,requestId)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:acceptor:useraccept:colab"){
      const {Success,room,message,requestId,documents}=payload
      if(Success){
        handlecolabacceptoruseraccept(room,message,requestId)
      }
      else{
        toast.success(message)
      }
    }
    if(event==="request:response:useraccept:colab"){
      const {Success,member,admin,roomId,requestId}=payload
      if(Success){
        handlecolabuseraccept(member,admin,roomId,requestId)
      }
    }
    if(event==="request:response:room:colab"){
      const {Success,room,messages,documents}=payload
      if(Success){
        handleroomcolab(room,messages,documents)
      }
      else{
        toast.error("Some error occured in room opening")
      }
    }
    if(event==="request:response:documentadd:colab"){
      const {Success,document,message,roomId,documents}=payload
      if(Success){
        handlecolabdocumentadd(document,roomId,documents)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:documentcontent:colab"){
      const {document,roomId,message,Success}=payload
      if(Success){
         handlecolabdocumentcontent(document,roomId)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:messagesend:colab"){
      const {messagee,message,roomId,Success}=payload
      if(Success){
        handlecolabmessagesend(messagee,roomId)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:memberstatus:colab"){
      const {status,memberId,roomId,change,Success,message}=payload
      if(Success){
        handlecolabmemberstatus(status,memberId,roomId,change)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:lockrelease:colab"){
      const {roomId,documentId,id,Success,message}=payload
      if(Success){
        handlecolablockrelease(roomId,documentId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:lockedby:colab"){
      const {roomId,documentId,Success,message,id}=payload
      if(Success){
       handlecolablockedby(roomId,documentId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:revoke:lockedby:colab"){
      const {documentId,roomId,message}=payload
      handlerevokecolablockedby(roomId,documentId,message)
    }
    if(event==="request:response:viewmessage:colab"){
      const {roomId,messageId,id,Success,message}=payload
      if(Success){
        handlecolabviewmessage(roomId,messageId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:messagestatus:colab"){
      const {roomId,messageId,status,Success,message}=payload
      if(Success){
        handlecolabmessagestatus(roomId,messageId,status)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:messageedit:colab"){
      const {roomId,messageId,id,content,message,Success}=payload
      if(Success){
        handlecolabeditmessage(roomId,messageId,id,content)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:messagereply:colab"){
      const {roomId,messagee,message,id,Success}=payload
      if(Success){
        handlecolabmessagereply(roomId,messagee,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:messagepagi:colab"){
      const {hasMore,cursorId,conversations,Success,message}=payload
      if(Success){
          handlecolabpagimessages(hasMore,cursorId,conversations)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:forcereleaselock:colab"){
      const {documentId,roomId,Success,message,id}=payload
      if(Success){
        handlecolabforcereleaselock(documentId,roomId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:revoke:forcereleaselock:colab"){
      const {Success,roomId,documentId,message}=payload
      handlecolabrevokeforcereleaselock(roomId,documentId,message)
    }
    if(event==="request:response:assignlock:colab"){
      const {Success,roomId,documentId,id,memberId,message}=payload
      if(Success){
      handlecolabassignlock(roomId,documentId,id,memberId)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:revoke:assignlock:colab"){
      const {roomId,documentId,message}=payload
      handlecolabrevokeassignlock(roomId,documentId,message)
    }
    if(event==="request:response:membermute:colab"){
      const {Success,roomId,memberId,id,muted,message}=payload
      if(Success){
         handlecolabmembermute(roomId,memberId,id,muted)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:roomdetails:colab"){
      const {Success,roomId,mode,value,id,message}=payload
      if(Success){
         handlecolabroomdetails(roomId,mode,value,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:kickmember:colab"){
      const {roomId,memberId,id,Success,message}=payload
      if(Success){
        handlecolabkickmember(roomId,memberId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:member:kickmember:colab"){
      const {roomId,message}=payload
      handlecolabmemberkickmember(roomId,message)
    }
    if(event==="request:response:changecode:colab"){
      const {roomId,code,id,Success,message}=payload
      if(Success){
        handlecolabchangecode(roomId,code,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:documentvisibility:colab"){
      const {roomId,documentId,visibility,id,Success,message,documents}=payload
      if(Success){
        handlecolabdocumentvisibility(roomId,documentId,visibility,id,documents)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:documenttitle:colab"){
      const {roomId,documentId,title,id,Success,message}=payload
      if(Success){
          handlecolabdocumenttitle(roomId,documentId,title,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:online:colab"){
      const {roomId,online,id,name,roomname}=payload
      handlecolabmemberonline(roomId,online,id,name,roomname)
    }
    if(event==="request:response:typing:colab"){
      const {roomId,id,typing}=payload
      handlecolabtypingmember(roomId,id,typing)
    }
    if(event==="request:response:documentupload:colab"){
      const {text,Success,message,roomId}=payload
      handlecolabdocumentupload(text,Success,message,roomId)
    }
    if(event==="request:response:documentclone:colab"){
      const {document,id,roomId,Success,message}=payload
      if(Success){
      handlecolabdocumentclone(roomId,document,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:documentdelete:colab"){
      const {roomId,documentId,documents,id,Success,message}=payload
      if(Success){
        handlecolabdocumentdelete(roomId,documentId,documents,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:roomleave:colab"){
      const {Success,roomId,memberId,message}=payload
      if(Success){
         handlecolabroomleave(roomId,memberId)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:leave:roomleave:colab"){
      const {roomId}=payload
      handlecolableaveroomleave(roomId)
    }
    if(event==="request:response:alldocuments:colab"){
      const {documents}=payload
      handlealldocumentscolab(documents)
    }
    if(event==="request:response:lastseen:colab"){
      const {date}=payload
      handlelastseencolab(date)
    }
    if(event==="request:response:activity:colab"){
      const {activity}=payload
      handleactivitycolab(activity)
    }
    if(event==="request:response:documenttrashed:colab"){
      const {documentId,roomId,id,Success,message}=payload
      if(Success){
       handledocumenttrashed(documentId,roomId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:response:documentrestore:colab"){
      const {documentId,roomId,id,Success,message}=payload
      if(Success){
        handledocumentrestor(documentId,roomId,id)
      }
      else{
        toast.error(message)
      }
    }
    if(event==="request:repsonse:documentpermdel:colab"){
      const {documentId,roomId,id,Success,message}=payload
      if(Success){
        handledocumentpermdel(documentId,roomId,id)
      }
      else{
        toast.error(message)
      }
    }
  }
  return socketinstanceref
}

export function on(type:string,funtion:Listener){
  const method=Listeners.get(type)||[]
  Listeners.set(type,[...method,funtion])
}
export function set(type:string,dataa:any){
  if(!socketinstanceref){
    socketinstanceref=socket()
  }

  if(socketinstanceref.readyState===WebSocket.OPEN){
    socketinstanceref.send(JSON.stringify({event:type,payload:dataa}))
  } else {
    socketinstanceref.onopen = () => {
      socketinstanceref?.send(JSON.stringify({event:type,payload:dataa}))
    }
  }
}
    
