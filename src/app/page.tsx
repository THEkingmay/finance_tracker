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
import { useRouter } from "next/navigation"

type FormInput = {
  amount: number
  type: "income" | "expense"
  description: string
  category: string
  date: string
}

// ---------------- Form ----------------
function FormFinance({ onSuccess, setAlert }: { onSuccess?: () => void; setAlert: (alert: AlertType | null) => void }) {
  const [loading, setLoading] = useState(false)
  // const router = useRouter()

  const [formInput, setFormInput] = useState<FormInput>({
    amount: 0,
    type: "expense",
    description: "",
    category: "",
    date: "",
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

       <div className="flex ">
         {/* Amount */}
        <div className="space-y-1 mr-3 w-1/2">
          <Label className="text-sm font-medium text-gray-700">จำนวนเงิน</Label>
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
        </div>

        {/* Category */}
        <div className="space-y-1 w-1/2 ">
          <Label className="text-sm font-medium text-gray-700">หมวดหมู่</Label>
          <Select  value={formInput.category} onValueChange={(v) => handleChange("category", v)}>
            <SelectTrigger className="h-12 rounded-xl py-6  w-full  border-gray-300 focus:ring-2 focus:ring-gray-900">
              <SelectValue placeholder="เลือกหมวดหมู่" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-200 shadow-md">
              <SelectItem value="food">🍔 อาหาร</SelectItem>
              <SelectItem value="travel">✈️ ท่องเที่ยว</SelectItem>
              <SelectItem value="shopping">🛍️ ช้อปปิ้ง</SelectItem>
              <SelectItem value="bills">📄 บิล</SelectItem>
              <SelectItem value="other">🔖 อื่น ๆ</SelectItem>
            </SelectContent>
          </Select>
        </div>
       </div>

        {/* Description */}
        <div className="space-y-1">
          <Label className="text-sm font-medium text-gray-700">รายละเอียด</Label>
          <Textarea
            value={formInput.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="อธิบายเพิ่มเติม เช่น กินข้าวกับเพื่อน"
            className="min-h-[100px] rounded-xl border-gray-300 focus:ring-2 focus:ring-gray-900"
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

type ListType = {
  id:string ,
  uid: string
  amount: number
  type: "income" | "expense"
  description?: string
  category?: string
  created_at: string
}
export function DailyHistory({ setAlert }: { setAlert: (alert: AlertType | null) => void }) {
  const [items, setItems] = useState<ListType[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const getTodayHistory = async () => {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]

      try {
        const res = await fetch(`/api/transactions/${today}`)
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
  }, [setAlert])

  return (
    <div className="p-6 w-6xl mx-auto ">
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
        <div className="grid gap-4 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <div
              key={t.id}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between border  hover:shadow-xl transition-shadow"
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
                  {new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------- Modal ----------------
function FormFinanceModal({ setAlert }: { setAlert: (alert: AlertType | null) => void }) {
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
        <FormFinance setAlert={setAlert} onSuccess={()=>setOpen(false)}/>
      </DialogContent>
    </Dialog>
    
  )
}

// ---------------- HomePage ----------------
export default function HomePage() {
  const [alert, setAlert] = useState<AlertType | null>(null)
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {alert && <AlertNotification {...alert} />}
      <GlobalNavbar />
      <div className="md:flex">
        {/* <div className="hidden md:block max-w-md p-6">
          <FormFinance setAlert={setAlert} />
        </div> */}
        <DailyHistory setAlert={setAlert} />
        <FormFinanceModal setAlert={setAlert} />
      </div>
    </div>
  )
}