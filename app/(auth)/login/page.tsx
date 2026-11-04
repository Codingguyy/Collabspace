import Loginn from "@/components/login"
export default async function Login(){
    return(
       <div className="relative min-h-screen min-w-screen flex flex-col items-center md:flex md:flex-row md:items-center">
        <div className="flex flex-col items-center py-16 md:py-16 md:items-start md:px-12 lg:py-24 lg:px-24">
            <h1 className="text-3xl text-white md:text-4xl md:py-6 lg:text-5xl lg:py-6" style={{fontFamily:"'Roboto-mono',monospace"}}>Welcome User</h1>
            <p className="text-white text-xs py-8 md:text-sm md:py-6 lg:py-6 lg:text- tracking-wide" style={{fontFamily:"'Roboto-mono',monospace"}}>Enter ur credentials to verified urself</p>
        </div>
        <Loginn/>
       </div>
    )
}