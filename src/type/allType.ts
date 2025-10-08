type transaction = {
  id:string ,
  uid: string
  amount: number
  type: "income" | "expense"
  description?: string
  category?: string
  created_at: string
}
type FormInput = {
  amount: number
  type: "income" | "expense"
  description: string
  category: string
  date: string
}


export type {transaction  , FormInput}