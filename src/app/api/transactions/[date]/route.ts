import { NextRequest, NextResponse } from "next/server";
import supabase from "@/lib/supabase";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise< {date: string }> } // date ควรส่งมาเป็น "YYYY-MM-DD"
) {
  try {

    const {date } = await params
    // 1. ดึง token จาก cookie
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. ตรวจสอบ token และดึง uid
    const { uid } = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string };

    const startOfDay = `${date}T00:00:00`
    const endOfDay   = `${date}T23:59:59`
        // 4. Query ข้อมูลจาก Supabase    
    const { data, error } = await supabase
      .from("transactions") // ตรวจสอบว่าตารางชื่อถูกต้อง
      .select("*")
      .eq("uid", uid)
      .gte("created_at", startOfDay)
      .lte("created_at", endOfDay)
      .order("created_at", { ascending: true })
          // console.log(data)

    if (error) {
      throw new Error(error.message);
    }

    // 5. ส่งผลลัพธ์กลับ
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 400 }
    );
  }
}
