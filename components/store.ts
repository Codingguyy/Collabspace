import {create} from 'zustand'
import { authenticate, usrlist } from '@/types/user'
import { onetoonerequest } from '@/types/request'
import { messagestatus, onetooneconversationdetails } from '@/types/1to1conversations'
import { messagetype } from '@/types/1to1conversations'
import { messagetypee } from '@/types/1to1conversations'
import { userlistt } from '@/types/user'
import { sngleuser } from '@/types/user'
import { status } from '@/types/1to1conversations'
import { usrlistt } from '@/types/user'
import { chatype } from '@/types/user'
import { groupconversation, grouponlinetyping, grpstatustype } from '@/types/groupconversations'
import { groupconversations } from '@/types/groupconversations'
import { groupmember } from '@/types/groupconversations'
import { groupsexistlist } from '@/types/groupconversations'
import { grouprequest } from '@/types/groupconversations'
import { chatypepicked } from '@/types/user'
import { grouptyping } from '@/types/groupconversations'
import { grpconversations } from '@/types/groupconversations'
import { activity, colabrequeststatus, docstatus, doctype, IDocument, onlinelist, SearchRoom, Searchuser } from '@/types/collab'
import { roomtype } from '@/types/collab'
import { CanvasContent } from '@/types/collab'
import { Room } from '@/types/collab'
import { RoomMemberEntry } from '@/types/collab'
import { collabrole } from '@/types/collab'
import { Colabrequest } from '@/types/collab'
import { message } from '@/types/collab'
import { CanvasShape } from '@/types/collab'
type userregister={
    name:string,
    password:string,
    email:string,
    setname:(value:string)=>void,
    setpassword:(value:string)=>void,
    setemail:(value:string)=>void
}
type userlogin={
    password:string,
    email:string,
    setemail:(value:string)=>void,
    setpassword:(value:string)=>void
}
type searchname={
    name:string,
    setname:(value:string)=>void
}
type userlistttttt={
    users:userlistt[],
    message:string,
    setuser:(value:userlistt)=>void,
    setusrs:(value:userlistt[])=>void,
    setremoveuser:(value:string)=>void,
    setmessage:(value:string)=>void
}
type onetooneconversationrequest={
    requsts:onetoonerequest[],
    setrequests:(value:onetoonerequest)=>void,
    setrequestss:(value:onetoonerequest[])=>void,
    setrequsts:(value:onetoonerequest[])=>void,
    setmarkspecificrequest:(senderId:string,recieverId:string,status:status)=>void,
    setremovespecificrequest:(senderId:string,recieverId:string)=>void
}
type onetooneconversationdetailss={
    onetooneconversationdetails:onetooneconversationdetails,
    message:string,
    setsendmessage:(value:string)=>void,
    setmessage:(value:messagetypee)=>void,
    setmessages:(value:messagetypee[])=>void,
    removespecificmessage:(senderId:string,createdAt:Date)=>void,
    setonetooneconversationdetails:(value:onetooneconversationdetails)=>void,
    setmarkmessagestatus:(message:string,createdAt:Date,_id:string,status:messagestatus)=>void,
    setmarkmessagestatusglobalid:(global_id:string,status:messagestatus)=>void,
    setprependmessages:(value:messagetypee[])=>void,
    setmarkonetooneconversationdetails:(value:status)=>void,
    seteditmessage:(global_id:string,message:string)=>void,
    setslicemessage:()=>void,
    setsendername:(value:string)=>void,
    setrecievername:(value:string)=>void,
    setsenderdescription:(value:string)=>void,
    setrecieverdescription:(value:string)=>void
}
type userexistlist={
    users:usrlistt[],
    message:string,
    setuser:(value:usrlistt)=>void,
    setusrs:(value:usrlistt[])=>void,
    setremoveuser:(value:string)=>void,
    setmessage:(value:string)=>void,
    setunreadmesages:(value:number,_id:string)=>void,
    setseenmesages:(value:boolean,_id:string)=>void
}
type searchvalue={
    value:boolean,
    setvlue:(value:boolean)=>void
}
type typingindicator={
    id:string,
    typing:boolean,
    setid:(value:string)=>void,
    settyping:(value:boolean)=>void
}
type onlineindicator={
    id:string,
    online:boolean,
    seenon:Date,
    setid:(value:string)=>void,
    setonline:(value:boolean)=>void,
    setseenon:(value:Date)=>void
}
type conversationspagination={
    cursor_id:string,
    hasMore:boolean,
    setcursorid:(value:string)=>void,
    sethasmore:(value:boolean)=>void
}
type logincount={
    count:number,
    setcount:(value:number)=>void
}
type requestsngleuser={
    user:sngleuser,
    isloading:boolean,
    setuser:(value:sngleuser)=>void,
    setisloading:(value:boolean)=>void
}
type profile={
    name:string,
    description:string,
    ischangingname:boolean,
    ischangingdescription:boolean,
    isnamechangedmessage:string,
    isdescriptionchangedmessage:string,
    setname:(value:string)=>void,
    setdescription:(value:string)=>void,
    setisnamechanging:(value:boolean)=>void,
    setisdescriptionchanging:(value:boolean)=>void,
    setisnamechangedmessage:(value:string)=>void,
    setisdescriptionchangedmessage:(value:string)=>void
}
type replytomessage={
    global_id:string,
    message:string,
    original_message:string,
    setoriginal_message:(value:string)=>void,
    setglobal_id:(value:string)=>void,
    setmessage:(value:string)=>void,
    setcleanvalue:()=>void
}
type chatypeose={
    type:chatype,
    setype:(value:chatype)=>void
}
type existgroupconversation={
    group:groupconversation,
    conversations:groupconversations[],
    setconversation:(value:groupconversation)=>void,
    setconversations:(value:groupconversations[])=>void,
    setsngleconversations:(value:groupconversations)=>void
    setgroupname:(value:string)=>void,
    setgroupdescription:(value:string)=>void,
    setgroupcode:(code:string)=>void,
    setaddgroupmembers:(member:groupmember)=>void,
    removegroupmember:(id:string)=>void,
    setgroupadmin:(id:string,name:string)=>void,
    removegroupadmin:(id:string)=>void,
    setgroupsettings:(mode:number,value:boolean)=>void,
    setgroupstatus:(value:grpstatustype)=>void,
    setviewmessage:(id:string,messageId:string)=>void,
    setpagimessages:(value:groupconversations[])=>void,
    setslicemessage:()=>void,
    setconversationchangestatus:(messageId:string,status:grpconversations)=>void,
    setconversationmessageedit:(globalId:string,message:string)=>void,
}
type searchexistgrouplist={
    groups:groupsexistlist[],
    message:string,
    setgroup:(value:groupsexistlist)=>void,
    setgroups:(value:groupsexistlist[])=>void,
    removegroup:(groupId:string)=>void,
    setstatus:(value:grpstatustype,groupId:string)=>void,
    setmessage:(value:string)=>void,
    setaddmember:(groupId:string)=>void,
    setremovemember:(id:string,groupId:string)=>void,
    setremoveadmin:(id:string,groupId:string)=>void,
    setaddadmin:(id:string,name:string,groupId:string)=>void
}
type grouprequst={
    requests:grouprequest[],
    setrequest:(value:grouprequest)=>void,
    setrequests:(value:grouprequest[])=>void,
    removerequest:(groupId:string,id:string)=>void,
    setrequeststatus:(value:status,groupId:string,id:string)=>void,
}
type chattypepickd={
    type:chatypepicked,
    settype:(value:chatypepicked)=>void
}
type groupchattyping={
    typing:grouptyping[],
    settyping:(id:string,status:boolean)=>void,
    setremovetyping:(id:string)=>void,
    setaddtyping:(value:grouptyping)=>void
}
type grouptypingonline={
    list:grouponlinetyping[],
    setlist:(value:grouponlinetyping)=>void,
    setremovelist:(value:string)=>void,
    setchangestatus:(value:"member"|"admin",id:string)=>void,
    setchangetypingstatus:(value:boolean,id:string)=>void,
    setchangeonlinestatus:(value:boolean,id:string)=>void,
}
type reloadvrythng={
    Grpexistlist:boolean,
    Grprequestsrecieve:boolean,
    Grprequestssend:boolean,
    Onetooneexistlist:boolean,
    Onetoonerequests:boolean,
    setgrpexistlist:(value:boolean)=>void,
    setgrprequestsrecieve:(value:boolean)=>void,
    setgrprequestssend:(value:boolean)=>void,
    setonetooneexistlist:(value:boolean)=>void,
    setonetoonerequests:(value:boolean)=>void
}
type document={
    document:IDocument[],
    setdocument:(value:IDocument)=>void,
    removedocument:(value:string)=>void,
    setcontent:(value:string|CanvasContent,id:string)=>void
}
type currentdocument={
    document:IDocument,
    settitle:(value:string)=>void,
    setvisibility:(value:roomtype)=>void,
    setlockedAt:(value:Date)=>void,
    setlockedBy:(value:string)=>void,
    setclonedFrom:(value:string)=>void,
    setupdatedAt:(value:Date)=>void,
    setcontent:(value:string|CanvasContent)=>void
}
type room={
    rooms:Room[],
    setroom:(value:Room)=>void,
    setrooms:(value:Room[])=>void,
    setroommember:(value:string,member:RoomMemberEntry)=>void,
    setname:(value:string,id:string)=>void,
    setdescription:(value:string,id:string)=>void,
    setcode:(value:string,id:string)=>void,
    removeroommember:(value:string,memberId:string)=>void,
    setmemberrole:(value:string,memberId:string,role:collabrole)=>void,
    setmembermute:(value:string,memberid:string,muted:boolean)=>void,
    setroomremovemember:(memberId:string,roomId:string)=>void,
    setremoveroom:(roomId:string)=>void,
    setdocumentcount:(count:number,documentId:string)=>void
}
type searchroom={
    rooms:SearchRoom[],
    setrooms:(value:SearchRoom[])=>void,
    setname:(value:string,id:string)=>void,
    setdescription:(value:string,id:string)=>void,
    setcode:(value:string,id:string)=>void,
    setmembers:(value:number,id:string)=>void
}
type userdetails={
    name:string,
    email:string,
    setname:(value:string)=>void,
    setemail:(value:string)=>void
}
type searchuser={
    users:Searchuser[],
    setusrs:(value:Searchuser[])=>void,
    removeusers:(value:string)=>void
}
type colabrequest={
    requests:Colabrequest[],
    setrequests:(value:Colabrequest)=>void,
    setrequeststatus:(value:colabrequeststatus,id:string)=>void
}
type roompicked={
    room:Room,
    documentList:IDocument[],
    message:message[],
    setroom:(value:Room)=>void,
    setdocument:(value:IDocument)=>void,
    removedocument:(id:string)=>void,
    setdocuments:(value:IDocument[])=>void,
    setroomname:(value:string)=>void,
    setroomdescription:(value:string)=>void,
    setroomcode:(value:string)=>void,
    setroommembers:(value:RoomMemberEntry)=>void,
    setroommembermuted:(value:boolean,id:string)=>void,
    setroommemberrole:(value:collabrole,id:string)=>void,
    setdocumentcontenttext:(value:string,id:string)=>void,
    setdocumentcontentcanvas:(value:CanvasContent,id:string)=>void,
    setdocumenttitle:(value:string,id:string)=>void,
    setdocumentvisibility:(value:roomtype,id:string)=>void,
    setdocumentlockedAt:(value:Date,id:string)=>void,
    setdocumentlockedBy:(value:string,id:string)=>void,
    setdocumentclonedfrom:(value:string,id:string)=>void,
    setdocumentupdatedAt:(value:Date,id:string)=>void,
    setmessages:(value:message[])=>void,
    setmessage:(value:message)=>void,
    setmessagestatus:(value:grpconversations,id:string)=>void,
    setmemberlastseenmessageid:(value:string,id:string)=>void,
    setmessageedit:(value:string,id:string)=>void,
    setpagimessages:(value:message[])=>void,
    setroomremovemember:(memberId:string)=>void,
    setroommemberonline:(value:boolean,id:string)=>void,
    setroommembertyping:(value:boolean,id:string)=>void,
    setroomdocumentstatus:(value:docstatus,id:string)=>void
}
type onlineroomlist={
    list:onlinelist[],
    setlist:(value:onlinelist)=>void,
    setlists:(value:onlinelist[])=>void,
    setremove:(id:string)=>void,
}
type documentupload={
    isuploading:boolean,
    uploaded:boolean,
    text:string,
    setisuploading:(value:boolean)=>void,
    setisuploaded:(value:boolean)=>void,
    settext:(value:string)=>void,
    setcleanvalue:()=>void
}
type documentrendertype={
    type:doctype,
    settype:(value:doctype)=>void
}
type shapesarray={
    shapes:CanvasShape[],
    setshape:(value:CanvasShape)=>void,
    deleteshape:(value:string)=>void,
    updateshape:(valueee:string,value:number,valuee:number)=>void,
    updatetext:(value:string,valuee:string)=>void,
    setshapes:(value:CanvasShape[])=>void
}
type dashboarddetails={
    documents:number,
    lastactivity:Date,
    setdocuments:(value:number)=>void,
    setlastactivity:(value:Date)=>void
}
type activitylist={
    activity:activity[],
    setactivitys:(value:activity[])=>void,
    setactivity:(value:activity)=>void
}
type usrlst={
    users:authenticate[],
    setusers:(value:authenticate)=>void,
    setuserchangename:(value:string,name:string)=>void,
    removeusers:(value:string)=>void
}
 /*type IDocument = {
    type: "text";
    content: string;
    _id: string;
    roomId: string;
    title: string;
    ownerId: string;
    visibility: "private" | "room";
    lockedAt: Date | null;
    lockedBy: string | null;
    clonedFrom: string | null;
    createdAt: Date;
    updatedAt: Date;
 }*/
