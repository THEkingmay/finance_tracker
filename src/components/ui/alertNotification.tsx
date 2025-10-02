import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect } from "react";

type AlertType = {
  alertType: "success" | "error";
  head: string;
  description: string;
  clear: () => void;
};

export default function AlertNotification({ alertType, head, description, clear }: AlertType) {
  useEffect(() => {
    const timer = setTimeout(() => clear(), 3000);
    return () => clearTimeout(timer);
  }, [clear]); // แค่ clear พอ

  const alertClass =
    alertType === "success"
      ? "bg-green-100 border border-green-400 text-green-700"
      : "bg-red-100 border border-red-400 text-red-700";

  return (
    <Alert className={`max-w-[400px] absolute top-16 left-2 ${alertClass}`}>
      <AlertTitle>{head}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

export type { AlertType };
