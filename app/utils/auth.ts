
import GitHubProvider from "next-auth/providers/github";
import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { connDB } from "./db";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export const authOptions :NextAuthOptions ={
providers: [
    // SAME FOR THE GOOGLE AUTH, etc
//   GitHubProvider({
//     clientId: process.env.GITHUB_ID!,
//     clientSecret: process.env.GITHUB_SECRET!
//   })
    Credentials({
        name:"Credentials",
        credentials:{
            email: {label:"Username" , type:"text"},
            password:{label: "password", type:"password"}
        },
        async authorize(Credentials, req){
            if(!Credentials?.email || Credentials?.password){
                throw new Error("email or password is missing!")
            }
            try {
                await connDB()
                const user = await User.findOne({email:Credentials.email})

                if(!user){
                    throw new Error("No user found with this")
                }
                
                const isValid = await bcrypt.compare(
                    Credentials.password,
                    user.password
                )  
                if(!isValid){
                    throw new Error ("opps!! Invalid password!")
                }
                return{
                    id: user._id.toString(),
                    email:user.email
                }
            } catch (error) {
                console.error("Auth error:", error)
                throw new Error("Auth not valid")
                status:400
            }
        }
    })
],
    callbacks:{
        async jwt({token, user}){
            if(user){
                token.id=user.id
            }
            return token
        },
        async session({session, token}){
            if(session.user){
                session.user.id= token.id as string
            }
            return session
        }
    },
    pages: {
        signIn:"/login",
        error:"/login"
    },
    session:{
        strategy:"jwt",
        maxAge:30*24*60*60,
    },
    secret:process.env.NEXTAUTH_SECRET
}
