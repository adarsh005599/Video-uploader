
import GitHubProvider from "next-auth/providers/github";
import Credentials, { CredentialsProvider } from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

export const authOptions :NextAuthOptions ={
providers: [
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
        async authorize(credentials){
            return null
        }
    })
]
}