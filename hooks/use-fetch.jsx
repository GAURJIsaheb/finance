import { useState } from "react"
import { toast } from "sonner";

//Hook hai ye,,
//  page..jo Error state,,data fetch vagera krega
const useFetch=(cb)=>{
    const [data,setdata]=useState(undefined);
    const [loading,setloading]=useState(false);
    const [error,seterror]=useState(null);

    const fn=async(...args)=>{
        setloading(true);
        seterror(null);
        try {
            const resp=await cb(...args);
            setdata(resp)
            seterror(false)
        } catch (error) {
            seterror(error)//-->Error ko toast ,,popup se show krvayenge-->npx shadcn@latest add sonner
            toast.error(error.message)

        }finally{
            setloading(false)
        }
    }
    return {data,loading,error,fn,setdata};
};
export default useFetch;