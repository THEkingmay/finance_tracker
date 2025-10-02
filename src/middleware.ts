import { cookies } from 'next/headers'
import { NextResponse, NextRequest } from 'next/server'
 
export async function middleware(request: NextRequest) {
  const cookieStore =await cookies()
  const token = cookieStore.get('token')?.value

  // ถ้าไม่มี token → redirect ไป login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // ถ้ามี token → ปล่อย request ผ่านไป
  return NextResponse.next()
}
 
export const config = {
  matcher: ['/'], // ตรวจสอบเฉพาะ path /
}
