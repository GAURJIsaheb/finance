import { rateLimit } from "@/lib/upstash";
import { NextResponse } from "next/server";

export async function GET(req){
    const ip=req.ip ?? "127.0.0.1";
    const {success,pending,limit,reset,remaining}=await rateLimit.limit(ip);
    if(!success){
        //console.log("limit--->",limit);
        //console.log("reset--->",reset);
        //console.log("remaining--->",remaining);
        return NextResponse.json("Rate Limited",{status:429});
    }
    return NextResponse.json("Success",{status:200});
}