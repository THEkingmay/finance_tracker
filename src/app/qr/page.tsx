"use client";
import { useState } from "react";
import QRCode from "qrcode";
import generatePayload from "promptpay-qr";
import Image from "next/image";
import GlobalNavbar from "@/components/globalNavbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { toast } from "@/components/ui/use-toast"; // --- ลบออก ---
import { Loader2, QrCode } from "lucide-react";

export default function PromptPayQR() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [qrSrc, setQrSrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const thaiPhoneRegex = /^0[689]\d{8}$/;

  const generateQR = async () => {
    setIsLoading(true);
    setQrSrc("");

    // --- Validation (เปลี่ยนจาก toast เป็น alert) ---
    if (!mobileNumber) {
      alert("กรุณากรอกเบอร์พร้อมเพย์ 💬"); // --- เปลี่ยน ---
      setIsLoading(false);
      return;
    }

    if (!thaiPhoneRegex.test(mobileNumber)) {
      alert(
        "เบอร์พร้อมเพย์ไม่ถูกต้อง 📱\nกรุณาตรวจสอบเบอร์มือถือ 10 หลัก (เช่น 0812345678)"
      ); // --- เปลี่ยน ---
      setIsLoading(false);
      return;
    }

    const numAmount = parseFloat(amount);
    if (amount && numAmount <= 0) {
      alert(
        "จำนวนเงินไม่ถูกต้อง 💰\nจำนวนเงิน (หากระบุ) ต้องมากกว่า 0"
      ); // --- เปลี่ยน ---
      setIsLoading(false);
      return;
    }
    // --- End Validation ---

    const payload =
      amount && numAmount > 0
        ? generatePayload(mobileNumber, { amount: numAmount })
        : generatePayload(mobileNumber , {});
    console.log("Generated Payload:", payload); // Debug log
    try {
      const url = await QRCode.toDataURL(payload, { width: 300, margin: 2 });
      console.log("Generated QR Code URL:", url); // Debug log
      setQrSrc(url);
    } catch (err) {
      console.error(err); // เก็บ log ไว้ใน console
      alert("เกิดข้อผิดพลาด ⚠️\nไม่สามารถสร้าง QR Code ได้"); // --- เปลี่ยน ---
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQR = () => {
    if (!qrSrc) return;
    const a = document.createElement("a");
    a.href = qrSrc;
    const fileName =
      amount && parseFloat(amount) > 0
        ? `PromptPay_${mobileNumber}_${amount}THB.png`
        : `PromptPay_${mobileNumber}.png`;
    a.download = fileName;
    a.click();
  };

  const renderQrContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-[300px] w-[300px] bg-muted/30 rounded-lg">
          <Loader2 className="h-12 w-12 animate-spin text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">กำลังสร้าง QR Code...</p>
        </div>
      );
    }

    if (qrSrc) {
      return (
        <>
          <Image
            src={qrSrc}
            alt="PromptPay QR Code"
            width={300}
            height={300}
            className="rounded-lg border"
          />
          <Button
            onClick={downloadQR}
            variant="secondary"
            className="w-full md:w-auto"
          >
            ดาวน์โหลดรูปภาพ
          </Button>
        </>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-[300px] w-[300px] bg-muted/30 rounded-lg">
        <QrCode className="h-12 w-12 text-muted-foreground" />
        <p className="mt-2 text-muted-foreground">
          กรอกข้อมูลเพื่อสร้าง QR Code
        </p>
      </div>
    );
  };

  return (
    <>
      <GlobalNavbar />
      <div className="container mx-auto p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Form Section */}
              <div className="flex-1 space-y-4">
                <CardTitle className="text-2xl font-bold text-blue-600 mb-6">
                  💸 สร้าง QR พร้อมเพย์
                </CardTitle>

                <div className="space-y-2">
                  <Label htmlFor="promptpay">เบอร์พร้อมเพย์</Label>
                  <Input
                    id="promptpay"
                    type="tel"
                    placeholder="เช่น 0812345678"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    maxLength={10}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">
                    จำนวนเงิน (บาท){" "}
                    <span className="text-gray-400">(ไม่บังคับ)</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="เช่น 100"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0.01"
                    step="0.01"
                    disabled={isLoading}
                  />
                </div>

                <Button
                  onClick={generateQR}
                  className="w-full"
                  variant="default"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading ? "กำลังสร้าง..." : "สร้าง QR Code"}
                </Button>
              </div>

              {/* QR Code Section */}
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                {renderQrContent()}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}