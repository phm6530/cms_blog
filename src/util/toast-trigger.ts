import { toast } from "sonner";

export default function toastTrigger({
  alert,
  status,
}: {
  alert: string;
  status: "success" | "error" | "warning";
}) {
  toast.success(alert, {
    style: {
      background: "#1e293b",
      color: "#38bdf8",
    },
  });
}
