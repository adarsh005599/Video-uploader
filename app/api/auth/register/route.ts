import { connDB } from "@/app/utils/db";
import User from "@/models/user";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        //frontend call
        const {email , password} = await request.json()

        //validation
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and Password are required!"},
                {status:400}
            )  
        }
        
        //user check
        await connDB()

        const exisitingUser = await User.findOne({email})
        if(exisitingUser){
            return NextResponse.json(
                {error: "Opps!! User already Exist"},
                {status:400}
            )
        }

        //user creating

        await User.create({
            email,
            password
        })
        return NextResponse.json(
            {message:"User SignUp Successfully☠️!!"},
            {status:200}
        )
        
    } catch (error) {
        console.error("SignUp Failed!", error)
        return NextResponse.json(
            {error:"Failed to Signup🍭"},
            {status:400}
        )
    }
}