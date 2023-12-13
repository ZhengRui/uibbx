import Header from "@/components/Header";
import Landing from "@/components/Landing";
import Footer from "@/components/Footer";
import AuthPanel from "@/components/AuthPanel";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main>
      <Header />
      <AuthPanel />
      <Landing />
      <Footer />
      <Toaster />
    </main>
  );
}
