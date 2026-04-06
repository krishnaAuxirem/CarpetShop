import { Bell } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const Notifications = () => {
  const { isAuthenticated } = useAuthStore();

  const NOTIFS = [
    { id: "n1", title: "Order Delivered!", message: "Your Royal Persian Medallion has been delivered.", type: "order", time: "2 hours ago", read: false },
    { id: "n2", title: "Monsoon Sale!", message: "Get up to 50% off on selected carpets. Use code CARPET50.", type: "offer", time: "1 day ago", read: false },
    { id: "n3", title: "Order Shipped", message: "Your order ORD-2024-002 has been shipped and is on its way.", type: "order", time: "3 days ago", read: true },
    { id: "n4", title: "New Arrivals", message: "Check out our latest collection of Kashmiri silk carpets.", type: "system", time: "1 week ago", read: true },
  ];

  return (
    <div className="page-transition pt-16">
      <div className="bg-muted border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <h1 className="font-heading text-2xl font-bold">Notifications</h1>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-3">
          {NOTIFS.map(n => (
            <div key={n.id} className={`bg-card border rounded-xl p-4 flex items-start gap-4 ${!n.read ? "border-primary/30 bg-primary/5" : "border-border"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${n.type === "order" ? "bg-blue-100 text-blue-600" : n.type === "offer" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-600"}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{n.title}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
              </div>
              {!n.read && <div className="w-2.5 h-2.5 bg-primary rounded-full mt-1 shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
