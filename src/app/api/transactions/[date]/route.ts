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

    // 3. สร้างช่วงเวลา start - end ของวันนั้น
    const startOfDayUTC = new Date(`${date}T00:00:00+07:00`).toISOString()
  const endOfDayUTC = new Date(`${date}T23:59:59+07:00`).toISOString()

    // console.log(startOfDayUTC , endOfDayUTC)
    // 4. Query ข้อมูลจาก Supabase    
    const { data, error } = await supabase
      .from("transactions") // ตรวจสอบว่าตารางชื่อถูกต้อง
      .select("*")
      .eq("uid", uid)
      .gte("created_at", startOfDayUTC)
      .lte("created_at", endOfDayUTC);

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
