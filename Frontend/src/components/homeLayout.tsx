import React,{ReactNode} from 'react';

import Sidebar from './sidebar';

interface BlogsPrps{
    children: ReactNode;
}
 const HomeLayout : React.FC<BlogsPrps> = ({children}) => {
    return <div>
        
            <Sidebar/>
            <main className="w-full">
                <div className="w-full  min-h-[calc(100vh-45)] px-4">
                    {children}
                </div>
            </main>
            

       
    </div>
 };

 export default HomeLayout;