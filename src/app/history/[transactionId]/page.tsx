'use client'

import { useParams, useRouter } from 'next/navigation'
import { transaction as TransactionType } from '@/type/allType' // Renamed to avoid conflict
import { useState, useEffect } from 'react'

// UI Components from shadcn/ui
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import AlertNotification, { AlertType } from '@/components/ui/alertNotification'
import { Badge } from '@/components/ui/badge'
// Icons
import { TrendingUp, TrendingDown, Pencil, Trash2, Save, X, Loader2, Frown, ArrowLeft } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

// Mock data fetch function (แทนที่ด้วย logic การ fetch จริงของคุณ)
const fetchTransactionById = async (id: string): Promise<TransactionType> => {
    const res = await fetch(`/api/transactions?id=${id}`)
    const data = await res.json()
    return data.data[0]
    
}

export default function EditTransactionPage() {
    const router = useRouter()
    const params = useParams<{ transactionId: string }>()
    const transactionId = params.transactionId

    // --- STATE MANAGEMENT ---
    const [originalTransaction, setOriginalTransaction] = useState<TransactionType | null>(null)
    const [formInput, setFormInput] = useState<Partial<TransactionType>>({})
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [alert, setAlert] = useState<AlertType | null>(null)
    
    // --- DATA FETCHING ---
    useEffect(() => {
        if (!transactionId) return;
        
        const loadData = async () => {
            setIsLoading(true)
            try {
                const data = await fetchTransactionById(transactionId)
                setOriginalTransaction(data)
                setFormInput(data)
            } catch (error) {
                
                setAlert({ alertType: 'error', head: 'Error', description: 'Failed to fetch transaction data.' + (error as Error).message, clear: () => setAlert(null) })
            } finally {
                setIsLoading(false)
            }
        }
        loadData()
    }, [transactionId])

    // --- HANDLERS ---
    const handleChange = (field: keyof TransactionType, value: number | string |Date) => {

        setFormInput(prev => ({ ...prev, [field]: value }))
    }

    const handleUpdate = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/transactions', {
                method: 'PUT', // หรือ 'PATCH' ตามที่ API คุณออกแบบ
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: transactionId, ...formInput }),
            });

            if (!res.ok) throw new Error('Failed to update transaction.');

            const updatedData = await res.json();
            setOriginalTransaction(updatedData.transaction); // อัปเดตข้อมูลล่าสุด
            setIsEditing(false);
            setAlert({ alertType: 'success', head: 'สำเร็จ!', description: 'บันทึกการเปลี่ยนแปลงเรียบร้อยแล้ว', clear: () => setAlert(null) });

        } catch (error) {
            setAlert({ alertType: 'error', head: 'เกิดข้อผิดพลาด', description: (error as Error).message, clear: () => setAlert(null) });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await fetch('/api/transactions', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: transactionId }),
            });

            if (!res.ok) throw new Error('Failed to delete transaction.');
            
            setAlert({ alertType: 'success', head: 'สำเร็จ!', description: 'ลบรายการเรียบร้อยแล้ว', clear: () => setAlert(null) });
            // ส่งผู้ใช้กลับไปหน้ารายการหลักหลังจากลบสำเร็จ
            router.push('/history'); 

        } catch (error) {
            setAlert({ alertType: 'error', head: 'เกิดข้อผิดพลาด', description: (error as Error).message, clear: () => setAlert(null) });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCancelEdit = () => {
        setFormInput(originalTransaction!); // คืนค่าฟอร์มกลับเป็นข้อมูลเดิม
        setIsEditing(false);
    }

    // --- RENDER LOGIC ---
 if (isLoading) return <TransactionDetailSkeleton />;
if (!originalTransaction) return <TransactionNotFound transactionId={transactionId} />;

  
    return (
        <div className="container mx-auto max-w-2xl py-8">
            {alert && <AlertNotification {...alert} />}

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? 'แก้ไขรายการ' : 'รายละเอียดรายการ'}</CardTitle>
                    <CardDescription>
                        {isEditing ? 'กรุณากรอกข้อมูลที่ต้องการแก้ไข' : ``}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* // --- EDIT MODE --- // */}
                    {isEditing ? (
                        <>
                            {/* Type Selection */}
                            <div className="space-y-2">
                                <Label>ประเภทรายการ</Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button type="button" onClick={() => handleChange("type", "income")} className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 ${formInput.type === "income" ? "bg-green-50 border-green-400 text-green-700 shadow-sm" : "bg-white border-gray-200 hover:border-gray-400"}`}>
                                        <TrendingUp className="w-6 h-6 mb-2" />
                                        <span className="font-medium">รายรับ</span>
                                    </button>
                                    <button type="button" onClick={() => handleChange("type", "expense")} className={`flex flex-col items-center p-5 rounded-xl border transition-all duration-200 ${formInput.type === "expense" ? "bg-red-50 border-red-400 text-red-700 shadow-sm" : "bg-white border-gray-200 hover:border-gray-400"}`}>
                                        <TrendingDown className="w-6 h-6 mb-2" />
                                        <span className="font-medium">รายจ่าย</span>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                {/* Amount */}
                                <div className="space-y-1 w-1/2">
                                    <Label htmlFor="amount">จำนวนเงิน</Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">฿</span>
                                        <Input id="amount" type="number" value={formInput.amount || ''} onChange={(e) => handleChange("amount", parseFloat(e.target.value) || 0)} placeholder="0.00" className="pl-9 h-12 text-lg rounded-xl"/>
                                    </div>
                                </div>
                                {/* Category */}
                                <div className="space-y-1 w-1/2">
                                    <Label htmlFor="category">หมวดหมู่</Label>
                                    <Select   value={formInput.category} onValueChange={(v) => handleChange("category", v)}>
                                        <SelectTrigger  className=" w-full rounded-xl">
                                            <SelectValue placeholder="เลือกหมวดหมู่" />
                                        </SelectTrigger>
                                        <SelectContent  >
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
                                <Label htmlFor="description">รายละเอียด</Label>
                                <Textarea id="description" value={formInput.description || ''} onChange={(e) => handleChange("description", e.target.value)} placeholder="อธิบายเพิ่มเติม..." className="min-h-[100px] rounded-xl"/>
                            </div>

                             {/* Date */}
                            <div className="space-y-1">
                                <Label htmlFor="date">วันที่และเวลา</Label>
                                <Input id="date" type="datetime-local" value={formInput.created_at} onChange={(e) => handleChange("created_at", e.target.value)} className="h-12 rounded-xl"/>
                            </div>
                        </>
                    ) : (
                    
                    // --- VIEW MODE --- //
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">ประเภท:</span> <Badge variant={originalTransaction.type === 'income' ? 'default' : 'destructive'}>{originalTransaction.type == 'expense' ? 'รายจ่าย' : "รายรับ"}</Badge></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">จำนวนเงิน:</span> <span className={`font-semibold ${originalTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{originalTransaction.amount.toLocaleString()} ฿</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">หมวดหมู่:</span> <span>{originalTransaction.category}</span></div>
                        <div className="flex justify-between items-center"><span className="text-muted-foreground">วันที่:</span> <span>{new Date(originalTransaction.created_at).toLocaleString('th-TH')}</span></div>
                        <div>
                            <p className="text-muted-foreground">รายละเอียด:</p>
                            <p className="mt-1 p-3 bg-slate-50 rounded-md">{originalTransaction.description || 'ไม่มีรายละเอียด'}</p>
                        </div>
                    </div>
                    )}
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="ghost" onClick={handleCancelEdit} disabled={isSaving}>
                                <X className="mr-2 h-4 w-4" />
                                ยกเลิก
                            </Button>
                            <Button onClick={handleUpdate} disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                แก้ไข
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* Delete Button with Confirmation */}
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDeleting}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        ลบ
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>คุณแน่ใจหรือไม่?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            การกระทำนี้ไม่สามารถย้อนกลับได้ ระบบจะลบรายการนี้ออกจากฐานข้อมูลอย่างถาวร
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                            {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                            ใช่, ลบเลย
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <Button onClick={() => setIsEditing(true)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                แก้ไข
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}

function TransactionDetailSkeleton() {
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
function TransactionNotFound({ transactionId }: { transactionId: string }) {
    const router = useRouter();
    return (
        <div className="container mx-auto max-w-2xl py-8 text-center">
            <Card className="p-8 flex flex-col items-center space-y-4">
                <Frown className="w-16 h-16 text-gray-500" />
                <CardTitle className="text-2xl">ไม่พบรายการ</CardTitle>
                <CardDescription>
                    ขออภัย, ไม่พบรายการธุรกรรมสำหรับ ID: <span className="font-semibold text-red-500">{transactionId}</span>
                </CardDescription>
                <Button onClick={() => router.push('/history')}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    กลับไปหน้ารายการ
                </Button>
            </Card>
        </div>
    );
}   