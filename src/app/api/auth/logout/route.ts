import { cookies } from "next/headers";
import {  NextResponse } from "next/server";

export async function GET() {

  try {
    const cookieStore = await cookies();
    // console.log(cookieStore)
    cookieStore.delete("token"); 
    // console.log("delete here")
    return NextResponse.json({status : 200})
  } catch (err) {
    console.log((err as Error).message)
    return NextResponse.json(
      { message: "Logout ไม่สำเร็จ" },
      { status: 400 }
    );
  }
}
