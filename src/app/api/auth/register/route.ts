import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email และ Password ห้ามว่าง" }, { status: 400 });
    }

    // ตรวจสอบว่ามี email ซ้ำหรือไม่
    const { data: existUser, error: checkError } = await supabase
      .from("users")
      .select("uid")
      .eq("email", email)
      .single();

    if (existUser) {
      return NextResponse.json({ message: "อีเมลนี้ถูกใช้งานแล้ว" }, { status: 409 });
    }

    if (checkError && checkError.code !== "PGRST116") { 
      // PGRST116 = no rows found
      return NextResponse.json({ message: checkError.message }, { status: 500 });
    }

    // เข้ารหัส password
    const hashpassword = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่
    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ email, hashpassword }])
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ message: insertError.message }, { status: 500 });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { uid: newUser.uid},
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

   const res = NextResponse.json({message: "สมัครสมาชิกสำเร็จ"});
   res.cookies.set("token", token, {
        httpOnly: true,   // ปลอดภัย: JS ฝั่ง client อ่านไม่ได้
        secure: true,     // ใช้ HTTPS เท่านั้น
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60   * 24// อายุ 1 วัน
    });

    return res;

  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
