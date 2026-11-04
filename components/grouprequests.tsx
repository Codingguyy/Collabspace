"use client"
import { Dialog } from "./ui/dialog"
import { DialogTrigger } from "./ui/dialog"
import { DialogHeader } from "./ui/dialog"
import { DialogTitle } from "./ui/dialog"
import { DialogDescription } from "./ui/dialog"
import { DialogContent } from "./ui/dialog"
import { Field } from "./ui/field"
import { FieldLabel } from "./ui/field"
import { Tabs } from "./ui/tabs"
import { TabsList } from "./ui/tabs"
import { TabsContent } from "./ui/tabs"
import { TabsTrigger } from "./ui/tabs"
import { Popover } from "./ui/popover"
import { PopoverTrigger } from "./ui/popover"
import { PopoverContent } from "./ui/popover"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Groupsendrequest } from "./store"
import { Grouprecieverequest } from "./store"
import { Toklue } from "./store"
import { UserPlus } from "lucide-react"
import { Send } from "lucide-react"
import { Inbox } from "lucide-react"
import { status } from "@/types/1to1conversations"
import { set } from "@/socketserver/clientsidesocket"
import { RequestType } from "@/types/groupconversations"
export default function Grouprequests(){
    const groupsendrequest=Groupsendrequest(s=>s.requests)
    const grouprecieverequest=Grouprecieverequest(s=>s.requests)
    const toklue=Toklue(s=>s.name)
    function handlerejectrequest(groupId:string,status:status,type:RequestType){
        if(groupId&&status){
            set("request:groupsenderrequestcancel:group",{groupId:groupId,status:status,token:toklue,type:type})
        }
    }
    function handleacceptrequest(groupId:string,sendId:string){
        if(groupId&&sendId){
            console.log(groupId,sendId)
            set("request:grouprequestaccept:group",{groupId:groupId,sendBy:sendId,token:toklue})
        }
    }
    function handleseedetails(){

    }
    function getstatus(value:status){
        if(value==="accepted"){
            return <Badge variant={"outline"} className="bg-green-300 text-primary">Accepted</Badge>
        }
        else if(value==="deleted"){
            return <Badge variant={"outline"} className="bg-red-300 text-primary">Deleted</Badge>
        }
        else if(value==="pending"){
            return <Badge variant={"outline"} className="bg-orange-300 text-primary">Pending</Badge>
        }
    }
    function handlerejectrequst(groupId:string,sendBy:string){
        if(groupId&&sendBy){
            set("request:grouprecieverejectrequest:group",{groupId:groupId,sendBy:sendBy,token:toklue})
        }
    }
    console.log(groupsendrequest,grouprecieverequest)
    return(
        <Dialog>
            <DialogTrigger asChild>
            <div className="w-full h-[53px] flex items-center justify-start px-2 space-x-6 rounded-[30px] bg-white shadow-[0px_0px_11px_2px_rgb(0,0,0,0.1)] transition-all duration-200 hover:bg-white/5 hover:scale-[1.02] hover:cursor-pointer">
                <UserPlus size={28} color="black"/>
                <span className="text-md">Group requests</span>
            </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Group requests</DialogTitle>
                    <DialogDescription>Group requests that are recieved and send</DialogDescription>
                </DialogHeader>
                <Tabs>
                    <TabsList variant={"line"}>
                       <TabsTrigger value="Send">Requests Send</TabsTrigger>
                       <TabsTrigger value="Recieve">Requests Recieve</TabsTrigger>
                    </TabsList>
                    <TabsContent value="Send" className="p-2">{groupsendrequest?.map(data=><div className="p-2 flex items-center justify-start space-x-2 rounded-md shadow-[0px_0px_7px_2px_rgb(0,0,0,0.1)]">
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="Name">GroupId:</FieldLabel>
                            <span className="text-md text-bold text-black">{data.groupId}</span>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="Status">Status:</FieldLabel>
                            {getstatus(data.status)}
                        </Field>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="Actions">Actions:</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="text-primary">Actions</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Button variant={"outline"} className="bg-red/5 text-white" onClick={(e)=>{e.stopPropagation();handlerejectrequest(data.groupId,data.status,data.type)}}>Cancel</Button>
                                    <Popover>
                                        <PopoverTrigger>
                                            <Button variant={"outline"} className="bg-orange/5 text-white" onClick={(e)=>{e.stopPropagation();handleseedetails()}}>See details</Button>
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <Field orientation={"horizontal"}>
                                                <FieldLabel htmlFor="Name">Send By:</FieldLabel>
                                                <span id="Name" className="text-black text-md">{data.sendBy.name}</span>
                                            </Field>
                                            <Field orientation={"horizontal"}>
                                                <FieldLabel htmlFor="GroupDetails">Group_Details:</FieldLabel>
                                                <span id="GroupDetails" className="text-black text-md">{data.groupId}</span>
                                            </Field>
                                            <Field orientation={"horizontal"}>
                                                <FieldLabel htmlFor="SendAt">SendAt:</FieldLabel>
                                                <span id="SendAt" className="text-black text-md">{new Date(data.sendAt).toDateString()}</span>
                                            </Field>
                                            <Field orientation={"horizontal"}>
                                                <FieldLabel htmlFor="RequestType">RequestType:</FieldLabel>
                                                <span id="RequestType" className="text-black text-md">{data.type}</span>
                                            </Field>
                                        </PopoverContent>
                                    </Popover>
                                </PopoverContent>
                            </Popover>
                        </Field>
                    </div>)}</TabsContent>
                    <TabsContent value="Recieve">{grouprecieverequest?.map(data=><div className="p-2 flex items-center justify-start space-x-2 rounded-md shadow-[0px_0px_7px_2px_rgb(0,0,0,0.1)]">
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="Name">GroupId:</FieldLabel>
                            <span className="text-md text-bold text-black">{data.groupId}</span>
                        </Field>
                        <Field orientation={"horizontal"}>
                            <FieldLabel htmlFor="SendAt">SendAt:</FieldLabel>
                            <span className="text-md text-bold text-black">{new Date(data.sendAt).toLocaleDateString()}</span>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="Actions">Actions:</FieldLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="text-primary">Actions</Button>
                                </PopoverTrigger>
                                <PopoverContent>
                                    <Button variant={"outline"} className="bg-red/5 text-white" onClick={(e)=>{e.stopPropagation();handlerejectrequst(data.groupId,data.sendBy.id)}}>Reject</Button>
                                    <Button variant={"outline"} className="bg-green/5 text-white" onClick={(e)=>{e.stopPropagation();handleacceptrequest(data.groupId,data.sendBy.id)}}>Accept</Button>
                                    <Button variant={"outline"} className="bg-orange/5 text-white" onClick={(e)=>{e.stopPropagation();handleseedetails()}}>See details</Button>
                                </PopoverContent>
                            </Popover>
                        </Field>
                    </div>)}</TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}