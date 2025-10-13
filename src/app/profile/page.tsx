'use client'

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GlobalNavbar from "@/components/globalNavbar";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; 


// Icons
import {  Mail, LogOut, Frown, ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/user');
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Please log in to view your profile.');
        }
        const data = await res.json();
        setProfile(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET' });
    router.push('/login');
  };

  if (isLoading) {
    return <><UserDetailSkeleton/></> 
  }

  if (error || !profile) {
    return <><UserNotFound/></>
  }

  const username = profile.email.split('@')[0];
  const avatarFallbackText = username.substring(0, 2).toUpperCase();

  return (
    <div>
      <GlobalNavbar />
      <div className="container mx-auto max-w-lg py-12">
        <Card>
          <CardHeader className="items-center text-center">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.email}`} alt={username} />
              {/* ✅ 3. ใช้ตัวย่อจาก email เป็น Fallback */}
              <AvatarFallback className="text-3xl">
                {avatarFallbackText}
              </AvatarFallback>
            </Avatar>
            {/* ✅ 4. แสดงชื่อผู้ใช้จากส่วนหน้าของ email */}
            <CardTitle className="text-2xl capitalize">{username}</CardTitle>
            <CardDescription>{profile.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-md">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">Email: {profile.email}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="w-full" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              ออกจากระบบ
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}   


function UserDetailSkeleton() {
    return (
        <div className="container mx-auto max-w-2xl py-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-8 w-1/3" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-1/2" />
                    </div>
                     <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-2/3" />
                    </div>
                    <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-6 w-1/3" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-1/5" />
                        <Skeleton className="h-[100px] w-full" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                </CardFooter>
            </Card>
        </div>
    );
}

// --- NEW: Component for Transaction Not Found ---
function UserNotFound() {
    const router = useRouter();
    return (
        <div className="container mx-auto max-w-2xl py-8 text-center">
            <Card className="p-8 flex flex-col items-center space-y-4">
                <Frown className="w-16 h-16 text-gray-500" />
                <CardTitle className="text-2xl">ไม่พบรายการ</CardTitle>
                <CardDescription>
                    ขออภัย, ไม่พบรายชื่อผู้ใช้
                </CardDescription>
                <Button onClick={() => router.push('/')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    กลับไปหน้ารายการ
                </Button>
            </Card>
        </div>
    );
}   