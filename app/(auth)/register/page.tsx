import { Field } from "@/components/ui/field"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Registerr from "@/components/register"
export default async function Register(){
    return(
        <div className="min-h-screen min-w-screen flex flex-col items-center md:flex-row md:px-12 md:py-24 lg:py-24 lg:px-24">
            <div className="flex flex-col items-center py-12 px-6 md:items-start md:px-12 md:py-12 lg:px-12 lg:py-24">
                <h1 className="text-white text-3xl px-6 py-6 md:text-5xl md:px-12 md:py-6 lg:text-6xl lg:py-6 lg:px-6" style={{fontFamily:"'Roboto-mono',monospace"}}>Hello User</h1>
                <p className="text-white text-xs px-6 py-6 md:px-12 md:py-6 md:text-sm lg:py-6 lg:px-6 lg:text-medium lg:text-tracking-wide" style={{fontFamily:"'Roboto-mono',monospace"}}>We welcome u in out messaging app register for using our app</p>
            </div>
            <Registerr/>
        </div>
    )
}