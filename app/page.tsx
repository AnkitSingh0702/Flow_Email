// import { FlowEditor } from "./components/flow-editor"

// export default function Home() {
//   return (
//     <main className="h-screen bg-background">
//       <div className="container mx-auto py-4">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold">Email Sequence Builder</h1>
//           <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
//             Save & Schedule
//           </button>
//         </div>
//         <FlowEditor />
//       </div>
//     </main>
//   )
// }

'use client'

import Dashboard from "./dashboard/page"



export default function Home() {


  return (
   <div>
    <Dashboard/>
   </div>
  )
}

