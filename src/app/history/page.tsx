'use client'

import { useEffect, useState, Fragment } from "react";
import GlobalNavbar from "@/components/globalNavbar";
import { Calendar } from "@/components/ui/calendar";
import AlertNotification, { AlertType } from "@/components/ui/alertNotification";
import { transaction } from "@/type/allType";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";
import { DropdownDate } from "./components/DropdownDate";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

function SelectDayHistory({ selDate }: { selDate: Date | undefined }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<transaction[]>([]);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  useEffect(() => {
    if (!selDate) return;
    const getTodayHistory = async () => {
      setLoading(true);
      const today = `${selDate.getFullYear()}-${String(selDate.getMonth() + 1).padStart(2, '0')}-${String(selDate.getDate()).padStart(2, '0')}`;
      try {
        const res = await fetch(`/api/transactions/${today}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        setItems(result.data || []);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setAlert({
          alertType: "error",
          head: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถดึงข้อมูลรายการวันนี้ได้ กรุณาลองใหม่อีกครั้ง",
          clear: () => setAlert(null),
        });
      } finally {
        setLoading(false);
      }
    };
    getTodayHistory();
  }, [selDate]);

  const dateText = selDate
    ? new Intl.DateTimeFormat("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(selDate)
    : "—";

  // ✅ จัดกลุ่มตามหมวดหมู่
  const groupedItems = items.reduce((acc: Record<string, transaction[]>, item) => {
    const category = item.category || "ไม่ระบุ";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  // ✅ คำนวณยอดรวมทั้งวัน
  const totalIncome = items
    .filter((i) => i.type === "income")
    .reduce((sum, i) => sum + i.amount, 0);

  const totalExpense = items
    .filter((i) => i.type === "expense")
    .reduce((sum, i) => sum + i.amount, 0);

  const netTotal = totalIncome - totalExpense;

  return (
    <div className="flex-1 p-4 rounded-xl w-full">
      {alert && <AlertNotification {...alert} />}

      <h2 className="text-2xl font-semibold mb-4 mt-4">
        รายการวันที่ {dateText}
      </h2>

      {/* ✅ ส่วนสรุปยอดรวมทั้งวัน */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-green-50 border border-green-100 rounded-xl text-center shadow-sm">
          <p className="text-sm text-gray-600">รายรับทั้งหมด</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            +{totalIncome.toLocaleString()} บาท
          </p>
        </div>
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-center shadow-sm">
          <p className="text-sm text-gray-600">รายจ่ายทั้งหมด</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            -{totalExpense.toLocaleString()} บาท
          </p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-center shadow-sm">
          <p className="text-sm text-gray-600">ยอดสุทธิ</p>
          <p
            className={`text-2xl font-bold mt-1 ${
              netTotal >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {netTotal >= 0 ? "+" : "-"}
            {Math.abs(netTotal).toLocaleString()} บาท
          </p>
        </div>
      </div>

      {/* ✅ รายการแต่ละหมวด */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-gray-500">
          <Loader2 className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
        </div>
      ) : items.length === 0 ? (
        <div className="text-center text-gray-400 py-10">ไม่มีรายการในวันนี้</div>
      ) : (
        <div className="space-y-5">
          {Object.keys(groupedItems).map((category) => {
            const catItems = groupedItems[category];
            const catTotal = catItems.reduce(
              (sum, i) => (i.type === "income" ? sum + i.amount : sum - i.amount),
              0
            );

            return (
              <Collapsible
                key={category}
                open={openCategory === category}
                onOpenChange={() =>
                  setOpenCategory(openCategory === category ? null : category)
                }
                className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-md transition"
              >
                <CollapsibleTrigger className="w-full flex justify-between items-center p-5 text-lg font-medium text-gray-700 hover:bg-gray-50 rounded-2xl">
                  <div className="flex flex-col items-start">
                    <span className="text-base font-semibold">{category}</span>
                    <span className="text-sm text-gray-500">
                      {catItems.length} รายการ
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-bold ${
                        catTotal >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {catTotal >= 0 ? "+" : "-"}
                      {Math.abs(catTotal).toLocaleString()} บาท
                    </span>
                    {openCategory === category ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent className="border-t border-gray-100 p-4 bg-gray-50/50 rounded-b-2xl space-y-3">
                  {catItems.map((item, idx) => (
                    <Fragment key={item.id}>
                      <div
                        className={`flex justify-between items-center p-3 rounded-lg bg-white shadow-sm border ${
                          item.type === "income"
                            ? "border-green-100"
                            : "border-red-100"
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-800">
                            {item.description || "—"}
                          </div>
                          <div className="text-xs text-gray-500">
                  {new Date(item.created_at ).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                        <div
                          className={`font-semibold ${
                            item.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {item.type === "income" ? "+" : "-"}
                          {item.amount.toLocaleString()} บาท
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function HistoryPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100">
      <GlobalNavbar />
      <div className="max-w-6xl mx-auto p-6 md:flex gap-8">
        <div className="px-4 rounded-xl block md:hidden w-fit">
          <DropdownDate date={date} setDate={setDate} />
        </div>
        <div className="p-4 rounded-xl hidden md:block w-fit">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm"
            captionLayout="dropdown"
          />
        </div>
        <SelectDayHistory selDate={date} />
      </div>
    </div>
  );
}
