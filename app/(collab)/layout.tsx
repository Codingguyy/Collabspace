import React from 'react'
import Sidebarcomponent from '@/components/sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import Colabnavigate from '@/components/colabnavigate'
import Colabactivity from '@/components/colabactivity'
export default async function Layout({children}:Readonly<{children:React.ReactNode}>){
    return(
       <div className="max-w-9xl w-screen flex items-center justify-start no-scrollbar">{children}<Colabnavigate/><Colabactivity/></div>
    )
}
//<Sidebarcomponent/>