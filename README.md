# 💰 Finance Tracker

![Project Status](https://img.shields.io/badge/Status-Active-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Next.js](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat-square&logo=supabase)

> **Finance Tracker** คือเว็บแอปพลิเคชันสำหรับบริหารจัดการการเงินส่วนบุคคล ช่วยให้คุณบันทึกรายรับ-รายจ่าย ตรวจสอบสถานะทางการเงิน และวางแผนการใช้เงินได้อย่างมีประสิทธิภาพ ขับเคลื่อนด้วยฐานข้อมูลประสิทธิภาพสูงจาก Supabase

---

## 📸 Screen Preview

<img width="759" height="787" alt="image" src="https://github.com/user-attachments/assets/83e1119c-c955-4ba2-b7c3-5410641f3b06" />
<img width="1912" height="838" alt="image" src="https://github.com/user-attachments/assets/274ed9af-a6e3-4708-9bf2-b154a7b626c7" />
<img width="1910" height="831" alt="image" src="https://github.com/user-attachments/assets/e1a8b335-12fd-4a28-b402-1c4f7c700366" />
<img width="1879" height="850" alt="image" src="https://github.com/user-attachments/assets/edec24eb-d2da-4bf7-ad6b-2d9b2d8067e2" />
<img width="1887" height="788" alt="image" src="https://github.com/user-attachments/assets/6ab1fb3f-d1da-4376-b643-12568aee3b25" />

---

## ✨ ฟีเจอร์หลัก (Key Features)

* **🔐 User Authentication:** ระบบสมาชิกที่ปลอดภัย (สามารถเชื่อมต่อกับ Supabase Auth ได้)
* **💸 Income & Expense Tracking:** บันทึกรายการรายรับและรายจ่ายได้อย่างละเอียด พร้อมระบุหมวดหมู่
* **📊 Dashboard Overview:** หน้าสรุปผลภาพรวมทางการเงิน แสดงยอดเงินคงเหลือ และประวัติการทำธุรกรรมล่าสุด
* **☁️ Cloud Database:** จัดเก็บข้อมูลอย่างปลอดภัยและเรียกใช้ได้รวดเร็วผ่าน **Supabase (PostgreSQL)**
* **📱 Responsive Interface:** ใช้งานได้สะดวกทุกที่ ทั้งบนคอมพิวเตอร์และมือถือ

---

## 🛠️ Tech Stack

เทคโนโลยีที่ใช้ในการพัฒนา:

* **Framework:** [Next.js](https://nextjs.org/) (App Router)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database & Backend:** [Supabase](https://supabase.com/) (PostgreSQL)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 การติดตั้งและเริ่มต้นใช้งาน (Getting Started)

1. **Clone Repository**
   ```bash
   git clone [https://github.com/THEkingmay/finance_tracker.git](https://github.com/THEkingmay/finance_tracker.git)
   cd finance_tracker
2.ติดตั้ง Dependencies

```Bash
    npm  install
```
3.Environment
```Bash
  SUPABASE_URL = ''
  SUPABASE_KEY = ''
  JWT_SECRET = ''
```
4.รันโปรเจค
```Bash
  npm run dev
```
