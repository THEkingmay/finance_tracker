import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import supabase from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    // รับ email, password จาก body
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email และ Password ห้ามว่าง" }, { status: 400 });
    }

    // หา user จาก Supabase
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    const user = users?.[0];
    if (!user) {
      return NextResponse.json({ message: "ไม่พบผู้ใช้" }, { status: 404 });
    }

    // ตรวจสอบ password
    const match = await bcrypt.compare(password, user.hashpassword);
    if (!match) {
      return NextResponse.json({ message: "รหัสผ่านไม่ถูกต้อง" }, { status: 401 });
    }

    // สร้าง JWT (ใช้ SECRET จาก env)
    const token = jwt.sign(
      { uid: user.uid},
      process.env.JWT_SECRET!, 
      { expiresIn: "1d" }
    );

    const res = NextResponse.json({message: "เข้าสู่ระบบสำเร็จ" });

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
