import { user, userlistt } from '../types/user'
import {WebSocketServer} from 'ws'
import jsonwebtoken from 'jsonwebtoken'
import { MySocket } from '../types/wd'
import { usersocket } from '../types/user'
import { messagetypee, oneto1conversation, status } from '@/types/1to1conversations'
import { conversations } from '@/types/1to1conversations'
import { userst } from '../types/user'
import { onetoonerequest } from '@/types/request'
import { onetooneconversationdetails } from '@/types/1to1conversations'
import { usrlist } from '../types/user'
import { message } from '@/types/1to1conversations'
import { messagetype } from '@/types/1to1conversations'
import { messagestatus } from '@/types/1to1conversations'
import { requesttype } from '../types/user'
import {onetooneconversationtyping} from '@/types/user'
import { usrlistt } from '../types/user'
import { groupconversation, groupconversations as groupcnvrsations, promote, RequestType, groupsettings, grpconversations } from '@/types/groupconversations'
import { groupconversations as groupconversationsmessages } from '@/types/groupconversations'
import { groupcode } from '@/types/groupconversations'
import { grouprequest } from '@/types/groupconversations'
import { groupsexistlist } from '@/types/groupconversations'
import { grpstatustype } from '@/types/groupconversations'
import { grouptyping } from '@/types/groupconversations'
import { grouponlinetyping } from '@/types/groupconversations'
import { CanvasContent, collabrole, doctype, Room, roomtype, SearchRoom, Searchscoreroom, Searchscoreuser, Searchuser } from '@/types/collab'
import { Colabrequest } from '@/types/collab'
import { message as colabmessage} from '@/types/collab'
import { IDocument } from '@/types/collab'
import {activity} from '@/types/collab'
import Getusrs from '@/actions/getusrs'
import Createroommember from '@/actions/createroommember'
import room from '@/models/room'
import Createrequestcollab from '@/actions/createrequestcollab'
import Markcolabrequest from '@/actions/markcolabrequest'
import Getroomfirstmessages from '@/actions/getroomfirstmessages'
import Getroomdocuments from '@/actions/getroomdocuments'
import Getuserrooms from '@/actions/Getuserrooms'
import Deletedocument from '@/actions/Deletedocument'
import Bootstrapservermemory from '@/actions/Bootstrapservermemory'
import Createdocumenttext from '@/actions/createdocument'
import Makrdocumentcontent from '@/actions/markdocumentcontent'
import Createmessage from '@/actions/createmessage'
import Markcolabmemberstatus from '@/actions/Markcolabmemberstatus'
import Setdocumentlockrelease from '@/actions/setdocumentlockrelease'
import Setdocumentlockedby from '@/actions/setdocumentlockedBy'
import Getviewmessageid from '@/actions/getviewmessageid'
import Chnagemessagestatus from '@/actions/changemessagestatus'
import Editroommessages from '@/actions/editroommessage'
import Createmessagereply from '@/actions/createmessagereply'
import Editmembermute from '@/actions/editmembermute'
import Editforcereleaselock from '@/actions/editforcereleaselock'
import Editlockassign from '@/actions/editlockassign'
import Editroomleave from '@/actions/editroomleave'
import Editroomdetails from '@/actions/editroomdetails'
import RoomsGrid from '@/components/dashboardroomcard'
import Fileconverter from '@/actions/fileconverter'
import Createdocumentclone from '@/actions/createdocumentclone'
import Editkickmember from '@/actions/editkickmember'
import Editchangecode from '@/actions/editchangecode'
import Editdocumentvisibilitychange from '@/actions/editdocumentvisibilitychange'
import Editdocumenttitle from '@/actions/editdocumenttitle'
import Createactivity from '@/actions/createactivity'
import Getactivity from '@/actions/getactivity'
import Getgroupafterconversations from '@/actions/getgroupafterconversations'
import Createroom from '@/actions/createroom'
import Adminflipstatusdocument from '@/actions/adminflipstatusdocument'
import Documenttrashed from '@/actions/documenttrashed'
import Documentrestore from '@/actions/documentrestore'
import Documentpermdel from '@/actions/documentpermdel'
console.log("websocket running on 8080")
const userlist=new Map<string,Set<usersocket>>()
const oneto1conversations=new Map<string,oneto1conversation>()
const oneto1conversationmessages=new Map<string,conversations[]>()
const oneto1conversationrequest=new Map<string,onetoonerequest>()
const oneto1conversationtyping=new Map<string,onetooneconversationtyping>()
const groupconversations=new Map<string,groupconversation>()
const groupconversationmessages=new Map<string,groupconversationsmessages[]>()
const groupconversationcode=new Map<string,groupcode>()
const groupconversationrequest=new Map<string,grouprequest>()
const groupconversationtyping=new Map<string,grouptyping[]>()
const colabroomlist=new Map<string,Room>()
const colabrequest=new Map<string,Colabrequest>()
const colabroommessage=new Map<string,colabmessage[]>()
const colabroomdocuments=new Map<string,Map<string,IDocument>>()
const colabroommessages=new Map<string,Map<string,colabmessage>>()
const colabactivity=new Map<string,activity[]>()

let serverReady=false
const pendingMessages:{socket:MySocket,data:any}[]=[]
const JWT_SECRET=process.env.JWT_SECRET as string
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET")
async function bootstrapServerState(){
    try{
        const {rooms,documentsByRoom,messagesByRoom}=await Bootstrapservermemory()
        rooms.forEach((room)=>{
            colabroomlist.set(room.id,room)

            const documentMap=new Map<string,IDocument>()
            ;(documentsByRoom[room.id]||[]).forEach((doc)=>{
                documentMap.set(doc.id,doc)
            })
            colabroomdocuments.set(room.id,documentMap)

            const messageMap=new Map<string,colabmessage>()
            ;(messagesByRoom[room.id]||[]).forEach((msg)=>{
                messageMap.set(msg.id,msg)
            })
            colabroommessages.set(room.id,messageMap)
        })
        console.log(`server memory bootstrapped: ${rooms.length} room(s) loaded from database`)
    }
    catch(err){
        console.error("failed to bootstrap server memory from database",err)
    }
    finally{
        serverReady=true
        const queued=[...pendingMessages]
        pendingMessages.length=0
        queued.forEach(({socket,data})=>{
            socket.emit("message",data)
        })
    }
}
bootstrapServerState()

const wss=new WebSocketServer({port:Number(process.env.PORT)||8080})
function handleregister(name:string,email:string,_id:string,socket:any){
    userlist.set(_id,new Set())
    const userr=userlist.get(_id)
    userr?.add({name:name,email:email,_id:_id,socket:socket,description:""})
}
async function handlesearchrequest(search:string,name:string,_id:string){
   const user:userst[]=[]
   const formatted_users=await Getusrs()
        formatted_users.forEach((valuee)=>{
            if((oneto1conversationrequest.get(getkey(_id,valuee._id))?.status==="pending"||!oneto1conversationrequest.get(getkey(_id,valuee._id)))&&!oneto1conversations.get(getkey(_id,valuee._id))){
            let getsimilarityscore=getsimilarityusers(search,valuee.name)
            user.push({name:valuee.name,email:valuee.email,description:valuee.description,score:getsimilarityscore,_id:valuee._id})
            }
        }) 
   const users:userlistt[]=([...user].sort((a,b)=>b.score-a.score)).map(data=>({...data,conversation_exist:false,request_send:getrequestsend(data._id,_id)}))
   if(users.length===0){
    userlist.get(_id)?.forEach((value)=>{
        if(value.socket.readyState===WebSocket.OPEN){
            value.socket.send(JSON.stringify({event:"search:response",payload:{users:users,message:"No user found..."}}))
        }
    })
   }
   else{
    userlist.get(_id)?.forEach((value)=>{
        if(value.socket.readyState===WebSocket.OPEN){
            value.socket.send(JSON.stringify({event:"search:response",payload:{users:[...users].map(data=>({...data,score:undefined})),message:"Users found"}}))
        }
    })
   }
}
function getsimilarityusers(search:string,name:string){
   const namelength=name.length
   let index=0
   let score=0
   for(let i=0;i<namelength;i++){
     if(search.includes(name[i])&&(index<search.indexOf(name[i])||i===0)){
        score+=1
        index=search.indexOf(name[i])
     }
   }
   return score
}

