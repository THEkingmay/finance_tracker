import { NextRequest, NextResponse } from "next/server"
import supabase from "@/lib/supabase"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  try {
    const formInput = await req.json()
    const { amount, type, description, category, date } = formInput
    // console.log("รับข้อมูล:", formInput)
 
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string }
    const uid = decoded.uid

      const { data, error } = await supabase.from("transactions").insert({
        uid,
        amount,
        type,
        description,
        category,
        created_at : date, // ✅ ชื่อฟิลด์ตรงกับตาราง
      }).select()

    if (error) throw error

    return NextResponse.json({ message: "ok", data })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "invalid body" }, { status: 400 })
  }
}

export async function GET(request : NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const date = searchParams.get('date');
  const id = searchParams.get('id')
  const month = searchParams.get('month');
  const year = searchParams.get('year');

  try {
    const token = (await cookies()).get("token")?.value
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }
    const { uid } = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string };

    if(date && !id){
      const startOfDay = `${date}T00:00:00`
      const endOfDay   = `${date}T23:59:59`

      const { data, error } = await supabase
        .from("transactions") // ตรวจสอบว่าตารางชื่อถูกต้อง
        .select("*")
        .eq("uid", uid)
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay)
        .order("created_at", { ascending: true })
            // console.log(data)

      if (error) {
        throw new Error(error.message);
      }
      return NextResponse.json({ data });

    }else if(id && !date){
      // console.log("get id ")
      
      const {data , error} = await supabase
      .from('transactions')
      .select("*")
      .eq("id" , id)
      if (error) {
        throw new Error(error.message);
      }
      // console.log(data)
      if(data[0].uid !== uid) return NextResponse.json({message : "คุณไม่ใช่เจ้าของรายการนี้"})
      return NextResponse.json({ data });

    }else if(month && year){
      const startOfMonth = `${year}-${month}-01T00:00:00`
      // check if month is 02 ,04 ,06 ,09 ,11
      let endDay = '31' 
      if(month === '02'){
        endDay = '28'
      }else if(['04', '06', '09', '11'].includes(month)){
        endDay = '30'
      }
      const endOfMonth   = `${year}-${month}-${endDay}T23:59:59`
      
      const { data, error } = await supabase
        .from("transactions") // ตรวจสอบว่าตารางชื่อถูกต้อง
        .select("*")
        .eq("uid", uid)
        .gte("created_at", startOfMonth)
        .lte("created_at", endOfMonth)
        .order("created_at", { ascending: true }) 
        // console.log(" month+year " , data)
        if (error) {
        throw new Error(error.message);
      }
      return NextResponse.json({ data });
    }else if(year && !month){ 
      const startOfYear = `${year}-01-01T00:00:00`
      const endOfYear   = `${year}-12-31T23:59:59`
      const { data, error } = await supabase
        .from("transactions") // ตรวจสอบว่าตารางชื่อถูกต้อง
        .select("*")
        .eq("uid", uid)
        .gte("created_at", startOfYear)
        .lte("created_at", endOfYear)
        .order("created_at", { ascending: true }) 
          // console.log(" only year " , data)
      if (error) {
        throw new Error(error.message);
      } 
      return NextResponse.json({ data });
    }else{
      return NextResponse.json({ message: "กรุณาระบุ date หรือ id หรือ month+year หรือ year เท่านั้น" }, { status: 400 })
    }
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "fetch failed" }, { status: 400 })
  }
}


export async function PUT(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { uid } = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string };

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
    }

    // 🔐 **Security Check:** First, verify the user owns the transaction they're trying to update.
    const { data: existingTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("uid")
      .eq("id", id)
      .single();

    if (fetchError || !existingTransaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (existingTransaction.uid !== uid) {
      return NextResponse.json({ message: "Forbidden: You do not own this transaction" }, { status: 403 });
    }

    // If ownership is confirmed, proceed with the update.
    const { data, error } = await supabase
      .from("transactions")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Transaction updated successfully", transaction: data });

  } catch (err) {
    console.error("PUT Error:", err);
    return NextResponse.json({ message: (err as Error) .message || "Failed to update transaction" }, { status: 500 });
  }
}

// --- DELETE a transaction ---
export async function DELETE(req: NextRequest) {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { uid } = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string };

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "Transaction ID is required" }, { status: 400 });
    }

    // 🔐 **Security Check:** Verify ownership before deleting.
    const { data: existingTransaction, error: fetchError } = await supabase
      .from("transactions")
      .select("uid")
      .eq("id", id)
      .single();

    if (fetchError || !existingTransaction) {
        return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    if (existingTransaction.uid !== uid) {
      return NextResponse.json({ message: "Forbidden: You do not own this transaction" }, { status: 403 });
    }

    // If ownership is confirmed, proceed with deletion.
    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("id", id);
      
    if (error) throw error;

    return NextResponse.json({ message: "Transaction deleted successfully" });

  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json({ message:(err as Error).message || "Failed to delete transaction" }, { status: 500 });
  }
}