export const Userregister=create<userregister>((set)=>({
    name:"",
    password:"",
    email:"",
    setname:(value)=>set(({name:value})),
    setpassword:(value)=>set(({password:value})),
    setemail:(value)=>set(({email:value}))
}))
export const Userlogin=create<userlogin>((set)=>({
    password:"",
    email:"",
    setemail:(value)=>set(({email:value})),
    setpassword:(value)=>set(({password:value}))
}))
export const Searchname=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set((v)=>({name:value}))
}))
export const Toklue=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set(({name:value}))
}))
export const Userlist=create<userlistttttt>((set)=>({
   users:[],
   message:"",
   setuser:(value)=>set((v)=>({users:[...v.users,value]})),
   setusrs:(value)=>set((v)=>({users:value})),
   setremoveuser:(value)=>set((v)=>({users:v.users.filter((valuee)=>valuee._id!==value)})),
   setmessage:(value)=>set(({message:value}))
}))
export const Onetooneconversationrequest=create<onetooneconversationrequest>((set)=>({
    requsts:[],
    setrequests:(value)=>set((v)=>({requsts:[...v.requsts,value]})),
    setrequestss:(value)=>set((v)=>({requsts:[...v.requsts,...value]})),
    setrequsts:(value)=>set(({requsts:value})),
    setmarkspecificrequest:(senderId,recieverId,status)=>set((v)=>({requsts:v.requsts.map(data=>data.recieverId===recieverId&&data.senderId===senderId?{...data,status:status}:data)})),
    setremovespecificrequest:(senderId,recieverId)=>set((v)=>({requsts:v.requsts.filter(data=>!(data.recieverId===recieverId&&data.senderId===senderId))}))
}))
export const Onetooneconversationsendrequest=create<onetooneconversationrequest>((set)=>({
    requsts:[],
    setrequests:(value)=>set((v)=>({requsts:[...v.requsts,value]})),
    setrequestss:(value)=>set((v)=>({requsts:[...v.requsts,...value]})),
    setrequsts:(value)=>set(({requsts:value})),
    setmarkspecificrequest:(senderId,recieverId,status)=>set((v)=>({requsts:v.requsts.map(data=>(data.recieverId===recieverId&&data.senderId===senderId)?{...data,status:status}:data)})),
    setremovespecificrequest:(senderId,recieverId)=>set((v)=>({requsts:v.requsts.filter(data=>!(data.recieverId===recieverId&&data.senderId===senderId))}))
}))
export const Onetooneconversationdetails=create<onetooneconversationdetailss>((set)=>({
    onetooneconversationdetails:{senderId:{name:"",description:"",email:"",_id:""},recieverId:{name:"",description:"",email:"",_id:""},chatId:"",conversations:[],createdAt:new Date(),status:"pending"},
    message:"",
    setsendmessage:(value)=>set({message:value}),
    setmessage:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:[...v.onetooneconversationdetails.conversations,value]}})),
    setmessages:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:[...v.onetooneconversationdetails.conversations,...value]}})),
    removespecificmessage:(senderId,createdAt)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:v.onetooneconversationdetails.conversations.filter(data=>data.senderId!==senderId&&data.createdAt!==createdAt)}})),
    setonetooneconversationdetails:(value)=>set({onetooneconversationdetails:value}),
    setmarkmessagestatus:(message,createdAt,_id,status)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:v.onetooneconversationdetails.conversations.map(data=>data.message===message&&data.createdAt===createdAt&&data.senderId===_id?{...data,status:status}:data)}})),
    setmarkmessagestatusglobalid:(global_id,status)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:v.onetooneconversationdetails.conversations.map(data=>data.global_id===global_id?{...data,status:status}:data)}})),
    setprependmessages:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:[...value,...v.onetooneconversationdetails.conversations]}})),
    setmarkonetooneconversationdetails:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,status:value}})),
    seteditmessage:(global_id,message)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,conversations:v.onetooneconversationdetails.conversations.map(data=>data.global_id===global_id?{...data,message:message}:data)}})),
    setslicemessage: () =>set((v) => ({
    onetooneconversationdetails: {
      ...v.onetooneconversationdetails,
      conversations:
        v.onetooneconversationdetails.conversations.slice(-50),
    },
  })),
  setsendername:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,senderId:{...v.onetooneconversationdetails.senderId,name:value}}})),
  setrecievername:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,recieverId:{...v.onetooneconversationdetails.recieverId,name:value}}})),
  setsenderdescription:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,senderId:{...v.onetooneconversationdetails.senderId,description:value}}})),
  setrecieverdescription:(value)=>set((v)=>({onetooneconversationdetails:{...v.onetooneconversationdetails,recieverId:{...v.onetooneconversationdetails.recieverId,description:value}}}))
}))
export const Parmkey=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set(({name:value}))
}))
export const Searchvalue=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set({value:value})
}))
export const Userexistlistt=create<userexistlist>((set)=>({
    users:[],
    message:"",
    setuser:(value)=>set((v)=>({users:[...v.users,value]})),
    setusrs:(value)=>set((v)=>({users:[...v.users,...value]})),
    setremoveuser:(value)=>set((v)=>({users:v.users.filter(data=>data._id!==value)})),
    setmessage:(value)=>set({message:value}),
    setunreadmesages:(value,_id)=>set((v)=>({users:v.users.map(data=>data._id===_id?{...data,unred_messages:value}:data)})),
    setseenmesages:(value,_id)=>set((v)=>({users:v.users.map(data=>data._id===_id?{...data,seen:value}:data)}))
}))
export const Typingindicator=create<typingindicator>((set)=>({
    id:"",
    typing:false,
    setid:(value)=>set(({id:value})),
    settyping:(value)=>set({typing:value})
}))
export const UsercurrentId=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set(({name:value}))
}))
export const Currentselecteduserconversationname=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set(({name:value}))
}))
export const Onlineindicator=create<onlineindicator>((set)=>({
    id:"",
    online:false,
    seenon:new Date(),
    setid:(value)=>set({id:value}),
    setonline:(value)=>set({online:value}),
    setseenon:(value)=>set({seenon:value})
}))
export const Conversationpagination=create<conversationspagination>((set)=>({
    cursor_id:"",
    hasMore:true,
    setcursorid:(value)=>set({cursor_id:value}),
    sethasmore:(value)=>set({hasMore:value})
}))
export const Logincount=create<logincount>((set)=>({
    count:0,
    setcount:(value)=>set(({count:value}))
}))
export const Navbarstatus=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set({value:value})
}))
export const Requestsngleuser=create<requestsngleuser>((set)=>({
    user:{name:"",email:""},
    isloading:false,
    setuser:(value)=>set({user:value}),
    setisloading:(value)=>set({isloading:value})
}))
export const Profile=create<profile>((set)=>({
    name:"",
    description:"",
    ischangingdescription:false,
    ischangingname:false,
    isdescriptionchangedmessage:"",
    isnamechangedmessage:"",
    setname:(value)=>set(({name:value})),
    setdescription:(value)=>set(({description:value})),
    setisdescriptionchanging:(value)=>set(({ischangingdescription:value})),
    setisnamechanging:(value)=>set(({ischangingname:value})),
    setisnamechangedmessage:(value)=>set(({isnamechangedmessage:value})),
    setisdescriptionchangedmessage:(value)=>set(({isdescriptionchangedmessage:value}))
}))
export const Replytomessage=create<replytomessage>((set)=>({
    global_id:"",
    message:"",
    original_message:"",
    setglobal_id:(value)=>set({global_id:value}),
    setmessage:(value)=>set({message:value}),
    setoriginal_message:(value)=>set({original_message:value}),
    setcleanvalue:()=>set({global_id:"",message:""})
}))
export const Editmessage=create<replytomessage>((set)=>({
    global_id:"",
    message:"",
    original_message:"",
    setglobal_id:(value)=>set(({global_id:value})),
    setmessage:(value)=>set(({message:value})),
    setoriginal_message:(value)=>set({original_message:value}),
    setcleanvalue:()=>set({global_id:"",message:""})
}))
export const Chatypeose=create<chatypeose>((set)=>({
    type:"onetoone",
    setype:(value)=>set(({type:value}))
}))
export const Switchvalue=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set(({value:value}))
}))
export const Creategroup=create<replytomessage>((set)=>({
    global_id:"",
    message:"",
    original_message:"",
    setoriginal_message:(value)=>set({original_message:value}),
    setmessage:(value)=>set(({message:value})),
    setglobal_id:(value)=>set(({global_id:value})),
    setcleanvalue:()=>set({global_id:"",message:""})
}))
export const Searchexistgrouplist=create<searchexistgrouplist>((set)=>({
    groups:[],
    message:"",
    setgroup:(value)=>set((v)=>({groups:[...v.groups,value]})),
    setgroups:(value)=>set((v)=>({groups:value})),
    removegroup:(groupId)=>set((v)=>({groups:v.groups.filter(data=>data.groupId!==groupId)})),
    setstatus:(value,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,status:value}:data)})),
    setmessage:(value)=>set({message:value}),
   setaddmember:(groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,member_no:data.member_no+1}:data)})),
    setaddadmin:(id,name,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,admins_info:[...data.admins_info,{id:id,name:name,lastseenmessageId:""}]}:data)})),
    setremovemember:(id,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,member_no:data.member_no-1}:data)})),
    setremoveadmin:(id,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,admins_info:data.admins_info.filter(data=>data.id!==id)}:data)}))
}))
export const Groupsendrequest=create<grouprequst>((set)=>({
    requests:[],
    setrequest:(value)=>set((v)=>({requests:[...v.requests,value]})),
    setrequests:(value)=>set(({requests:value})),
    removerequest:(groupId,id)=>set((v)=>({requests:v.requests.filter(data=>data.groupId!==groupId&&data.sendBy.id!==id)})),
    setrequeststatus:(value,groupId,id)=>set((v)=>({requests:v.requests.map(data=>(data.groupId===groupId&&data.sendBy.id===id)?{...data,status:value}:data)}))
}))
export const Grouprecieverequest=create<grouprequst>((set)=>({
    requests:[],
    setrequest:(value)=>set((v)=>({requests:[...v.requests,value]})),
    setrequests:(value)=>set(({requests:value})),
    removerequest:(groupId,id)=>set((v)=>({requests:v.requests.filter(data=>data.groupId!==groupId&&data.sendBy.id!==id)})),
    setrequeststatus:(value,groupId,id)=>set((v)=>({requests:v.requests.map(data=>(data.groupId===groupId&&data.sendBy.id===id)?{...data,status:value}:data)}))
}))
export const Groupexists=create<searchexistgrouplist>((set)=>({
    groups:[],
    message:"",
    setgroup:(value)=>set((v)=>({groups:[...v.groups,value]})),
    setgroups:(value)=>set((v)=>({groups:[...v.groups,...value]})),
    removegroup:(groupId:string)=>set((v)=>({groups:v.groups.filter(data=>data.groupId!==groupId)})),
    setstatus:(value,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,status:value}:data)})),
    setmessage:(value)=>set(({message:value})),
    setaddmember:(groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,member_no:data.member_no+1}:data)})),
    setaddadmin:(id,name,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,admins_info:[...data.admins_info,{id:id,name:name,lastseenmessageId:""}]}:data)})),
    setremovemember:(id,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,member_no:data.member_no-1}:data)})),
    setremoveadmin:(id,groupId)=>set((v)=>({groups:v.groups.map(data=>data.groupId===groupId?{...data,admins_info:data.admins_info.filter(data=>data.id!==id)}:data)}))
}))
export const Grouppicked=create<existgroupconversation>((set)=>({
    group:{groupId:"",name:"",description:"",admins:[],members:[],code:"",createdBy:"",createdAt:new Date(),updatedAt:new Date(),settings:{onlyAdminCanEditInfo:false,onlyAdminCanMessage:false
    },status:"archived"},
    conversations:[],
    setconversation:(value)=>set(({group:value})),
    setconversations:(value)=>set(({conversations:value})),
    setsngleconversations:(value)=>set((v)=>({conversations:[...v.conversations,value]})),
    setgroupname:(value)=>set((v)=>({group:{...v.group,name:value}})),
    setgroupdescription:(value)=>set((v)=>({group:{...v.group,description:value}})),
    setgroupcode:(value)=>set((v)=>({group:{...v.group,code:value}})),
    setaddgroupmembers:(value)=>set((v)=>({group:{...v.group,members:[...v.group.members,value]}})),
    removegroupmember:(id)=>set((v)=>({group:{...v.group,members:v.group.members.filter(data=>data.id!==id)}})),
    setgroupadmin:(id,name)=>set((v)=>({group:{...v.group,admins:[...v.group.admins,id]}})),
    removegroupadmin:(id)=>set((v)=>({group:{...v.group,admins:v.group.admins.filter(data=>data!==id)}})),
    setgroupstatus:(value)=>set((v)=>({group:{...v.group,status:value}})),
   setgroupsettings:(key,value)=>
set((v)=>({
  group:{
    ...v.group,
    settings:{
      ...v.group.settings,
      [key]: value
    }
  }
})),
setviewmessage:(id,messageId)=>set((v)=>({group:{...v.group,members:v.group.members.map(data=>data.id===id?{...data,lastseenmessageId:messageId}:data)}})),
setpagimessages:(value)=>set((v)=>({conversations:[...value,...v.conversations]})),
setslicemessage: () =>set((v) => ({
    conversations:v.conversations.slice(-50),
  })),
  setconversationchangestatus:(messageId,status)=>set((v)=>({conversations:v.conversations.map(data=>data.globalId===messageId?{...data,status:status}:data)})),
  setconversationmessageedit:(globalId:string,message:string)=>set((v)=>({conversations:v.conversations.map(data=>data.globalId===globalId?{...data,message:message}:data)}))
}))
export const Chatypepicked=create<chattypepickd>((set)=>({
    type:"dm",
    settype:(value)=>set({type:value})
}))
export const Groupmessagebar=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set(({name:value}))
}))
export const Grouptypinglist=create<groupchattyping>((set)=>({
    typing:[],
    setaddtyping:(value)=>set((v)=>({typing:[...v.typing,value]})),
    setremovetyping:(id)=>set((v)=>({typing:v.typing.filter(data=>data.id!==id)})),
    settyping:(id,status)=>set((v)=>({typing:v.typing.map(data=>data.id===id?{...data,status:status}:data)}))
}))
export const Grouppagination=create<conversationspagination>((set)=>({
    hasMore:true,
    cursor_id:"",
    setcursorid:(value)=>set(({cursor_id:value})),
    sethasmore:(value)=>set(({hasMore:value}))
}))
export const GroupuserseenmessageId=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set((v)=>({name:value}))
}))
export const Groupreplymessage=create<replytomessage>((set)=>({
    global_id:"",
    message:"",
    original_message:"",
    setglobal_id:(value)=>set((v)=>({global_id:value})),
    setoriginal_message:(value)=>set({original_message:value}),
    setmessage:(value)=>set(({message:value})),
    setcleanvalue:()=>set(({global_id:"",message:""}))
}))
export const Grouptypingonline=create<grouptypingonline>((set)=>({
    list:[],
    setlist:(value)=>set((v)=>({list:[...v.list,value]})),
    setchangestatus:(value,id)=>set((v)=>({list:v.list.map(data=>data.id===id?{...data,status:value}:data)})),
    setremovelist:(value)=>set((v)=>({list:v.list.filter(data=>data.id!==value)})),
    setchangetypingstatus:(value,id)=>set((v)=>({list:v.list.map(data=>data.id===id?{...data,online:value}:data)})),
    setchangeonlinestatus:(value,id)=>set((v)=>({list:v.list.map(data=>data.id===id?{...data,online:value}:data)}))
}))
export const Groupsettings=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set({value:value})
}))
export const Reloadeverything=create<reloadvrythng>((set)=>({
    Grpexistlist:false,
    Grprequestsrecieve:false,
    Grprequestssend:false,
    Onetooneexistlist:false,
    Onetoonerequests:false,
    setgrpexistlist:(value)=>set(({Grpexistlist:value})),
    setgrprequestsrecieve:(value)=>set({Grprequestsrecieve:value}),
    setgrprequestssend:(value)=>set({Grprequestssend:value}),
    setonetooneexistlist:(value)=>set({Onetooneexistlist:value}),
    setonetoonerequests:(value)=>set({Onetoonerequests:value})
}))
export const Userdetails=create<userdetails>((set)=>({
    name:"",
    email:"",
    setname:(value)=>set(({name:value})),
    setemail:(value)=>set({email:value})
}))
export const Colabloading=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set({value:value})
}))
export const Colabroomvalue=create<userlogin>((set)=>({
    password:"",
    email:"",
    setpassword:(value)=>set({password:value}),
    setemail:(value)=>set({email:value})
}))
export const Colabexistroomlist=create<room>((set)=>({
    rooms:[],
    setroom:(value)=>set((v)=>({rooms:[...v.rooms,value]})),
    setrooms:(value)=>set(({rooms:value})),
    setname:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,name:value}:data)})),
    setdescription:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,description:value}:data)})),
    setcode:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,code:value}:data)})),
    setroommember:(id,member)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,members:[...data.members,member]}:data)})),
    setmembermute:(id,memberId,muted)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,members:data.members.map(dataa=>dataa.userId===memberId?{...dataa,isMuted:muted}:dataa)}:data)})),
    setmemberrole:(roomId,memberId,role)=>set((v)=>({rooms:v.rooms.map(data=>data.id===roomId?{...data,members:data.members.map(dataa=>dataa.userId===memberId?{...dataa,role:role}:dataa)}:data)})),
    removeroommember:(roomId,memberId)=>set((v)=>({rooms:v.rooms.map(data=>data.id===roomId?{...data,members:data.members.filter(dataa=>dataa.userId!==memberId)}:data)})),
    setroomremovemember:(memberId,roomId)=>set((v)=>({rooms:v.rooms.map(data=>data.id===roomId?{...data,members:data.members.filter(dataa=>dataa.userId!==memberId)}:data)})),
    setremoveroom:(roomId)=>set((v)=>({rooms:v.rooms.filter(data=>data.id!==roomId)})),
    setdocumentcount:(count:number,documentId:string)=>set((v)=>({rooms:v.rooms.map(data=>data.id===documentId?{...data,documents:count}:data)}))
}))
export const Colabsearchroomlist=create<searchroom>((set)=>({
    rooms:[],
    setname:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,name:value}:data)})),
    setdescription:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,description:value}:data)})),
    setcode:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,code:value}:data)})),
    setrooms:(value)=>set({rooms:value}),
    setmembers:(value,id)=>set((v)=>({rooms:v.rooms.map(data=>data.id===id?{...data,members:value}:data)}))
}))
export const Colabsearchuserlist=create<searchuser>((set)=>({
    users:[],
    setusrs:(value)=>set({users:value}),
    removeusers:(value)=>set((v)=>({users:v.users.filter(data=>data.id!==value)}))
}))
export const Colabrequests=create<colabrequest>((set)=>({
    requests:[],
    setrequests:(value)=>set((v)=>({requests:[...v.requests,value]})),
    setrequeststatus:(value,id)=>set((v)=>({requests:v.requests.map(data=>data.id===id?{...data,status:value}:data)}))
}))
export const Roompicked=create<roompicked>((set)=>({
    room:{name:"",description:"",code:"",id:"",members:[],createdAt:new Date(),createdBy:"",documents:0},
    documentList:[],
    message:[],
    setroom:(value)=>set(({room:value})),
    setdocument:(value)=>set((v)=>({documentList:[...v.documentList,value]})),
    removedocument:(id)=>set((v)=>({documentList:v.documentList.filter(data=>data.id!==id)})),
    setroomname:(value)=>set((v)=>({room:{...v.room,name:value}})),
    setroomdescription:(value)=>set((v)=>({room:{...v.room,description:value}})),
    setroomcode:(value)=>set((v)=>({room:{...v.room,code:value}})),
    setroommemberrole:(value,id)=>set((v)=>({room:{...v.room,members:v.room.members.map(data=>data.userId===id?{...data,role:value}:data)}})),
    setroommembers:(value)=>set((v)=>({room:{...v.room,members:[...v.room.members,value]}})),
    setroommembermuted:(value,id)=>set((v)=>({room:{...v.room,members:v.room.members.map(data=>data.userId===id?{...data,isMuted:value}:data)}})),
    setdocuments:(value)=>set((v)=>({documentList:value})),
    setdocumentcontenttext:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>(data.id===id&&data.type==="text")?{...data,content:value}:data)})),
    setdocumentcontentcanvas:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>(data.id===id&&data.type==="canvas")?{...data,content:value}:data)})),
    setdocumenttitle:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,title:value}:data)})),
    setdocumentclonedfrom:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,clonedFrom:value}:data)})),
    setdocumentlockedAt:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,lockedAt:value}:data)})),
    setdocumentupdatedAt:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,updatedAt:value}:data)})),
    setdocumentlockedBy:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,lockedBy:value}:data)})),
    setdocumentvisibility:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,visibility:value}:data)})),
    setmessage:(value)=>set((v)=>({message:[...v.message,value]})),
    setmessages:(value)=>set((v)=>({message:value})),
    setmessagestatus:(value,id)=>set((v)=>({message:v.message.map(data=>data.id===id?{...data,status:value}:data)})),
    setmemberlastseenmessageid:(value,id)=>set((v)=>({room:{...v.room,members:v.room.members.map(data=>data.userId===id?{...data,lastseenmessageId:value}:data)}})),
    setmessageedit:(value,id)=>set((v)=>({message:v.message.map(data=>data.id===id?{...data,content:value}:data)})),
    setpagimessages:(value)=>set((v)=>({message:[...value,...v.message]})),
    setroomremovemember:(memberId)=>set((v)=>({room:{...v.room,members:v.room.members.filter(data=>data.userId!==memberId)}})),
    setroommemberonline:(value,id)=>set((v)=>({room:{...v.room,members:v.room.members.map(data=>data.userId===id?{...data,online:value}:data)}})),
    setroommembertyping:(value,id)=>set((v)=>({room:{...v.room,members:v.room.members.map(data=>data.userId===id?{...data,typing:value}:data)}})),
    setroomdocumentstatus:(value,id)=>set((v)=>({documentList:v.documentList.map(data=>data.id===id?{...data,status:value}:data)}))
}))
export const Onlinelist=create<onlineroomlist>((set)=>({
    list:[],
    setlist:(value)=>set((v)=>({list:[...v.list,value]})),
    setlists:(value)=>set({list:value}),
    setremove:(value)=>set((v)=>({list:v.list.filter(data=>data.id!==value)}))
}))
export const Documentupload=create<documentupload>((set)=>({
    isuploading:false,
    uploaded:false,
    text:"",
    setisuploading:(value)=>set(({isuploading:value})),
    setisuploaded:(value)=>set(({uploaded:value})),
    settext:(value)=>set(({text:value})),
    setcleanvalue:()=>set(({isuploading:false,uploaded:false,text:""}))
}))
export const Documentrendertype=create<documentrendertype>((set)=>({
    type:"canvas",
    settype:(value)=>set(({type:value}))
}))
type DocumentContentPatch = IDocument extends { content: infer C } ? Partial<C> : never
 
