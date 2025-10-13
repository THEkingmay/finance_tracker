import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import supabase from "@/lib/supabase"; 

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string };
    const uid = decoded.uid;
    
    const { data: user, error } = await supabase
      .from('users')        
      .select('*')       
      .eq('uid', uid)    
      .single();         

    if (error) {
      console.error("Supabase error:", error.message);
      return NextResponse.json({ message: "Could not fetch user data", error: error.message }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    // console.log(user)
    return NextResponse.json({ user });

  } catch (err) {
    console.error("JWT or other error:", err);
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }
}