export function getkey(senderId:string,recieverId:string){
    const array=[senderId,recieverId].map(data=>data.toString()).sort((a,b)=>a.toLowerCase().localeCompare(b.toLowerCase())).join(":")
    return array
}

   
    function getstatus(status:messagestatus,senderId:string,recieverId:string,_id:string,message:string,createdAt:Date){
        if(oneto1conversationmessages.has(getkey(senderId,recieverId))){
            const messages=oneto1conversationmessages.get(getkey(senderId,recieverId))
            const messageee=messages?.find(data=>data.createdAt===createdAt&&data.senderId===_id&&data.message===message)
            if(messageee){
                if(messageee.status==="view"||messageee.status!=="deleted"){
                    return "deleted"
                }
            }
            else{
                return status
            }
        }
        return status
    }
    function getcryptomessageid(){
        const messageid=crypto.randomUUID()
        return messageid
    }
   
   
  
    function getrequestsend(recieverId:string,senderId:string){
        const requestsend=oneto1conversationrequest.get(getkey(senderId,recieverId))
        let value:requesttype="send"
        if(requestsend?.senderId===senderId&&requestsend?.recieverId===recieverId){
            return value
        }
        else if(requestsend?.recieverId===senderId&&requestsend?.senderId===recieverId){
            value="recieved"
            return value
        }
        else{
            value="none"
            return value 
        }
    } 
    function handletypingonetooneconversation(senderId:string,recieverId:string,typing_id:string,typing:boolean){
        const onetooneconversationtyping=oneto1conversationtyping.get(getkey(senderId,recieverId))
        console.log(onetooneconversationtyping)
        let id:string=""
        if(onetooneconversationtyping&&typing){
            if(onetooneconversationtyping.user_1._id===typing_id){
                onetooneconversationtyping.user_1.typing=true
                id=onetooneconversationtyping.user_2._id
                console.log("typing",id)
            }
            else if(onetooneconversationtyping.user_2._id===typing_id){
                onetooneconversationtyping.user_2.typing=true
                id=onetooneconversationtyping.user_1._id
                console.log("typing",id)
            }
            userlist.get(id)?.forEach((value)=>{
                if(value.socket.readyState===WebSocket.OPEN){
                    console.log("sended")
                    value.socket.send(JSON.stringify({event:"message:response:typing:onetooneconversation",payload:{id:typing_id,typing:typing}}))
                }
            })
        }
        else if(onetooneconversationtyping&&!typing){
            if(onetooneconversationtyping.user_1._id===typing_id){
                onetooneconversationtyping.user_1.typing=false
                id=onetooneconversationtyping.user_2._id
                console.log("not_typing",id)
            }
            else if(onetooneconversationtyping.user_2._id===typing_id){
                onetooneconversationtyping.user_2.typing=false
                id=onetooneconversationtyping.user_1._id
                console.log("not_typing",id)
            }
            userlist.get(id)?.forEach((value)=>{
                if(value.socket.readyState===WebSocket.OPEN){
                    value.socket.send(JSON.stringify({event:"message:response:typing:onetooneconversation",payload:{id:typing_id,typing:typing}}))
                }
            })
        }
    }
    function handleloginonetooneconversation(id:string,_id:string){
        oneto1conversations.forEach((value)=>{
           if(value.participants.includes(id)&&value.participants.includes(_id)){
              if(_id&&id){
                userlist.get(_id)?.forEach((value)=>{
                    if(value.socket.readyState===WebSocket.OPEN){
                        value.socket.send(JSON.stringify({event:"user:status:onetooneconversation",payload:{id:id,online:true}}))
                    }
                })
              }
           }
       })
    }
    async function handleloadmoreonetooneconversations(senderId:string,recieverId:string,id:string,cursor_id:string){
       
    }
    function getrequestsendrecievedmessage(senderId:string,recieverId:string){
        const request=oneto1conversationrequest.get(getkey(senderId,recieverId))
        console.log(senderId,recieverId)
        if(request?.senderId===senderId){
            console.log("triggerrrrr")
            return "Request Already send"
        }
        else if(request?.recieverId===senderId){
            console.log("triggerrrrrrrrr")
            return "Request Already recieved"
        }
    }
    async function handlegetcursoridhasmore(senderId:string,recieverId:string,cryptoid:string){
        (cryptoid)
        console.log("specificconversation","")
        userlist.get(senderId)?.forEach((value)=>{
            if(value.socket.readyState===WebSocket.OPEN){
                value.socket.send(JSON.stringify({event:"message:response:cursorid",payload:{cursor_id:""}}))
            }
        })
        userlist.get(recieverId)?.forEach((value)=>{
            if(value.socket.readyState===WebSocket.OPEN){
                value.socket.send(JSON.stringify({event:"message:response:cursorid",payload:{cursor_id:""}}))
            }
        })
    }
    async function handleleaveonetooneconversation(pressed:string,senderId:string,recieverId:string){
        if(pressed&&senderId&&recieverId){
            oneto1conversationmessages.delete(getkey(senderId,recieverId))
            const onetooneconversation=oneto1conversations.get(getkey(senderId,recieverId))
            if(onetooneconversation?.status){
            onetooneconversation.status="deleted"
            }
            const onetooneconversationrequest=oneto1conversationrequest.get(getkey(senderId,recieverId))
            if(onetooneconversationrequest){
                onetooneconversationrequest.status="deleted"
            }
            let id=""
            if(pressed===senderId){
                id=recieverId
            }
            else if(pressed===recieverId){
                id=senderId
            }
            userlist.get(pressed)?.forEach((value)=>{
                if(value.socket.readyState===WebSocket.OPEN){
                    value.socket.send(JSON.stringify({event:"request:response:onetooneconversation:leave",payload:{message:"Thos conversation is now deleted",senderId:senderId,recieverId:recieverId,_id:id}}))
                }
            })
            userlist.get(id)?.forEach((value)=>{
                if(value.socket.readyState===WebSocket.OPEN){
                    value.socket.send(JSON.stringify({event:"request:response:onetooneconversation:leave",payload:{message:"Your conversation is being deleted due to the other party leaving",senderId:senderId,recieverId:recieverId,_id:pressed}}))
                }
            })
        }
    }
    function handledeleteformeonetooneconversation(senderId:string,recieverId:string,status:messagestatus,messageid:string,userid:string){
        if(senderId&&recieverId&&status&&userid&&messageid){
            const message=oneto1conversationmessages.get(getkey(senderId,recieverId))
            const messagess=[...message||[]].map(data=>data.global_id===messageid?{...data,status:status}:data)
            console.log("function for message deletion in server triggered")
            oneto1conversationmessages.set(getkey(senderId,recieverId),messagess)
            let id=""
            if(senderId===userid){
                id=recieverId
            }
            else if(recieverId===userid){
                id=senderId
            }
            userlist.get(userid)?.forEach((value)=>{
               if(value.socket.readyState===WebSocket.OPEN){
                value.socket.send(JSON.stringify({event:"message:response:deleteforme:onetooneconversation",payload:{message:"Message deleted for u",messageId:messageid,status:"deleteforme"}}))
               }
            })
        }
    }
    function handlechangenameonetooneconversation(id:string,name:string){
      if(id&&name){
        userlist.get(id)?.forEach((value)=>{
            if(value.socket.readyState===WebSocket.OPEN){
                value.name=name
                value.socket.send(JSON.stringify({event:"request:response:namechange:onetooneconversation",payload:{message:"Name changed",_id:id,name:name}}))
            }
        })
      }
    }
    function handlechangedescriptiononetooneconversation(description:string,_id:string){
        userlist.get(_id)?.forEach((value)=>{
            if(value.socket.readyState===WebSocket.OPEN){
                value.description=description
                value.socket.send(JSON.stringify({event:"request:response:descriptionchange:onetooneconversation",payload:{_id:_id,description:description,message:"Description changed successfully"}}))
            }
        })
    }
    function handlelogoutonetooneconversation(id:string){
        oneto1conversations.forEach((value)=>{
            if(value.participants.includes(id)){
                const idd=value.participants.filter(data=>data!==id)[0]
                userlist.get(idd)?.forEach((value)=>{
                    if(value.socket.readyState===WebSocket.OPEN){
                        value.socket.send(JSON.stringify({event:"user:status:logout:onetooneconversation",payload:{id:id,oneline:false,date:new Date()}}))
                    }
                })
            }
        })
    }
    async function handleexistusers(id:string){
        let userrr:usrlistt={name:"",description:"",_id:"",email:"",unred_messages:0,seen:false}
        let userrs:usrlistt[]=[]
        const userlst=oneto1conversations
        for(const [key,conversation] of userlst){
            if(conversation.participants.includes(id)){
                const _id=conversation.participants.filter(data=>data!==id)[0]
                userlist.get(_id)?.forEach((valuee)=>{
                    userrr._id=valuee._id
                    userrr.description=valuee.description
                    userrr.name=valuee.name
                    userrr.email=valuee.email
                })
                
            }
        }
        userlist.get(id)?.forEach((value)=>{
            if(value.socket.readyState===WebSocket.OPEN){
                value.socket.send(JSON.stringify({event:"request:response:userexist",payload:{users:userrs}}))
            }
        })
    }
   
   
   
    export function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}
  function sendmessage(_id:string,event:string,payload:object){
    userlist.get(_id)?.forEach((value)=>{
        if(value.socket.readyState===WebSocket.OPEN){
            value.socket.send(JSON.stringify({event:event,payload:payload}))
        }
    })
  }
  function handlesearchgrouprequest(search:string,_id:string){
    if(search&&_id){
        console.log("search request function triggered in server")
        console.log(search,_id)
        const grouplist:groupconversation[]=[]
        const groupnamelist:any=[]
        groupconversations.forEach((value)=>{
            if(value.code.toUpperCase()===search.toUpperCase()){
                grouplist.push(value)
            }
        })
        console.log(groupconversations)
        groupconversations.forEach((value)=>{
            if(value.status!=="deleted"){
                let similarityusers=getsimilarityusers(search,value.name)
                groupnamelist.push({...value,similarityscore:similarityusers})
            }
        })
        console.log(groupnamelist)
        const namelist:any=[...groupnamelist].sort((a,b)=>a.similarityscore-b.similarityscore).map(data=>({name:data.name,description:data.description,code:data.code,member_no:data.members.length,status:data.status,createdAt:data.createdAt,admins_info:data.members.map((dataa:any)=>({name:dataa.name,id:dataa.id,lastseenmessageId:""})),groupId:data.groupId,createdBy:data.createdBy}))
        console.log(grouplist)
        if((grouplist?.length+namelist?.length)>0){
            const grpslst:groupsexistlist[]=[...grouplist,...namelist].map((data)=>({name:data.name,description:data.description,code:data.code,member_no:data.members?.length,status:data.status,createdAt:data.createdAt,admins_info:data.members?.map((dataa:{name:string,id:string,lastseenmessageId?:string})=>({name:dataa.name,id:dataa.id,lastseenmessageId:""})),groupId:data.groupId,createdBy:data.createdBy}))
            sendmessage(_id,"request:response:groups:search",{groups:grpslst,message:`${grpslst.length} groups found`})
        }
        else{
            sendmessage(_id,"request:response:groups:search",{groups:grouplist,message:"No groups found"})
        }
    }
  }
  function handlegroupstatuschange(groupId:string,status:grpstatustype,_id:string){
        const group=groupconversations.get(groupId)
        if(group){
            group.status=status
            sendmessage(_id,"request:response:statuschange:group",{message:"An error occurred"})
        }
        else{
            sendmessage(_id,"request:response:statuschange:group",{groupId:groupId,status:status,message:"Group status chnaged"})
        }
  }
  
 
  
 
  function handlechangememberstatus(groupId:string,promoteId:string,status:promote,id:string){
      const group=groupconversations.get(groupId)
      if(group){
        const groupmembers=group.members
        if(status==="admin"){
        if(group.admins.includes(id)&&groupmembers.some(data=>data.id===promoteId)){
            if(group.admins.includes(promoteId)){
                sendmessage(id,"request:response:changememberstatus:group",{message:"Already an admin"})
            }
            else{
            group.admins.push(promoteId)
            sendmessage(id,"request:response:changememberstatus:group",{message:"Success",status:status,promoteId:promoteId,name:group.members.find(data=>data.id===promoteId)?.name,extramessage:"Member successfully converted to admin"})
            sendmessage(promoteId,"request:response:changememberstatus:group",{message:"Success",status:status,promoteId:promoteId,name:group.members.find(data=>data.id===promoteId)?.name,extramessage:`You are converted to admin of group ${group.name}`})
            }
        }
    }
    else if(status==="member"){
        if(group.admins.includes(id)&&groupmembers.some(data=>data.id===promoteId)&&group.createdBy===id){
            if(group.admins.includes(promoteId)){
               group.admins=[...group.admins].filter(data=>data!==promoteId)
               sendmessage(id,"request:response:changememberstatus:group",{message:"Success",status:status,promoteId:promoteId,name:group.members.find(data=>data.id===promoteId)?.name,extramessage:"Member successfully demoted to admin to member"})
               sendmessage(promoteId,"request:response:changememberstatus:group",{message:"Success",status:status,promoteId:promoteId,name:group.members.find(data=>data.id===promoteId)?.name,extramessage:"You are demoted to member from admin"})
            }
            else{
                sendmessage(id,"request:response:changememberstatus:group",{message:"Already an member"})
            }
        }
        else{
            sendmessage(id,"request:response:changememberstatus:group",{message:"Only creator of group can demote from admin to member"})
        }
    }
      }
  }
   
  function handlegrouptyping(groupId:string,id:string,name:string,status:boolean){
        const group=groupconversations.get(groupId)
        if(group){
        if(status){
            const groupconversation=groupconversationtyping.get(groupId)
            if(groupconversation){
                groupconversation.push({id:id,name:name,typing:status})
            }
            else{
                groupconversationtyping.set(groupId,[{id:id,name:name,typing:status}])
            }
        }
        else{
            const groupconversation=groupconversationtyping.get(groupId)
            if(groupconversation){
                let array:grouptyping[]=groupconversation
                   array=[...array].filter(data=>data.id!==id)
                   groupconversationtyping.set(groupId,array)  
            }
            else{
                groupconversationtyping.set(groupId,[])
            }
        }
        group.members.forEach((value)=>{
            if(value.id!==id){
                sendmessage(value.id,"request:response:grouptyping:group",{id:id,name:name,status:group.admins.includes(id)?"admin":"member",online:true,typing:true})
            }
        })
    }
  }
  async function handlegrouppagination(roomId:string,messageId:string,_id:string){ 
    const room=colabroomlist.get(roomId) 
    console.log("pagination triggered") 
    if(room){ 
        console.log("condition passed") 
        const conversations=await Getgroupafterconversations(roomId,messageId) 
        const groupconversations=conversations.reverse() 
        const response={ hasMore:conversations.length===20, cursorId:conversations.length?groupconversations[0].id:"", conversations:groupconversations } 
        console.log(response) 
        sendmessage(_id,"request:response:messagepagi:colab",{hasMore:response.hasMore,cursorId:response.cursorId,conversations:response.conversations,Success:true}) } else{ sendmessage(_id,"request:response:messagepagi:colab",{Success:false,message:"An error occurred"}) } }
  
  
 
  function handlegrouptypingonlinetyping(groupId:string,id:string,status:boolean){
        const group=groupconversations.get(groupId)
        if(group){
            const members=group.members
            if(members.some(data=>data.id===id)){
                members.forEach((value)=>{
                    if(value.id!==id){
                        sendmessage(value.id,"request:response:grouptypingonlinetyping:group",{groupId:groupId,status:status,id:id})
                    }
                })
            }
        }
  }
    async function handlecreateroom(name:string,description:string,id:string,unique_Id:string,creatorname:string){
    const room=colabroomlist.get(unique_Id)
    if(!room){
        console.log("create room function")
        console.log("name",name)
        console.log("description",description)
        console.log("id",id)
        console.log("unique_Id",unique_Id)
        const code=generateCode()
        const response=await Createroom(unique_Id,name,description,id,code)
        const respnse=await Createroommember(id,id,unique_Id,"admin")
        if(response!=="Error"&&respnse!=="Error"){
            const romm:Room={id:unique_Id,name:name,description:description,code:code,createdAt:new Date(),createdBy:id,members:[{userId:id,role:"admin",isMuted:false,joinedAt:new Date(),lastseenmessageId:"",online:false,typing:false,name:creatorname}],documents:0}
            console.log(romm,"room created")
            colabroomlist.set(unique_Id,romm)
            sendmessage(id,"request:response:createroom:colab",{room:romm,message:"Room created Successfully",Success:true})
            colabroomdocuments.set(unique_Id,new Map())
            colabroommessages.set(unique_Id,new Map())
        }
        else{
            sendmessage(id,"request:response:createroom:colab",{message:"Some error occurred",Success:false})
        }
    }
    else{
        sendmessage(id,"request:response:createroom:colab",{message:"Room already exists",Success:false})
    }
  }
  function handlesearchrooms(search:string,id:string){
    let rooms:Room[]=[]
    colabroomlist.forEach((value)=>{
        if(search.toLowerCase()===value.code.toLowerCase()){
            rooms.push(value)
        }
    })
    let room:Searchscoreroom[]=[]
    colabroomlist.forEach((value)=>{
        const score=getsimilarityusers(search,value.name)
        room.push({...value,score:score})
    })
    room=room.sort((a,b)=>a.score-b.score)
    console.log("data",room)
    const roomlist:SearchRoom[]=[...room,...rooms]?.map(data=>({id:data.id,name:data.name,description:data.description,code:data.code,members:data.members?.length,documents:0}))
    sendmessage(id,"request:response:rooms:search",{rooms:roomlist,message:"Success"})
  }
  function handlesearchusers(search:string,id:string){
    if(search&&id){
        let users:Searchscoreuser[]=[]
        userlist.forEach((value)=>{
            let name=""
            let email=""
            let idd=""
            value.forEach((value)=>{
                name=value.name
                email=value.email
                idd=value._id
            })
            if(idd!==id){
            const score=getsimilarityusers(search,name)
            users.push({name:name,email:email,id:idd,score:score})
            }
        })
        users=users.sort((a,b)=>a.score-b.score)
        console.log("data",users)
        sendmessage(id,"request:response:users:search",{users:users.map(data=>({name:data.name,email:data.email,id:data.id})),Success:true})
    }
    else{
        sendmessage(id,"request:response:users:search",{Success:false})
    }
    }
    async function handleroomrequest(roomId:string,id:string){
        console.log("server room request function triggered")
        const code=crypto.randomUUID()
        const response=await Createrequestcollab("ptorm",roomId,id,"",code)
        const request=colabrequest.get(getkey(id,roomId))
        if(request?.status==="rejected"||!request){
        if(response?.message!=="Error"){
            const requst:Colabrequest={id:response?.id||"",type:"ptorm",roomId:roomId,status:"pending",sendAt:new Date(),sendBy:id}
            console.log(request)
            colabrequest.set(getkey(id,roomId),requst)
            const room=colabroomlist.get(roomId)
            if(room){
                const roommember=room.members.filter(data=>data.role==="admin")
                roommember.forEach((value)=>{
                    sendmessage(value.userId,"request:response:reciever:roomrequest:colab",{Success:true,request:requst,message:"You recieved a new request"})
                })
                sendmessage(id,"request:response:roomrequest:colab",{Success:true,request:requst,message:"Request got send"})
            }
        }
        else{
            sendmessage(id,"request:response:roomrequest:colab",{Success:false,message:"Some error occurred"})
        }
    }
    else{
        sendmessage(id,"request:response:roomrequest:colab",{Success:false,message:"You already have send the request"})
    }
    }
    async function handleuserrequest(roomId:string,userId:string,id:string){
        const request=colabrequest.get(getkey(id,roomId))
        if(!request){
           const response=await Createrequestcollab("rmtop",roomId,id,userId,crypto.randomUUID())
           if(response?.message!=="Error"){
            const requst:Colabrequest={id:response?.id||"",type:"rmtop",sendBy:id,sendTo:userId,roomId:roomId,status:"pending",sendAt:new Date()}
            console.log(request)
            colabrequest.set(getkey(id,roomId),requst)
            sendmessage(id,"request:response:reciever:userrequest:colab",{Success:true,request:requst,message:"request send successfully"})
            sendmessage(userId,"request:response:userrequest:colab",{Success:true,request:requst,message:"You have a new request"})
           }
           else{
            sendmessage(id,"request:response:userrequest:colab",{Success:false,message:"Some error occurred"})
           }
        }
        else{
            sendmessage(id,"request:response:userrequest:colab",{Success:false,message:"Some error occurred"})
        }
    }
    async function handleroomrequestaccept(sendBy:string,roomId:string,id:string,requestId:string,name:string){
        console.log("room requested accepted by user")
        const request=colabrequest.get(getkey(sendBy,roomId))
        console.log(request)
        if(!request){
            sendmessage(id,"request:response:acceptor:roomaccept:colab",{Success:false,message:"Request doesnt exist"})
        }
        else if(request.status==="accepted"){
            sendmessage(id,"request:response:acceptor:roomaccept:colab",{Success:false,message:"Your request is already accepted"})
        }
        else if(request.status==="rejected"){
            sendmessage(id,"request:response:acceptor:roomaccept:colab",{Success:false,message:"Your request was rejected"})
        }
        else{
            const response=await Markcolabrequest("rmtop",sendBy,id,"accepted",requestId)
            const responsee=await Createroommember(crypto.randomUUID(),id,roomId,"viewer")
            if(response!=="Error"&&responsee!=="Error"){
                request.status="accepted"
                const room=colabroomlist.get(roomId)
                if(room){
                    console.log("function success",room)
                const roommembers=room.members
                let name=""
                userlist.get(id)?.forEach((value)=>{
                    name=value.name
                })
                 let count=0
                const documents=colabroomdocuments.get(roomId)
                documents?.forEach((value)=>{
                    count++
                })
                roommembers.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomaccept:colab",{member:{userId:id,isMuted:false,joinedAt:new Date(),role:"viewer",name:name},Success:true,admin:value.role==="admin",roomId:roomId,requestId:requestId})
                })
                room.members=[...room.members,{userId:id,role:"viewer",joinedAt:new Date(),isMuted:false,lastseenmessageId:"",online:false,typing:false,name:name}]
                sendmessage(id,"request:response:acceptor:roomaccept:colab",{room:{...room,documents:count},Success:true,message:"You accepted the request",requestId:requestId})
                }
                else{
                    sendmessage(id,"request:response:acceptor:roomaccept:colab",{Success:false,message:"Room doesnt exists"})
                }
            }
            else{
                sendmessage(id,"request:response:acceptor:roomaccept:colab",{Success:false,message:"Some error occurred"})
            }
        }
    }
    async function handleuseracceptrequest(roomId:string,id:string,requestId:string,sendBy:string){
        const request=colabrequest.get(getkey(sendBy,roomId))
        if(!request){
            sendmessage(id,"request:response:acceptor:useraccept:colab",{Success:false,message:"Request doesnt exist"})
        }
        else if(request.status==="accepted"){
            sendmessage(id,"request:response:acceptor:useraccept:colab",{Success:false,message:"Your request is already accepted"})
        }
        else if(request.status==="rejected"){
            sendmessage(id,"request:response:acceptor:useraccept:colab",{Success:false,message:"Your request was rejected"})
        }
        else{
            console.log("server user request accept triggered")
            const response=await Markcolabrequest("ptorm",sendBy,"","accepted",requestId)
            const responsee=await Createroommember(crypto.randomUUID(),sendBy,roomId,"viewer")
            if(response!=="Error"&&responsee!=="Error"){
                console.log(response)
                request.status="accepted"
                const room=colabroomlist.get(roomId)
                if(room){
                const roommembers=room.members
                console.log("function success",room)
                 let count=0
                const documents=colabroomdocuments.get(roomId)
                let name=""
                userlist.get(sendBy)?.forEach((value)=>{
                    name=value.name
                })
                documents?.forEach((value)=>{
                    count++
                })
                roommembers.forEach((value)=>{
                    sendmessage(value.userId,"request:response:useraccept:colab",{member:{userId:sendBy,isMuted:false,joinedAt:new Date(),role:"viewer",name:name},Success:true,admin:value.role==="admin",roomId:roomId,requestId:requestId})
                })
                room.members=[...room.members,{userId:sendBy,role:"viewer",joinedAt:new Date(),isMuted:false,lastseenmessageId:"",online:false,typing:false,name:name}]
                sendmessage(sendBy,"request:response:acceptor:useraccept:colab",{room:{...room,documents:count},Success:true,message:"You accepted the request",requestId:requestId})
                }
                else{
                    sendmessage(id,"request:response:acceptor:useraccept:colab",{Success:false,message:"Room doesnt exists"})
                }
            }
            else{
                sendmessage(id,"request:response:acceptor:useraccept:colab",{Success:false,message:"Some error occurred"})
            }
        }
    }
    async function handlegetuserrooms(id:string){
        const rooms=await Getuserrooms(id)
        rooms.forEach((room)=>{
            if(!colabroomlist.has(room.id)){
                colabroomlist.set(room.id,room)
                colabroomdocuments.set(room.id,new Map())
                colabroommessages.set(room.id,new Map())
            }
        })
        sendmessage(id,"request:response:userrooms:colab",{rooms:rooms,Success:true})
    }
    async function handleroom(roomId:string,id:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const docmnts:IDocument[]=[]
           const messages=await Getroomfirstmessages(roomId)
           const documents=await Getroomdocuments(roomId)
           documents?.forEach(data=>{
            if(data.ownerId===id||data.visibility==="room"){docmnts.push(data)}})
           sendmessage(id,"request:response:room:colab",{room:room,documents:docmnts?.length?docmnts:[],messages:messages,Success:true})
        }
        else{
            sendmessage(id,"request:response:room:colab",{Success:false})
        }
    }
    async function handledocumentadd(document:IDocument,roomId:string,id:string,name:string){
        const room=colabroomlist.get(roomId)
        if(room){
           const documentt=colabroomdocuments.get(roomId)
           if(documentt){
            documentt.set(document.id,document)
           }
           const activity:activity={
            id:crypto.randomUUID(),
            type:"document:created",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            documentId:document.id,
            documentName:document.title,
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           const response=await Createdocumenttext(document.id,document.type,roomId,document.title,document.content,id,document.visibility)
           const responsee=await Createactivity(activity)
           if(response!=="Error"&&responsee==="Success"){
            room.documents++
            room.members.forEach((value)=>{
                sendmessage(value.userId,"request:response:documentadd:colab",{document:document,Success:true,roomId:roomId,documents:room.documents})
            })
        }
        else{
            sendmessage(id,"request:response:documentadd:colab",{Success:false,message:"Some error occurred"})
           }
        }
        else{
            sendmessage(id,"request:response:documentadd:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handledocumentcontent(roomId:string,content:string|CanvasContent,documentId:string,id:string,type:doctype,name:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const response=await Makrdocumentcontent(documentId,content,id,roomId)
            console.log("server side document content response",response)
           if(response!=="Error"){
           const document=colabroomdocuments.get(roomId)
           const documnt=document?.get(documentId)
            const activity:activity={
            id:crypto.randomUUID(),
            type:"document:edit-started",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            documentId:documnt?.id||"",
            documentName:documnt?.title||"",
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           const responsee=await Createactivity(activity)
           if(document&&responsee==="Success"){
            if(documnt&&documnt.lockedBy===id){
                console.log("document content sync")
                documnt.content=content
                room.members.forEach((value)=>{
                    if(value.userId!==id)
                    sendmessage(value.userId,"request:response:documentcontent:colab",{document:documnt,roomId:roomId,Success:true})
                })
            }
            else{
                sendmessage(id,"request:response:documentcontent:colab",{Success:false,message:"Document is not locked by you"})
            }
        }
        else{
            sendmessage(id,"request:response:documentcontent:colab",{Success:false,message:"Document doesnt exist"})
        }
           }
           else{
            sendmessage(id,"request:response:documentcontent:colab",{Success:false,message:"Some error occurred"})
           }
        }
        else{
            sendmessage(id,"request:response:documentcontent:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handlesendmessage(roomId:string,id:string,message:string){
        const room=colabroomlist.get(roomId)
        console.log("details",roomId,id,message)
        if(room){
            console.log("room",room)
            if(room.members.find(data=>data.userId===id)){
                const response=await Createmessage(crypto.randomUUID(),roomId,id,message,"text","none")
                console.log("response for creating message",response)
                if(response.message!=="Error"){
                    if(!room.members.find(data=>data.userId===id)?.isMuted){
                    const messagee:colabmessage={id:response?.id,senderId:id,roomId:roomId,type:"text",status:"none",content:message,createdAt:new Date()}
                   const colabmessage=colabroommessages.get(roomId)
                   console.log("colabmessage",colabmessage)
                   if(colabmessage){
                    colabmessage.set(response?.id,messagee)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:messagesend:colab",{messagee:messagee,roomId:roomId,Success:true})
                    })
                   }
                   else{
                      sendmessage(id,"request:response:messagesend:colab",{Success:false,message:"Some error occurred"})
                   }
                }
                else{
                    sendmessage(id,"request:response:messagesend:colab",{Success:false,message:"You are muted"})
                }
                }
                else{
                     sendmessage(id,"request:response:messagesend:colab",{Success:false,message:"Some error occurred"})
                }
            }
            else{
               sendmessage(id,"request:response:messagesend:colab",{Success:false,message:"You are not a member of room"})
            }
        }
        else{
            sendmessage(id,"request:response:messagesend:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handlememberstatus(roomId:string,memberId:string,id:string,status:collabrole){
        const room=colabroomlist.get(roomId)
        if(room){
            const response=await Markcolabmemberstatus(roomId,status,memberId,id)
            if(response!=="Error"){
            if(room.createdBy===id&&room.members.find(data=>data.userId===id)?.role==="admin"){
                if(room.members.find(data=>data.userId===memberId)&&memberId!==id){
                    room.members=room.members.map(data=>data.userId===memberId?{...data,role:status}:data)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:memberstatus:colab",{status:status,memberId:memberId,roomId:roomId,Success:true,change:id})
                    })
                }
                else{
                    sendmessage(id,"request:response:memberstatus:colab",{Success:false,message:"Member doesnt exist"})
                }
            }
            else if(room.createdBy!==id&&room.members.find(data=>data.userId===id)?.role==="admin"){
                if(room.createdBy!==memberId){
                    if(room.members.find(data=>data.userId===memberId)?.role==="admin"){
                        sendmessage(id,"request:response:memberstatus:colab",{Success:false,message:"You cant change the other admins status"})
                    }
                    else{
                    room.members=room.members.map(data=>data.userId===memberId?{...data,role:status}:data)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:memberstatus:colab",{status:status,memberId:memberId,roomId:roomId,Success:true,change:id})
                    })
                }
                }
                else{
                    sendmessage(id,"request:response:memberstatus:colab",{Success:false,message:"You cant change the owner status"})
                }
            }
            else if(room.members.find(data=>data.userId===id)?.role==="viewer"){
                sendmessage(id,"request:response:memberstatus:colab",{Success:false,message:"You cannot change anyone role"})
            }
        }
        else{
            sendmessage(id,"request:response:memberstatus:colab",{Success:false,message:"Some error occurred"})
        }
    }
        else{
            sendmessage(id,"request:response:memberstatus:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handlelockrelease(roomId:string,documentId:string,id:string,name:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const document=colabroomdocuments.get(roomId)
            const response=await Setdocumentlockrelease(roomId,documentId,id)
            if(response!=="Error"){
            if(document){
                console.log("server side lock release function response",response)
                const documnt=document.get(documentId)
                 const activity:activity={
            id:crypto.randomUUID(),
            type:"document:unlocked",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            documentId:documnt?.id,
            documentName:documnt?.title,
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           await Createactivity(activity)
                if(documnt){
                    if(documnt.lockedBy===id){
                        documnt.lockedBy=""
                        room.members.forEach((value)=>{
                            sendmessage(value.userId,"request:response:lockrelease:colab",{Success:true,roomId:roomId,documentId:documentId,id:id})
                        })
                    }
                    else{
                        sendmessage(id,"request:response:lockrelease:colab",{Success:false,message:"This document is not locked by you"})
                    }
                }
                else{
                    sendmessage(id,"request:response:lockrelease:colab",{Success:false,message:"This document doesnt exist"})
                }
            }
            else{
                sendmessage(id,"request:response:lockrelease:colab",{Success:false,message:"This room doesnt exist"})
            }
        }
        else{
            sendmessage(id,"request:response:lockrelease:colab",{Success:false,message:"Some error occurred"})
        }
        }
    }
    async function handlelockedby(roomId:string,documentId:string,id:string,name:string){
        const room=colabroomlist.get(roomId)
        if(!room){
            sendmessage(id,"request:response:lockedby:colab",{Success:false,message:"Som error occurred"})
            return
        }
        const documentMap=colabroomdocuments.get(roomId)
        if(!documentMap){
            sendmessage(id,"request:response:lockedby:colab",{Success:false,message:"Document doesnt exist"})
            return
        }
        const documnt=documentMap.get(documentId)
        if(!documnt){
            sendmessage(id,"request:response:lockedby:colab",{Success:false,message:"Document not found"})
            return
        }
        const member=room.members.find(data=>data.userId===id)
        if(!member){
            sendmessage(id,"request:response:lockedby:colab",{Success:false,message:"You are not a member of this room"})
            return
        }

        // Decide permission FIRST using in-memory state (single source of truth),
        // so we never write to the database before we know the action is actually allowed.
        const currentLockHolder:string|null=documnt.lockedBy||null // schema default is null, not ""
        const holderRole=currentLockHolder?room.members.find(data=>data.userId===currentLockHolder)?.role:undefined

        let allow=false
        let denyMessage:string|undefined
        let revokeMessage:string|undefined

        if(member.role==="admin"){
            if(!currentLockHolder){
                allow=true
            }
            else if(room.createdBy===id){
                allow=true
                revokeMessage="Your lock is acquired by creator"
            }
            else if(currentLockHolder===room.createdBy){
                denyMessage="You cannot revoke the lock of creator of room"
            }
            else if(holderRole==="admin"){
                denyMessage="You cannot revoke the lock of other admin"
            }
            else{
                allow=true
                revokeMessage="Your lock is acquired by admin"
            }
        }
        else if(member.role==="editor"){
            if(!currentLockHolder){
                allow=true
            }
            else{
                denyMessage="Locked is currently acquired"
            }
        }
        else if(member.role==="viewer"){
            if(currentLockHolder){
                denyMessage="Lock is currently acquired"
            }
            else if(documnt.ownerId===id){
                allow=true
            }
            else{
                denyMessage="You do not have permission to lock this document"
            }
        }
        else{
            denyMessage="You are not a member of this room"
        }

        if(!allow){
            sendmessage(id,"request:response:lockedby:colab",{Success:false,message:denyMessage})
            return
        }

        // Only now do we touch the database, since we've already confirmed the request is allowed.
        const response=await Setdocumentlockedby(roomId,documentId,id)
        if(response==="Error"){
            sendmessage(id,"request:response:lockedby:colab",{Success:false,message:"Some error occurred"})
            return
        }

        if(currentLockHolder&&revokeMessage){
            sendmessage(currentLockHolder,"request:response:revoke:lockedby:colab",{documentId:documentId,roomId:roomId,message:revokeMessage})
        }

        documnt.lockedBy=id

        const activity:activity={
            id:crypto.randomUUID(),
            type:"document:edit-started",
            roomName:room.name||"",
            roomId:roomId,
            documentId:documnt.id,
            documentName:documnt.title,
            actorId:id,
            actorName:name,
            activityAt:new Date()
        }
        await Createactivity(activity)

        room.members.forEach((value)=>{
            sendmessage(value.userId,"request:response:lockedby:colab",{Success:true,roomId:roomId,documentId:documentId,id:id})
        })
    }
    async function handleviewmessage(roomId:string,messageId:string,id:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const messageid=await Getviewmessageid(messageId)
            const message=colabroommessage.get(roomId)
            if(message){
                const colabmessage=message.find(data=>data.id===messageId)
                if(colabmessage){
                    room.members=room.members.map(data=>data.userId===id?{...data,lastseenmessageId:messageid}:data)
                    sendmessage(id,"request:response:viewmessage:colab",{Success:true,roomId:roomId,messageId:messageid,id:id})
                }
                else{
                    sendmessage(id,"request:response:viewmessage:colab",{Success:false,message:"Message doesnt exist"})
                }
            }
            else{
                sendmessage(id,"request:response:viewmessage:colab",{Success:false,message:"Some error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:viewmessage:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handlemessagestatus(roomId:string,messageId:string,status:grpconversations,id:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const response=await Chnagemessagestatus(roomId,messageId,status,id)
            if(response!=="Error"){
                const message=colabroommessages.get(roomId)
                if(message){
                    const colabmessage=message.get(messageId)
                    if(colabmessage){
                        if(colabmessage.senderId===id){
                            colabmessage.status=status
                            room.members.forEach((value)=>{
                                sendmessage(value.userId,"request:response:messagestatus:colab",{Success:true,roomId:roomId,messageId:messageId,status:status,id:id})
                            })
                        }
                        else{
                            sendmessage(id,"request:response:messagestatus:colab",{Success:false,message:"You are not sender of this message"})
                        }
                    }
                    else{
                        sendmessage(id,"request:response:messagestatus:colab",{Success:false,message:"Message doenst exist"})
                    }
                }
                else{
                    sendmessage(id,"request:response:messagestatus:colab",{Success:false,message:"Message doesnt exist"})
                }
            }
            else{
                sendmessage(id,"request:response:messagestatus:colab",{Success:false,message:"Some error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:messagestatus:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handlemessageedit(roomId:string,messageId:string,content:string,id:string){
        const room=colabroomlist.get(roomId)
        if(room){
           const response=await Editroommessages(roomId,messageId,content,id)
           console.log("server side edit message function response",response)
           if(response!=="Error"){
            const message=colabroommessages.get(roomId)
            if(message){
                console.log("edit message message founded")
                const colabmessage=message.get(messageId)
                if(colabmessage){
                    console.log("edit message found",colabmessage)
                    if(colabmessage.senderId===id){
                        colabmessage.content=content
                        room.members.forEach((value)=>{
                            sendmessage(value.userId,"request:response:messageedit:colab",{Success:true,roomId:roomId,messageId:messageId,content:content,id:id})
                        })
                    }
                    else{
                        sendmessage(id,"request:response:messageedit:colab",{Success:false,message:"You are not sender of this message"})
                    }
                }
                else{
                    sendmessage(id,"request:response:messageedit:colab",{Success:false,message:"Message doesnt exist"})
                }
            }
            else{
                sendmessage(id,"request:response:messageedit:colab",{Success:false,message:"Message doesnt exist"})
            }
           }
           else{
            sendmessage(id,"request:response:messageedit:colab",{Success:false,message:"Some error occurred"})
           }
        }
        else{
            sendmessage(id,"request:response:messageedit:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handlemessagereply(roomId:string,messageId:string,content:string,maincontent:string,id:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const messagestruct:colabmessage={
                id:crypto.randomUUID(),
                senderId:id,
                content:maincontent,
                roomId:roomId,
                type:"text",
                status:"none",
                replyTo:{id:messageId,content:content},
                createdAt:new Date()
            }
            const response=await Createmessagereply(messagestruct)
            if(response!=="Error"){
                const message=colabroommessages.get(roomId)
                if(message){
                    message.set(response,messagestruct)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:messagereply:colab",{Success:true,messagee:messagestruct,id:id,roomId:roomId})
                    })
                }
                else{
                    sendmessage(id,"request:response:messagereply:colab",{Success:false,message:"Message doesnt exist"})
                }
            }
            else{
                sendmessage(id,"request:response:messagereply:colab",{Success:false,message:"An error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:messagereply:colab",{Success:false,message:"Room doesnt exist"})
        }
    }
    async function handleforcereleaselock(documentId:string,roomId:string,id:string,name:string){
       const room=colabroomlist.get(roomId)
       if(!room){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:"Room doesnt exist"})
        return
       }
       const documentMap=colabroomdocuments.get(roomId)
       if(!documentMap){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:"Document doesnt exist"})
        return
       }
       const documnt=documentMap.get(documentId)
       if(!documnt){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:"Document doesnt exist"})
        return
       }
       const member=room.members.find(data=>data.userId===id)
       if(!member){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:"You are not a member of this room"})
        return
       }

       const currentLockHolder:string|null=documnt.lockedBy||null // schema default is null, not ""
       if(!currentLockHolder){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:"Lock is already released"})
        return
       }

       const holderRole=room.members.find(data=>data.userId===currentLockHolder)?.role

       // Decide permission FIRST from in-memory state (single source of truth) so the DB
       // is only ever written to once we've already confirmed the action is allowed,
       // and so exactly one message set is sent (no double-fire from overlapping if-blocks).
       let allow=false
       let denyMessage:string|undefined
       let revokeMessage:string|undefined

       if(member.role==="admin"){
        if(room.createdBy===id){
            allow=true
            revokeMessage="Your lock is been revoked by creator"
        }
        else if(currentLockHolder===room.createdBy){
            denyMessage="You cannot revoke creator's lock"
        }
        else if(holderRole==="admin"){
            denyMessage="You cannot revoke other admin's lock"
        }
        else{
            allow=true
            revokeMessage="Your lock is been revoked by admin"
        }
       }
       else{
        denyMessage="Viewer or editor cant force release lock"
       }

       if(!allow){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:denyMessage})
        return
       }

       // Only now do we touch the database, since we've already confirmed the request is allowed.
       const response=await Editforcereleaselock(roomId,documentId,currentLockHolder,id)
       if(response==="Error"){
        sendmessage(id,"request:response:forcereleaselock:colab",{Success:false,message:"Some error occurred"})
        return
       }

       if(revokeMessage){
        sendmessage(currentLockHolder,"request:response:revoke:forcereleaselock:colab",{Success:true,documentId:documentId,roomId:roomId,message:revokeMessage})
       }

       documnt.lockedBy=""

       const activity:activity={
            id:crypto.randomUUID(),
            type:"document:unlocked",
            roomName:room.name||"",
            roomId:roomId,
            documentId:documnt.id,
            documentName:documnt.title,
            actorId:id,
            actorName:name,
            activityAt:new Date()
       }
       await Createactivity(activity)

       room.members.forEach((value)=>{
            sendmessage(value.userId,"request:response:forcereleaselock:colab",{Success:true,documentId:documentId,roomId:roomId,id:id})
       })
    }
    async function handleassignlock(documentId:string,roomId:string,memberId:string,id:string,name:string){
      const room=colabroomlist.get(roomId)
      if(!room){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"Room doesnt exist"})
        return
      }
      const documentMap=colabroomdocuments.get(roomId)
      if(!documentMap){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"Document doesnt exist"})
        return
      }
      const documnt=documentMap.get(documentId)
      if(!documnt){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"Document doesnt exist"})
        return
      }
      const member=room.members.find(data=>data.userId===id)
      if(!member){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"You are not a member of this room"})
        return
      }
      if(member.role!=="admin"){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"Only admins can assign locks"})
        return
      }
      const targetMember=room.members.find(data=>data.userId===memberId)
      if(!targetMember){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"Member doesnt exist"})
        return
      }

      const currentLockHolder:string|null=documnt.lockedBy||null // schema default is null, not ""
      const isCreator=room.createdBy===id

      // Decide permission FIRST from in-memory state, exactly once, so the DB is only ever
      // written to once the action is confirmed allowed, and exactly one broadcast fires.
      let allow=false
      let denyMessage:string|undefined
      let revokeMessage:string|undefined
      let promoteToEditor=false

      if(isCreator){
        if(currentLockHolder===id){
            denyMessage="You cannot force assign to urself"
        }
        else if(memberId===id){
            denyMessage="You cannot assign lock to urself, use the other way"
        }
        else if(targetMember.role==="admin"){
            denyMessage="You cannot assign lock to another admin"
        }
        else{
            allow=true
            if(currentLockHolder){
                revokeMessage="Your lock is revoked by admin"
            }
            if(targetMember.role==="viewer"){
                promoteToEditor=true
            }
        }
      }
      else{
        if(currentLockHolder===room.createdBy){
            denyMessage="You cannot revoke lock of creator"
        }
        else if(currentLockHolder&&room.members.find(data=>data.userId===currentLockHolder)?.role==="admin"){
            denyMessage="You cannot revoke lock of admin"
        }
        else if(targetMember.role!=="editor"){
            denyMessage="You cannot assign lock to other admins, creator, or viewer"
        }
        else{
            allow=true
            if(currentLockHolder){
                revokeMessage="Admin revoked ur lock"
            }
        }
      }

      if(!allow){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:denyMessage})
        return
      }

      // Only now do we touch the database, since we've already confirmed the request is allowed.
       if(promoteToEditor){
        handlememberstatus(roomId,memberId,id,"editor")
      }
      const response=await Editlockassign(memberId,roomId,documentId,id)
      if(response==="Error"){
        sendmessage(id,"request:response:assignlock:colab",{Success:false,message:"Some error occurred"})
        return
      }

      if(currentLockHolder&&revokeMessage){
        sendmessage(currentLockHolder,"request:response:revoke:assignlock:colab",{Success:true,roomId:roomId,documentId:documentId,message:revokeMessage})
      }

      

      // If memberId already held a lock on a different document in this room, that lock is
      // implicitly released. Clear it in-memory too (not just in the DB) so the server's live
      // state and every connected client stay in sync.
      let previousDocId=""
      documentMap.forEach((value)=>{
        if(value.lockedBy===memberId&&value.id!==documentId){
            previousDocId=value.id
        }
      })
      if(previousDocId){
        const previousDoc=documentMap.get(previousDocId)
        if(previousDoc){
            previousDoc.lockedBy=""
        }
        room.members.forEach((value)=>{
            sendmessage(value.userId,"request:response:assignlock:colab",{Success:true,roomId:roomId,documentId:previousDocId,id:id,memberId:""})
        })
      }

      documnt.lockedBy=memberId

      const activity:activity={
            id:crypto.randomUUID(),
            type:"document:edit-started",
            roomName:room.name||"",
            roomId:roomId,
            documentId:documnt.id,
            documentName:documnt.title,
            actorId:id,
            actorName:name,
            activityAt:new Date()
      }
      await Createactivity(activity)

      room.members.forEach((value)=>{
            sendmessage(value.userId,"request:response:assignlock:colab",{Success:true,roomId:roomId,documentId:documentId,id:id,memberId:memberId})
      })
    }
    async function handlemutemember(roomId:string,memberId:string,id:string,muted:boolean){
       const room=colabroomlist.get(roomId)
       if(room){
         const response=await Editmembermute(roomId,memberId,id,muted)
         if(response!=="Error"){
            if(room.createdBy===id){
                if(memberId!==id){
                    room.members=room.members.map(data=>data.userId===memberId?{...data,isMuted:muted}:data)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:membermute:colab",{Success:true,roomId:roomId,memberId:memberId,muted:muted,id:id})
                    })
                }
                else{
                    sendmessage(id,"request:response:membermute:colab",{Success:false,message:"You cannot mute urself"})
                }
            }
            else if(room.members.find(data=>data.userId===id)?.role==="admin"){
                if(id===memberId){
                    sendmessage(id,"request:response:membermute:colab",{Success:false,message:"You cannot mute urself"})
                }
                else if(memberId===room.createdBy){
                    sendmessage(id,"request:response:membermute:colab",{Success:false,message:"You cannot change state of creator"})
                }
                else if(room.members.find(data=>data.userId===memberId)?.role==="admin"){
                    sendmessage(id,"request:response:membermute:colab",{Success:false,message:"You cannot change other admin state"})
                }
                else if(room.members.find(data=>data.userId===memberId)?.role==="viewer"||room.members.find(data=>data.userId===memberId)?.role==="editor"){
                    room.members=room.members.map(data=>data.userId===memberId?{...data,isMuted:muted}:data)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:membermute:colab",{Success:true,roomId:roomId,memberId:memberId,muted:muted,id:id})
                    })
                }
                else{
                    sendmessage(id,"request:response:membermute:colab",{Success:false,message:"Member doesnt exist"})
                }
            }
            else{
                sendmessage(id,"request:response:membermute:colab",{Success:false,message:"You have no privilage to mute and unmute others"})
            }
         }
         else{
            sendmessage(id,"request:response:membermute:colab",{Success:false,message:"Some error occurred"})
         }
       }
       else{
        sendmessage(id,"request:response:membermute:colab",{Success:false,message:"An error occurred"})
       }
    }
    async function handleroomdetails(roomId:string,mode:number,value:string,id:string,name:string){
        const room=colabroomlist.get(roomId)
        if(room){
            const response=await Editroomdetails(roomId,mode,value,id)
             const activity:activity={
            id:crypto.randomUUID(),
            type:"document:edit-started",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           await Createactivity(activity)
            if(response!=="Error"){
               if(room.members.find(data=>data.userId===id)?.role==="admin"||room.createdBy===id){
                if(mode===1){
                    room.name=value
                    room.updatedAt=new Date()
                }
                else if(mode===2){
                    room.description=value
                    room.updatedAt=new Date()
                }
                room.members.forEach((valuee)=>{
                    sendmessage(valuee.userId,"request:response:roomdetails:colab",{Success:true,roomId:roomId,mode:mode,value:value,id:id})
                })
            }
            else{
                sendmessage(id,"request:response:roomdetails:colab",{Success:false,message:"You are not authorized to change details of room"})
            }
        }
        else{
            sendmessage(id,"request:response:roomdetails:colab",{Success:false,message:"Some error occurred"})
        }
        }
        else{
            sendmessage(id,"request:response:roomdetails:colab",{Success:false,message:"Some errro occurred"})
        }
    }
    async function handlekickmember(roomId:string,memberId:string,id:string,name:string){
        const room=colabroomlist.get(roomId)
        const response=await Editkickmember(roomId,memberId,id)
        if(room&&response!=="Error"){
             const activity:activity={
            id:crypto.randomUUID(),
            type:"member:left",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           await Createactivity(activity)
           if(room.createdBy===id){
                if(memberId===id){
                    sendmessage(id,"request:response:kickmember:colab",{Success:false,message:"You cannot kick urself"})
                }
                else{
                    colabrequest.delete(getkey(memberId,roomId))
                    room.members=room.members.filter(data=>data.userId!==memberId)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:kickmember:colab",{Success:true,roomId:roomId,memberId:memberId,id:id})
                    })
                    sendmessage(memberId,"request:response:member:kickmember:colab",{roomId:roomId,message:"You have been kicked from room"})
                }
            }
            else if(room.members.find(data=>data.userId===id)?.role==="admin"){
                if(room.createdBy===memberId){
                    sendmessage(id,"request:response:kickmember:colab",{Success:false,message:"You cannot kick creator"})
                }
                else if(room.members.find(data=>data.userId===memberId)?.role==="admin"){
                    sendmessage(id,"request:response:kickmember:colab",{Success:false,message:"You cannot kick admin"})
                }
                else{
                    colabrequest.delete(getkey(memberId,roomId))
                    room.members=room.members.filter(data=>data.userId!==memberId)
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:kickmember:colab",{Success:true,roomId:roomId,memberId:memberId,id:id})
                    })
                    sendmessage(memberId,"request:response:member:kickmember:colab",{roomId:roomId,message:"You have been kicked from room"})
                }
            }
            else{
                sendmessage(id,"request:response:kickmember:colab",{Success:false,message:"You cannot kick anyone"})
            }
        }
        else{
            sendmessage(id,"request:response:kickmember:colab",{Success:false,message:"An error occurred"})
        }
    }
    async function handlechangecode(roomId:string,id:string,name:string){
       const room=colabroomlist.get(roomId)
       const code=generateCode()
       const response=await Editchangecode(roomId,code,id)
       if(room&&response!=="Error"){
         const activity:activity={
            id:crypto.randomUUID(),
            type:"room:renamed",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           await Createactivity(activity)
        if(room.members.find(data=>data.userId===id)?.role==="admin"||room.createdBy===id){
            room.code=code
            room.updatedAt=new Date()
            room.members.forEach((value)=>{
                sendmessage(value.userId,"request:response:changecode:colab",{Success:true,roomId:roomId,code:room.code,id:id})
            })
        }
        else{
            sendmessage(id,"request:response:changecode:colab",{Success:false,message:"You cannot change code"})
        }
       }
       else{
        sendmessage(id,"request:response:changecode:colab",{Success:false,message:"Some error occurred"})
       }
    }
    async function handledocumentvisibilitychange(roomId:string,documentId:string,visibility:roomtype,id:string){
       const room=colabroomlist.get(roomId)
       const response=await Editdocumentvisibilitychange(roomId,documentId,visibility,id)
       if(room&&response!=="Error"){
        const document=colabroomdocuments.get(roomId)
        if(document){
            const documnt=document.get(documentId)
            if(documnt){ 
                let count=0
                if(documnt.ownerId===id){
                   documnt.visibility=visibility
                    document.forEach((value)=>{
                        if(value.visibility==="room"){
                            count++
                        }
                    })
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:documentvisibility:colab",{Success:true,roomId:roomId,documentId:documentId,visibility:visibility,id:id,documents:count})
                    })
                }
                else{
                    sendmessage(id,"request:response:documentvisibility:colab",{Success:false,message:"You are not owner of this document"})
                }
            }
            else{
                sendmessage(id,"request:response:documentvisibility:colab",{Success:false,message:"Document doesnt exist"})
            }
        }
        else{
            sendmessage(id,"request:response:documentvisibility:colab",{Success:false,message:"Document doesnt exist"})
        }
       }
       else{
        sendmessage(id,"request:response:documentvisibility:colab",{Success:false,message:"Room doesnt exist"})
       }
    }
    async function handledocumenttitle(roomId:string,documentId:string,title:string,id:string,name:string){
       const room=colabroomlist.get(roomId)
       const response=await Editdocumenttitle(roomId,title,documentId,id)
       if(room&&response!=="Error"){
        const document=colabroomdocuments.get(roomId)
        if(document){
             const activity:activity={
            id:crypto.randomUUID(),
            type:"document:edited",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            documentId:documentId,
            documentName:title,
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
            const documnt=document.get(documentId)
            if(documnt){
                if(documnt.ownerId===id){
                    documnt.title=title
                    room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:documenttitle:colab",{Success:true,roomId:roomId,title:title,documentId:documentId,id:id})
                    })
                }
                else{
                    sendmessage(id,"request:response:documenttitle:colab",{Success:false,message:"You are not the owner of this document"})
                }
            }
            else{
                sendmessage(id,"request:response:documenttitle:colab",{Success:false,message:"Document doesnt exist"})
            }
        }
        else{
            sendmessage(id,"request:response:documenttitle:colab",{Success:false,message:"Document doesnt exist"})
        }
       }
       else{
        sendmessage(id,"request:response:documenttitle:colab",{Success:false,message:"Room doesnt exist"})
       }
    }
    function handleonlinemember(id:string,name:string){
        for (const [key,room] of colabroomlist){
            if(room.members.find(data=>data.userId===id)){
                room.members=room.members.map(data=>data.userId===id?{...data,online:true}:data)
                room.members.forEach((value)=>{
                    if(value.userId!==id)
                    sendmessage(value.userId,"request:response:online:colab",{Success:true,online:true,roomId:key,id:id,name:name,roomname:room.name})
                })
            }
        }
    }
    function handletypingmember(id:string,name:string,status:boolean){
        for (const [key,room] of colabroomlist){
            if(room.members.find(data=>data.userId===id)){
                room.members=room.members.map(data=>data.userId===id?{...data,typing:status}:data)
                room.members.forEach((value)=>{
                    if(value.userId!==id)
                        sendmessage(value.userId,"request:response:typing:colab",{typing:status,roomId:key,id:id})
                })
            }
        }
    }interface objectt{
        file:File,
        roomId:string
       }
    async function handledocumentupload(roomId:string,formdata:objectt,filename:string,filetype:string,filedata:string,id:string){
       const room=colabroomlist.get(roomId)
       
       if(room){
        console.log("server side document upload",roomId,formdata)
        const response=await Fileconverter(formdata,filename,filetype,filedata)
        console.log("repsonse",response)
        if(response!=="Error"){
            if(response?.Success){
                sendmessage(id,"request:response:documentupload:colab",{Success:true,text:response?.text,roomId:roomId})
            }
            else{
                sendmessage(id,"request:response:documentupload:colab",{Success:false,message:"Some error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:documentupload:colab",{Success:false,message:"Some error occurred"})
        }
       }
       else{
        sendmessage(id,"request:response:documentupload:colab",{Success:false,message:"Room doesnt exist"})
       }
    }
    async function handledocumentdelete(roomId:string,documentId:string,id:string,name:string){
      const room=colabroomlist.get(roomId)
      if(!room){
        sendmessage(id,"request:response:documentdelete:colab",{Success:false,message:"Room doesnt exist"})
        return
      }
      const documentMap=colabroomdocuments.get(roomId)
      if(!documentMap){
        sendmessage(id,"request:response:documentdelete:colab",{Success:false,message:"Document doesnt exist"})
        return
      }
      const documnt=documentMap.get(documentId)
      if(!documnt){
        sendmessage(id,"request:response:documentdelete:colab",{Success:false,message:"Document doesnt exist"})
        return
      }
      const member=room.members.find(data=>data.userId===id)
      if(!member){
        sendmessage(id,"request:response:documentdelete:colab",{Success:false,message:"You are not a member of this room"})
        return
      }
      // decide permission first, purely from in-memory state, before ever touching the DB
      const allowed=member.role==="admin"||room.createdBy===id
      if(!allowed){
        sendmessage(id,"request:response:documentdelete:colab",{Success:false,message:"You do not have permission to delete this document"})
        return
      }

      const response=await Adminflipstatusdocument(documentId,roomId,id)
      if(response==="Error"){
        sendmessage(id,"request:response:documentdelete:colab",{Success:false,message:"Some error occurred"})
        return
      }

      const document=documentMap.get(documentId)
      if(document){
        document.visibility="private"
      }
      room.documents=Math.max(0,room.documents-1)

      const activity:activity={
        id:crypto.randomUUID(),
        type:"document:deleted",
        roomName:room.name||"",
        roomId:roomId,
        documentId:documentId,
        documentName:documnt.title,
        actorId:id,
        actorName:name,
        activityAt:new Date()
      }
      await Createactivity(activity)

      room.members.forEach((value)=>{
        sendmessage(value.userId,"request:response:documentdelete:colab",{Success:true,roomId:roomId,documentId:documentId,documents:room.documents,id:id})
      })
    }
    async function handleclonedocument(roomId:string,documentId:string,id:string,name:string){
      const room=colabroomlist.get(roomId)
      if(room){
        if(room.members.find(data=>data.userId===id)){
            const response=await Createdocumentclone(roomId,documentId,id,crypto.randomUUID())
            if(response.Success){
                const document=colabroomdocuments.get(roomId)
               
                if(document){
                    const documnt=document.get(documentId)
            const activity:activity={
            id:crypto.randomUUID(),
            type:"document:cloned",
            roomName:colabroomlist.get(roomId)?.name||"",
            roomId:roomId,
            documentId:documentId,
            documentName:documnt?.title||"",
            actorId:id,
            actorName:name,
            activityAt:new Date()
           }
           await Createactivity(activity)
                    if(documnt)
                    document.set(response.id,{...documnt,visibility:"private",id:response.id,clonedFrom:documnt.id,ownerId:id,createdAt:new Date()})
                room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:documentclone:colab",{Success:true,document:document.get(response.id),roomId:roomId,id:id})
                })
            }
            else{
                sendmessage(id,"request:response:documentclone:colab",{Success:false,message:"Document doesnt exist"})
            }
            }
            else{
                sendmessage(id,"request:response:documentclone:colab",{Success:false,message:"Some error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:documentclone:colab",{Success:false,message:"You are not a member of this room"})
        }
      }
      else{
        sendmessage(id,"request:response:documentclone:colab",{Success:false,message:"Room doesnt exist"})
      }
    }
    async function handleroomleave(roomId:string,id:string,name:string){
      const room=colabroomlist.get(roomId)
      if(room){
        const activity:activity={
            id:crypto.randomUUID(),
            type:"member:left",
            roomName:room.name||"",
            roomId:roomId,
            actorId:id,
            actorName:name,
            activityAt:new Date()
        }
        await Createactivity(activity)
        if(id===room.createdBy){
            if(room.members.length===1){
               colabroomlist.delete(roomId)
               colabroomdocuments.delete(roomId)
               colabroommessages.delete(roomId)
               await Editroomleave(roomId,id,true)
               sendmessage(id,"request:response:leave:roomleave:colab",{roomId:roomId,message:"Room deleted successfully"})
            }
            else if(room.members.length>1&&room.members.find(data=>data.userId!==id&&data.role==="admin")){
                 const newCreator=room.members.find(data=>data.userId!==id&&data.role==="admin")
                 room.members=room.members.filter(data=>data.userId!==id)
                 room.createdBy=newCreator?.userId||room.createdBy
                 await Editroomleave(roomId,id,false,undefined,newCreator?.userId)
                 room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{Success:true,roomId:roomId,memberId:id})
                 })
                 sendmessage(id,"request:response:leave:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
            else if(room.members.length>1&&!room.members.find(data=>data.role==="admin")){
                room.members=room.members.filter(data=>data.userId!==id)
                const newAdminId=room.members[room.members.length-1]?.userId||""
                room.createdBy=newAdminId||room.createdBy
                await handlememberstatus(roomId,newAdminId,id,"admin")
                await Editroomleave(roomId,id,false,newAdminId,newAdminId)
                room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{roomId:roomId,memberId:id,Success:true})
                })
                sendmessage(id,"request:response:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
            else{
                room.members=room.members.filter(data=>data.userId!==id)
                await Editroomleave(roomId,id,false)
                room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{Success:true,roomId:roomId,memberId:id})
                })
                sendmessage(id,"request:response:leave:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
        }
        else if(room.members.find(data=>data.userId===id)?.role==="admin"){
            if(room.members.length===1){
                colabroomlist.delete(roomId)
                colabroomdocuments.delete(roomId)
                colabroommessages.delete(roomId)
                await Editroomleave(roomId,id,true)
                sendmessage(id,"request:response:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
            else if(room.members.length>1&&!room.members.find(data=>data.userId!==id&&data.role==="admin")){
                room.members=room.members.filter(data=>data.userId!==id)
                const newAdminId=room.members[room.members.length-1]?.userId||""
                await handlememberstatus(roomId,newAdminId,id,"admin")
                await Editroomleave(roomId,id,false,newAdminId)
                room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{roomId:roomId,memberId:id,Success:true})
                })
                sendmessage(id,"request:response:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
            else if(room.members.length>1&&room.members.find(data=>data.userId!==id&&data.role==="admin")){
                room.members=room.members.filter(data=>data.userId!==id)
                await Editroomleave(roomId,id,false)
                 room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{Success:true,roomId:roomId,memberId:id})
                 })
                 sendmessage(id,"request:response:leave:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
            else{
                 room.members=room.members.filter(data=>data.userId!==id)
                await Editroomleave(roomId,id,false)
                room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{Success:true,roomId:roomId,memberId:id})
                })
                sendmessage(id,"request:response:leave:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
            }
        }
        else{
            room.members=room.members.filter(data=>data.userId!==id)
            await Editroomleave(roomId,id,false)
                room.members.forEach((value)=>{
                    sendmessage(value.userId,"request:response:roomleave:colab",{Success:true,roomId:roomId,memberId:id})
                })
                sendmessage(id,"request:response:leave:roomleave:colab",{roomId:roomId,message:"Room leaved successfully"})
        }
      }
      else{
        sendmessage(id,"request:response:roomleave:colab",{Success:false,message:"Room doesnt exist"})
      }
    }
    async function handlealldocuments(id:string){
      let count=0
      let roomId:string[]=[]
      colabroomlist.forEach((value)=>{
        if(value.members.find(data=>data.userId===id)){
            roomId.push(value.id)
        }
      })
      colabroomdocuments.forEach((value,key)=>{
        if(roomId.includes(key)){
            value.forEach((valuee)=>{
                count++
            })
        }
      })
      sendmessage(id,"request:response:alldocuments:colab",{documents:count})
    }
    async function handleactivity(id:string){
       const activity=await Getactivity(id)
       sendmessage(id,"request:response:activity:colab",{activity:activity})
    }
    async function handlejoincoderoom(code:string,name:string,id:string){
        console.log("server room request function triggered")
        let roomId=""
        colabroomlist.forEach((value)=>{
            if(value.code===code){
                roomId=value.id
            }
        })
        if(!roomId){
            sendmessage(id,"request:response:roomrequest:colab",{Success:false,message:"Invalid room code"})
            return
        }
        const codee=crypto.randomUUID()
        const response=await Createrequestcollab("ptorm",roomId,id,"",codee)
        const request=colabrequest.get(getkey(id,roomId))
        if(request?.status==="rejected"||!request){
        if(response?.message!=="Error"){
            const requst:Colabrequest={id:response?.id||"",type:"ptorm",roomId:roomId,status:"pending",sendAt:new Date(),sendBy:id}
            console.log(request)
            colabrequest.set(getkey(id,roomId),requst)
            const room=colabroomlist.get(roomId)
            if(room){
                const roommember=room.members.filter(data=>data.role==="admin")
                roommember.forEach((value)=>{
                    sendmessage(value.userId,"request:response:reciever:roomrequest:colab",{Success:true,request:requst,message:"You recieved a new request"})
                })
                sendmessage(id,"request:response:roomrequest:colab",{Success:true,request:requst,message:"Request got send"})
            }
        }
        else{
            sendmessage(id,"request:response:roomrequest:colab",{Success:false,message:"Some error occurred"})
        }
    }
    else{
        sendmessage(id,"request:response:roomrequest:colab",{Success:false,message:"You already have send the request"})
    }
    }
    function handleofflinemember(id:string,name:string){
        for (const [key,room] of colabroomlist){
            if(room.members.find(data=>data.userId===id)){
                room.members=room.members.map(data=>data.userId===id?{...data,online:false}:data)
                room.members.forEach((value)=>{
                    if(value.userId!==id)
                    sendmessage(value.userId,"request:response:online:colab",{Success:true,online:false,roomId:key,id:id,name:name,roomname:room.name})
                })
            }
        }
    }
    async function handletrasheddocument(documentId:string,roomId:string,id:string){
        console.log(documentId,roomId,id,"document trashed function")
      const room=colabroomlist.get(roomId)
      if(room){
        const document=colabroomdocuments.get(roomId)
        if(document){
            const documnt=document.get(documentId)
            const response=await Documenttrashed(documentId,roomId,id)
            console.log("document trashed response",response)
            if(documnt&&response!=="Error"){
                if(documnt.ownerId===id){
                    if(documnt.status!=="trashed"){
                      documnt.status="trashed"
                      room.members.forEach((value)=>{sendmessage(value.userId,"request:response:documenttrashed:colab",{Success:true,message:"Document trashed successfully",documentId:documentId,roomId:roomId,id:id})})
                      }
                    else{
                      sendmessage(id,"request:response:documenttrashed:colab",{Success:false,message:"Document is already trashed",documentId:documentId,roomId:roomId,})
                    }
                }
                else if(documnt.ownerId!==id){
                    sendmessage(id,"request:response:documenttrashed:colab",{Success:false,message:"You are not the owner of this document",documentId:documentId,roomId:roomId,})
                }
            }
            else{
                sendmessage(id,"request:response:documenttrashed:colab",{Success:false,message:"Some error occurred",documentId:documentId,roomId:roomId,})
            }
        }
      }
    }
    async function handledocumentrestore(documentId:string,roomId:string,id:string){
      const room=colabroomlist.get(roomId)
      if(room){
        const document=colabroomdocuments.get(roomId)
        if(document){
            const documnt=document.get(documentId)
            const response=await Documentrestore(documentId,roomId,id)
            console.log("document restore response",response)
            if(documnt&&response!=="Error"){
                if(documnt.ownerId===id){
                    if(documnt.status==="trashed"){
                        documnt.status="none"
                        room.members.forEach((value)=>{
                            sendmessage(value.userId,"request:response:documentrestore:colab",{Success:true,documentId:documentId,roomId:roomId,id:id})
                        })
                    }
                    else{
                        sendmessage(id,"request:resposne:documentrestore:colab",{Success:false,message:"Document is not trashed"})
                    }
                }
                else{
                    sendmessage(id,"request:response:documentrestore:colab",{Success:false,message:"You are not the owner of this document"})
                }
            }
            else{
                sendmessage(id,"request:response:documentrestore:colab",{Success:false,message:"Some error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:documentrestore:colab",{Success:false,message:"Room doesnt exist"})
        }
      }
    }
    async function handledocumentpermdel(documentId:string,roomId:string,id:string){
      const room=colabroomlist.get(roomId)
      if(room){
        const document=colabroomdocuments.get(roomId)
        if(document){
            const documnt=document.get(documentId)
            const response=await Documentpermdel(documentId,roomId,id)
            console.log("document permdel response",response)
            if(documnt&&response!=="Error"){
                if(documnt.ownerId===id){
                    if(documnt.status==="trashed"||documnt.status==="none"){
                       documnt.status="deleted"
                       room.members.forEach((value)=>{
                        sendmessage(value.userId,"request:response:documentpermdel:colab",{Success:true,documentId:documentId,roomId:roomId,id:id})
                       })
                    }
                    else{
                        sendmessage(id,"request:response:documentpermdel:colab",{Success:false,message:"Document is already deleted"})
                    }
                }
                else{
                        sendmessage(id,"request:response:documentpermdel:colab",{Success:false,message:"You are not the owner of this document"})
                }
            }
            else{
                sendmessage(id,"request:response:documentpermdel:colab",{Success:false,message:"Some error occurred"})
            }
        }
        else{
            sendmessage(id,"request:response:documentpermdel:colab",{Success:false,message:"Document doesnt exist"})
        }
      }
      else{
        sendmessage(id,"request:response:documentpermdel:colab",{Success:false,message:"Room doesnt exist"})
      }
    }
    wss.on("connection",(socket:MySocket,req)=>{
    const url=new URL(req.url!,"http://localhost:8080")
    const token=url.searchParams.get("token")
   socket.on("message",(data)=>{
    if(!serverReady){
        pendingMessages.push({socket,data})
        return
    }
        const {event,payload}=JSON.parse(data.toString())
        if(event==="login:request"){
            const {token,email}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify){
                handleregister(verify.name,email,verify._id,socket)
                userlist.get(verify._id)?.forEach((value)=>{
                    if(value.socket.readyState===WebSocket.OPEN){
                       value.socket.send(JSON.stringify({event:"login:request:response",payload:{verify:true,name:verify.name,email:email}}))
                    }
                })
                
            }
        }
        if(event==="register:request"){
            const {token,name,email,_id}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify){
                console.log(verify)
                handleregister(name,email,_id,socket)
                socket._id=_id
                socket.name=name
                socket.email=email
                socket.description=""
                userlist.get(_id)?.forEach((value)=>{
                    if(value.socket.readyState===WebSocket.OPEN){
                        value.socket.send(JSON.stringify({event:"register:request:response",payload:{verify:true,name:verify.name,email:email}}))
                    }
                })
            }
        }
        if(event==="search:request"){
            const {token,search}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log(search,verify._id,verify.name)
                handlesearchrequest(search,verify.name,verify?._id)
            }
        }
     
        if(event==="message:typing:onetooneconversation"){
            const {senderId,recieverId,token,typing}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("typing request",verify)
                handletypingonetooneconversation(senderId,recieverId,verify._id,typing)
            }
        }
        if(event==="message:loadmore:onetooneconversations"){
            const {senderId,recieverId,token,cursor_id}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify._id&&verify.name){
                console.log("load more request came")
                handleloadmoreonetooneconversations(senderId,recieverId,verify._id,cursor_id)
            }
        }
        if(event==="request:conversation:leave"){
            const {token,senderId,recieverId}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleleaveonetooneconversation(verify._id,senderId,recieverId)
            }
        }
        if(event==="message:deleteforme:onetooneconversation"){
            const {senderId,recieverId,status,messageid,userid,token}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify._id&&verify.name&&userid===verify._id){
                handledeleteformeonetooneconversation(senderId,recieverId,status,messageid,verify._id)
            }
        }
        if(event==="request:namechange:onetooneconversation"){
            const {token,name}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlechangenameonetooneconversation(verify._id,name)
            }
        }
        if(event==="request:descriptionchange:onetooneconversation"){
            const {token,description}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify._id&&verify.name){
                handlechangedescriptiononetooneconversation(description,verify._id)
            }
        }
        if(event==="request:online:onetooneconversation"){
            const {token,id}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify._id&&verify.name&&id){
                handleloginonetooneconversation(verify._id,id)
            }
        }
        if(event==="request:userexist"){
            const {token}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify._id&&verify.name){
                handleexistusers(verify._id)
            }
        }
        if(event==="request:userrooms:colab"){
            const {token}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify._id&&verify.name){
                handlegetuserrooms(verify._id)
            }
        }
        
        if(event==="request:groups:search"){
            const {token,search}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlesearchgrouprequest(search,verify._id)
            }
        }
        if(event==="request:statuschange:group"){
            const {groupId,status,token}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlegroupstatuschange(groupId,status,verify._id)
            }
        }
        
        
        
        
        if(event==="request:changememberstatus:group"){
            const {groupId,promoteId,token,status}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlechangememberstatus(groupId,promoteId,status,verify._id)
            }
        }
        
        if(event==="request:grouptyping:group"){
            const {groupId,token,status}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlegrouptyping(groupId,verify._id,verify.name,status)
            }
        }
        
        
       
        
        if(event==="request:createroom:colab"){
            const {name,description,unique_Id,token}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("create room",name,description,unique_Id,token)
                handlecreateroom(name,description,verify._id,unique_Id,verify.name)
            }
        }
        if(event==="request:rooms:search"){
            const {search,token}=payload
            const verify=jsonwebtoken.verify(token,JWT_SECRET) as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("room search",verify)
                handlesearchrooms(search,verify._id)
            }
        }
        if(event==="request:users:search"){
            const {search,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("user search",verify)
                handlesearchusers(search,verify._id)
            }
        }
        if(event==="request:roomrequest:colab"){
            const {roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("roomrequest",roomId,verify)
                handleroomrequest(roomId,verify._id)
            }
        }
        if(event==="request:userrequest:colab"){
            const {roomId,userId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("userrequest",roomId,verify)
                handleuserrequest(roomId,userId,verify._id)
            }
        }
        if(event==="request:roomaccept:colab"){
            const {sendBy,roomId,token,requestId}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleroomrequestaccept(sendBy,roomId,verify._id,requestId,verify.name)
            }
        }
        if(event==="request:useraccept:colab"){
            const {roomId,token,requestId,sendBy}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleuseracceptrequest(roomId,verify._id,requestId,sendBy)
            }
        }
        if(event==="request:room:colab"){
            const {roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleroom(roomId,verify._id)
            }
        }
        if(event==="request:documentadd:colab"){
            const {document,token,roomId}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handledocumentadd(document,roomId,verify._id,verify.name)
            }
        }
        if(event==="request:documentcontent:colab"){
            const {roomId,content,documentId,token,type}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("server side document content event")
                handledocumentcontent(roomId,content,documentId,verify._id,type,verify.name)
            }
        }
        if(event==="request:sendmessage:colab"){
            const {roomId,token,message}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlesendmessage(roomId,verify._id,message)
            }
        }
        if(event==="request:memberstatus:colab"){
            const {roomId,memberId,status,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
               handlememberstatus(roomId,memberId,verify._id,status)
            }
        }
        if(event==="request:lockrelease:colab"){
            const {roomId,documentId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("server side lock release event")
                handlelockrelease(roomId,documentId,verify._id,verify.name)
            }
        }
        if(event==="request:lockedby:colab"){
            const {roomId,documentId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlelockedby(roomId,documentId,verify._id,verify.name)
            }
        }
        if(event==="request:viewmessage:colab"){
            const {roomId,messageId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleviewmessage(roomId,messageId,verify._id)
            }
        }
        if(event==="request:messagestatus:colab"){
            const {roomId,messageId,status,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlemessagestatus(roomId,messageId,status,verify._id)
            }
        }
        if(event==="request:messageedit:colab"){
            const {roomId,documentId,content,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("server side message edit event",roomId,documentId,content)
                handlemessageedit(roomId,documentId,content,verify._id)
            }
        }
        if(event==="request:messagereply:colab"){
            const {roomId,messageId,content,maincontent,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlemessagereply(roomId,messageId,content,maincontent,verify._id)
            }
        }
        if(event==="request:messagepagi:colab"){
            const {messageId,roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlegrouppagination(roomId,messageId,verify._id)
            }
        }
        if(event==="request:forcereleaselock:colab"){
            const {documentId,roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleforcereleaselock(documentId,roomId,verify._id,verify.name)
            }
        }
        if(event==="request:assignlock:colab"){
            const {documentId,roomId,memberId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleassignlock(documentId,roomId,memberId,verify._id,verify.name)
            }
        }
        if(event==="request:membermute:colab"){
            const {roomId,memberId,token,muted}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlemutemember(roomId,memberId,verify._id,muted)
            }
        }
        if(event==="request:roomdetails:colab"){
            const {roomId,mode,value,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleroomdetails(roomId,mode,value,verify._id,verify.name)
            }
        }
        if(event==="request:kickmember:colab"){
            const {roomId,memberId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlekickmember(roomId,memberId,verify._id,verify.name)
            }
        }
        if(event==="request:changecode:colab"){
            const {roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlechangecode(roomId,verify._id,verify.name)
            }
        }
        if(event==="request:documentvisibility:colab"){
            const {roomId,documentId,visibility,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handledocumentvisibilitychange(roomId,documentId,visibility,verify._id)
            }
        }
        if(event==="request:documenttitle:colab"){
            const {roomId,documentId,title,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handledocumenttitle(roomId,documentId,title,verify._id,verify.name)
            }
        }
        if(event==="request:online:colab"){
            const {token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleonlinemember(verify._id,verify.name)
            }
        }
        if(event==="request:typing:colab"){
            const {token,status}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handletypingmember(verify._id,verify.name,status)
            }
        }
        if(event==="request:documentupload:colab"){
            const {roomId,formdata,filename,filetype,filedata,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                console.log("server side",roomId,formdata)
                console.log(filename,filetype,filedata,"server side params")
                handledocumentupload(roomId,formdata,filename,filetype,filedata,verify._id)
            }
        }
        if(event==="request:documentclone:colab"){
            const {roomId,documentId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleclonedocument(roomId,documentId,verify._id,verify.name)
            }
        }
        if(event==="request:documentdelete:colab"){
            const {roomId,documentId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handledocumentdelete(roomId,documentId,verify._id,verify.name)
            }
        }
        if(event==="request:roomleave:colab"){
            const {roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleroomleave(roomId,verify._id,verify.name)
            }
        }
        if(event==="request:alldocuments:colab"){
            const {token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handlealldocuments(verify._id)
            }
        }
        if(event==="request:activity:colab"){
            const {token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handleactivity(verify._id)
            }
        }
        if(event==="request:joincode:colab"){
            const {code,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
           if(verify.name&&verify._id){
            handlejoincoderoom(code,verify.name,verify._id)
           } 
        }
        if(event==="request:documenttrashed:colab"){
            const {documentId,roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handletrasheddocument(documentId,roomId,verify._id)
            }
        }
        if(event==="request:documentrestore:colab"){
            const {documentId,roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handledocumentrestore(documentId,roomId,verify._id)
            }
        }
        if(event==="request:documentpermdel:colab"){
            const {documentId,roomId,token}=payload
            const verify=jsonwebtoken.verify(token,"JWT_SECRET") as {name:string,_id:string}
            if(verify.name&&verify._id){
                handledocumentpermdel(documentId,roomId,verify._id)
            }
        }
        /*id: string
          roomId: string
          title: string
          ownerId: string
          visibility: "room" | "private"
          lockedAt: Date | null
          lockedBy: string | null
          clonedFrom: string | null
          createdAt: Date
          updatedAt: Date
        }
        
        export interface TextDocument extends BaseDocument {
          type: "text"
          content: string
        }
        
        export interface CanvasDocument extends BaseDocument {
          type: "canvas"
          content: CanvasContent*/
    })
    socket.on("close",(data)=>{
       handlelogoutonetooneconversation(socket._id)
       groupconversations.forEach((value,key)=>{
        const groupId=key
        const id=socket._id
        const name=socket.name
        handleofflinemember(id,name)
        sendmessage(id,"request:response:lastseen:colab",{date:new Date()})
       })
    })
}) 