type DocumentStore = {
  activeDocumentId: string | null
  lockedBy: Record<string, string | null> // documentId -> userId holding the lock
  setActiveDocument: (id: string | null) => void
  setLock: (documentId: string, userId: string | null) => void
}
 
export const useDocumentStore = create<DocumentStore>((set) => ({
  activeDocumentId: null,
  lockedBy: {},
  setActiveDocument: (id) => set({ activeDocumentId: id }),
 
  setLock: (documentId, userId) =>
    set((s) => ({ lockedBy: { ...s.lockedBy, [documentId]: userId } })),
}))
export const Shapesarray=create<shapesarray>((set)=>({
    shapes:[],
    setshape:(value)=>set((v)=>({shapes:[...v.shapes,value]})),
    deleteshape:(value)=>set((v)=>({shapes:v.shapes.filter(data=>data.id!==value)})),
    updateshape: (id, x, y) =>
  set((state) => ({
    shapes: state.shapes.map((shape) => {
      if (shape.id !== id)
        return shape;

      switch (shape.type) {
        case "line":
          return {
            ...shape,
            points: [
              ...shape.points,
              x,
              y,
            ],
          };

        case "rect":
          return {
            ...shape,
            width:
              x - shape.x,
            height:
              y - shape.y,
          };

        case "circle":
          const dx =
            x - shape.x;
          const dy =
            y - shape.y;

          return {
            ...shape,
            radius:
              Math.sqrt(
                dx * dx +
                  dy * dy
              ),
          };

        default:
          return shape;
      }
    }),
  })),
  updatetext: (
  id: string,
  text: string
) =>
  set((state) => ({
    shapes: state.shapes.map((shape) =>
      shape.id === id &&
      shape.type === "text"
        ? {
            ...shape,
            text,
          }
        : shape
    ),
  })),
  setshapes:(value)=>set(({shapes:value}))
}))
export const Dashboarddetails=create<dashboarddetails>((set)=>({
    documents:0,
    lastactivity:new Date(),
    setdocuments:(value)=>set(({documents:value})),
    setlastactivity:(value)=>set({lastactivity:value})
}))
export const Topbarvalue=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set(({value:value}))
}))
export const Sidebarvalue=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set(({value:value}))
}))
export const Activitylist=create<activitylist>((set)=>({
    activity:[],
    setactivitys:(value)=>set((v)=>({activity:value})),
    setactivity:(value)=>set((v)=>({activity:[...v.activity,value]}))
}))
export const Roomsearch=create<searchname>((set)=>({
    name:"",
    setname:(value)=>set({name:value})
}))
export const Documentarearender=create<searchvalue>((set)=>({
    value:false,
    setvlue:(value)=>set(({value:value}))
}))
export const Usrlst=create<usrlst>((set)=>({
    users:[],
    setusers:(value)=>set((v)=>({users:[...v.users,value]})),
    setuserchangename:(value,name)=>set((v)=>({users:v.users.map(data=>data._id===value?{...data,name:name}:data)})),
    removeusers:(value)=>set((v)=>({users:v.users.filter(data=>data._id!==value)}))
}))
export const Documentsearch=create<userdetails>((set)=>({
    name:"",
    email:"",
    setname:(value)=>set(({name:value})),
    setemail:(value)=>set(({email:value}))
}))
/*setconversation:(value:groupconversation)=>void,
    setconversations:(value:groupconversations[])=>void,
    setgroupname:(value:string)=>void,
    setgroupdescription:(value:string)=>void,
    setgroupcode:(groupId:string,code:string)=>void,
    setaddgroupmembers:(member:groupmember)=>void,
    removegroupmember:(id:string,name:string)=>void,
    setgroupadmin:(id:string,name:string)=>void,
    removegroupadmin:(id:string,name:string)=>void,
    setgroupsettings:(mode:number,value:boolean)=>void,
    setgroupstatus:(value:grpstatustype)=>void,*/

