'use client'

import GlobalNavbar from "@/components/globalNavbar"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent} from "@/components/ui/card"
import AlertNotification, { AlertType } from "@/components/ui/alertNotification"
import { Loader2, TrendingUp, TrendingDown, Save } from "lucide-react"
import { Dialog, DialogContent , DialogTrigger } from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

import type { transaction , FormInput } from "@/type/allType"
import Link from "next/link"


// ---------------- Form ----------------
function FormFinance({ onSuccess, setAlert }: { onSuccess?: () => void; setAlert: (alert: AlertType | null) => void }) {
  const [loading, setLoading] = useState(false)
  // const router = useRouter()
  const getLocalDateTimeString = () => {
      const now = new Date();
      const year = now.getFullYear();
      // getMonth() คืนค่า 0-11 เลยต้อง +1
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); 
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      
      // ผลลัพธ์ที่ได้: "2025-10-30T09:53" (ตัวอย่าง)
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };
  const [formInput, setFormInput] = useState<FormInput>({
    amount: 0,
    type: "expense",
    description: "",
    category: "",
    date: getLocalDateTimeString(),
  })

  const handleChange = (field: keyof FormInput, value: string | number | "income" | "expense" ) => {
    setFormInput((prev) => ({ ...prev, [field]: value }))
  }

  const handleAdd = async () => {
    if (formInput.amount <= 0 || !formInput.category || !formInput.date) {
      setAlert({
        alertType: "error",
        head: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกจำนวนเงิน เลือกหมวดหมู่ และกำหนดวันที่",
        clear: () => setAlert(null),
      })
      return
    }

    setLoading(true)
    setAlert(null)
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formInput),
      })

      if (res.ok) {
        setAlert({
          alertType: "success",
          head: "บันทึกสำเร็จ",
          description: "เพิ่มรายการรายรับ–รายจ่ายเรียบร้อยแล้ว ✨",
          clear: () => setAlert(null),
        })
        setFormInput({ amount: 0, type: "expense", description: "", category: "", date: "" })
        onSuccess?.()
      } else {
        setAlert({
          alertType: "error",
          head: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
          clear: () => setAlert(null),
        })
      }
    } catch (err) {
      setAlert({
        alertType: "error",
        head: "การเชื่อมต่อล้มเหลว",
        description: (err as Error).message || "เซิร์ฟเวอร์ไม่ตอบสนอง ❌",
        clear: () => setAlert(null),
      })
    } finally {
      setLoading(false)
    }
  }

  const checkCatagory = (value : string)=>{
    return formInput.category == value ? "bg-blue-50 border-blue-400 text-blue-700 shadow-sm" : "bg-white border-gray-200 hover:border-gray-400"
  }

  return (
    <Card className="rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
     
      <CardContent className="p-6 sm:p-8 space-y-4">
        {/* {alert && <div>HERE</div>} */}

        {/* Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">ประเภทรายการ</Label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange("type", "income")}
              className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 ${
                formInput.type === "income"
                  ? "bg-green-50 border-green-400 text-green-700 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-400"
              }`}
            >
              <TrendingUp className="w-6 h-6 mb-2" />
              <span className="font-medium">รายรับ</span>
            </button>
            <button
              type="button"
              onClick={() => handleChange("type", "expense")}
              className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 ${
                formInput.type === "expense"
                  ? "bg-red-50 border-red-400 text-red-700 shadow-sm"
                  : "bg-white border-gray-200 hover:border-gray-400"
              }`}
            >
              <TrendingDown className="w-6 h-6 mb-2" />
              <span className="font-medium">รายจ่าย</span>
            </button>
          </div>
        </div>

        
        {/* Category */}
        <div className="space-y-1  ">
          <Label className="text-sm font-medium text-gray-700">หมวดหมู่</Label>
        
          <div className="flex gap-x-2">
              <button onClick={()=>handleChange("category" , "food")}  className={`flex-1 p-4 border rounded-lg transition-all duration-200 ${checkCatagory("food")}`} value={"food"}>อาหาร</button>
              <button onClick={()=>handleChange("category" , "travel")}  className={`flex-1 p-4 border rounded-lg transition-all duration-200 ${checkCatagory("travel")}`} value={"travel"}>ท่องเที่ยว</button>
              <button onClick={()=>handleChange("category" , "shopping")}  className={`flex-1 p-4 border rounded-lg transition-all duration-200 ${checkCatagory("shopping")}`} value={"shopping"}>ช้อปปิ้ง</button>
              <button onClick={()=>handleChange("category" , "bills")}  className={`flex-1 p-4 border rounded-lg transition-all duration-200 ${checkCatagory("bills")}`} value={"bills"}>บิล</button>
              <button onClick={()=>handleChange("category" , "other")}  className={`flex-1 p-4 border rounded-lg transition-all duration-200 ${checkCatagory("other")}`} value={"other"}>อื่นๆ</button>
          </div>
        </div>

           {/* Amount */}
        <div className="mt-2 space-y-1">
          <Label className="text-sm font-medium text-gray-700">จำนวนเงิน</Label>
          <div className="flex gap-x-1 items-center">
            <div className="flex-1  justify-center items-center  flex gap-1">
              <Button onClick={()=>handleChange("amount" , formInput.amount-10)}>-10</Button>
              <Button onClick={()=>handleChange("amount" , formInput.amount-1)}>-1</Button>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">฿</span>
              <Input
                type="number"
                value={formInput.amount}
                onChange={(e) => handleChange("amount", parseFloat(e.target.value))}
                placeholder="0.00"
                className="pl-9 h-12 text-lg rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="flex-1  justify-center items-center  flex gap-1">
              <Button onClick={()=>handleChange("amount" , formInput.amount+1)}>+1</Button>
              <Button onClick={()=>handleChange("amount" , formInput.amount+10)}>+10</Button>
            </div>
          </div>
        </div>

        {/* Des cription */}
        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700">รายละเอียด</Label>
          <Textarea
            value={formInput.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="อธิบายเพิ่มเติม เช่น กินข้าวกับเพื่อน"
            className="min-h-[60px] rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Date */}
        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700">วันที่และเวลา</Label>
          <Input
            type="datetime-local"
            value={formInput.date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="h-12 rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Submit Button */}
        <Button
          className="w-full h-12 mt-6 bg-gray-900 text-white hover:bg-gray-800 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              กำลังบันทึก...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              บันทึกข้อมูล
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}


export function DailyHistory({ setAlert , reload }: { setAlert: (alert: AlertType | null) => void , reload : number }) {
  const [items, setItems] = useState<transaction[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getTodayHistory = async () => {
      setLoading(true)
      const d = new Date()
      const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      console.log(today) // 👉 2025-10-08
      try {
        const res = await fetch(`/api/transactions?date=${today}`)
        if (!res.ok) throw new Error("Failed to fetch")
        const result = await res.json()
        setItems(result.data || [])
      } catch (err) {
        console.error("Error fetching transactions:", err)
        setAlert({
          alertType: "error",
          head: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถดึงข้อมูลรายการวันนี้ได้ กรุณาลองใหม่อีกครั้ง",
          clear: () => setAlert(null),
        })
      } finally {
        setLoading(false)
      }
    }

    getTodayHistory()
  }, [setAlert , reload])

  return (
    <div className="p-6 max-w-6xl mx-auto  md:w-6xl">
      <h2 className="text-2xl font-semibold mb-6">💰 รายการเงินของคุณวันนี้</h2>

      {/* Loading */}
      {loading && (
        <div className="flex items-start gap-2 text-gray-500 mb-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          กำลังโหลด...
        </div>
      )}

      {/* Empty */}
      {!loading && items.length === 0 && (
        <p className="text-gray-500">ยังไม่มีรายการ</p>
      )}

      {/* List */}
      {!loading && items.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {items.map((t) => (
            <Link key={t.id} href={`/history/${t.id}`}>
            <div
              
              className="bg-white shadow-md rounded-lg px-4 py-3 flex flex-col justify-between border  hover:shadow-xl transition-shadow"
            >
              <div className="mb-2">
                <h3 className="font-medium text-gray-800">{t.description || "—"}</h3>
                {t.category && (
                  <p className="text-xs text-gray-400 mt-1">{t.category}</p>
                )}
              </div>
              <div className="mt-auto flex justify-between items-center">
                <span
                  className={
                    t.type === "income"
                      ? "text-green-600 font-semibold text-lg"
                      : "text-red-600 font-semibold text-lg"
                  }
                >
                  {t.type === "income" ? "+" : "-"} ฿{t.amount}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(t.created_at ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------- Modal ----------------
function FormFinanceModal({ setAlert , onSuccess}: {  onSuccess?: () => void , setAlert: (alert: AlertType | null) => void }) {
  const [open, setOpen] = useState(false);
  return (

    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6  bg-gray-900 text-white shadow-lg">
         เพิ่มรายการ +
        </Button>
      </DialogTrigger>
     <DialogContent className="max-w-lg bg-white shadow-none p-0 rounded-2xl ">
        <DialogTitle className="px-5 pt-3 text-lg">เพิ่มรายการใหม่</DialogTitle>
        <FormFinance setAlert={setAlert} onSuccess={()=>{setOpen(false) ; onSuccess?.()}}/>
      </DialogContent>
    </Dialog>
    
  )
}

// ---------------- HomePage ----------------
export default function HomePage() {
  const [alert, setAlert] = useState<AlertType | null>(null)
  const [triggerReload , setReload] = useState<number>(0) 
  return (
    <div className="min-h-screen bg-white">
      {alert && <AlertNotification {...alert} />}
      <GlobalNavbar />
      <div className="md:flex">
        {/* <div className="hidden md:block max-w-md p-6">
          <FormFinance setAlert={setAlert} />
        </div> */}
        <DailyHistory setAlert={setAlert}   reload={triggerReload}/>
        <FormFinanceModal setAlert={setAlert} onSuccess={() => setReload((prev) => prev + 1)}/>
      </div>
    </div>
  )
}
