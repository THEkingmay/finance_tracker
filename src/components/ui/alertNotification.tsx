import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

type AlertType = {
  alertType: "success" | "error";
  head: string;
  description: string;
  clear: () => void;
};

export default function AlertNotification({
  alertType,
  head,
  description,
  clear,
}: AlertType) {
  useEffect(() => {
    const timer = setTimeout(() => clear(), 3000);
    return () => clearTimeout(timer);
  }, [clear]);

  const isError = alertType === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <Alert
      className={`max-w-[250]  md:max-w-[400px] fixed top-20 right-5 z-[9999] flex items-start gap-2 border-2
        ${isError ? "border-red-500 bg-red-50" : "border-green-500 bg-green-50"}`}
    >
      <Icon className={`h-5 w-5 mt-0.5 ${isError ? "text-red-500" : "text-green-500"}`} />
      <div>
        <AlertTitle className={isError ? "text-red-700" : "text-green-700"}>
          {head}
        </AlertTitle>
        <AlertDescription className="hidden md:block">{description}</AlertDescription>
      </div>
    </Alert>
  );
}

export type { AlertType };
