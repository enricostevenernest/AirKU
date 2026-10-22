// Halaman /feedback diarahkan ke /kritik-saran
// Sidebar menggunakan path "/feedback" untuk menu Kritik & Saran
import { redirect } from "next/navigation";

export default function FeedbackPage() {
  redirect("/kritik-saran");
}
