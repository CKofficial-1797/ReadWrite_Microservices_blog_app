// "use client";
// import React from 'react'
// import { Button } from '@/components/ui/button'
// import { useAppData } from '@/context/AppContext'
// import Loading from '@/components/loading';
// import HomeLayout from '@/components/homeLayout';

// import { Filter } from 'lucide-react';
// import { useSidebar } from '@/components/ui/sidebar';

// const Home = () => {
//   const {loading, blogLoading, blogs} = useAppData();
//   const {toggleSidebar} = useSidebar();

//   return (
//     <HomeLayout>{loading ? <Loading /> : <div className="container mx-auto px-4">
//      <div className="flex justify-between items-center my-5">
//       <h1 className="text-3xl font-bold">Latest Blogs</h1>
//       <Button onClick={toggleSidebar} className="flex items-center gap-2 px-4 bg-primary text-white"><Filter size={18}/>
//       <span>Filter blogs</span>
//       </Button>
//      </div>
//       </div>}
      
//     </HomeLayout>
//   )
// }

// export default Home

import { redirect } from "next/navigation";
import React from "react";

const Home = () => {
  return redirect("/blogs");
};

export default Home; 