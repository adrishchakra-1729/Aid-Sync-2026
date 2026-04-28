import { useState, useEffect } from "react";
import Navbar from "@/src/components/Navbar";
import NeedForm from "@/src/components/NeedForm";
import AIDashboard from "@/src/components/AIDashboard";
import VolunteerProfileForm from "@/src/components/VolunteerProfileForm";
import { auth, db, googleProvider } from "@/src/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Globe, Shield, MessageSquare, ArrowRight } from "lucide-react";

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [isVolunteer, setIsVolunteer] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'needs' | 'volunteer'>('needs');

  useEffect(() => {
    async function checkVolunteerStatus() {
      if (user) {
        const docRef = doc(db, "volunteers", user.uid);
        const docSnap = await getDoc(docRef);
        setIsVolunteer(docSnap.exists());
      } else {
        setIsVolunteer(null);
      }
    }
    checkVolunteerStatus();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="text-indigo-600"
        >
          <Sparkles size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-dark text-slate-300 font-sans selection:bg-blue-500/30 selection:text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {!user ? (
          <div className="text-center py-12 md:py-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-8">
                <Sparkles size={12} />
                Next-Gen Crisis Coordination
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-white">
                AidSync <span className="text-blue-600">AI</span>
              </h1>
              
              <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                Smarter crisis response. Gemini 1.5 Flash matches urgency with availability in real-time, ensuring help reaches where it's needed most.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                {[
                  { icon: Globe, title: "Global Network", desc: "Unified response protocol." },
                  { icon: Shield, title: "Secure Infra", desc: "Enterprise-grade reliability." },
                  { icon: MessageSquare, title: "Gemini Match", desc: "Intelligent skill mapping." }
                ].map((feature, i) => (
                  <div key={i} className="dark-card p-6 text-left group hover:border-blue-500/50 transition-colors">
                    <feature.icon className="text-blue-500 mb-4 transition-transform group-hover:scale-110" size={20} />
                    <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">{feature.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => auth.currentUser ? null : signInWithPopup(auth, googleProvider)}
                  className="dark-button-primary px-10 py-3 rounded-full text-base shadow-xl shadow-blue-600/20"
                >
                  Get Started <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Sidebar Controls */}
            <div className="lg:col-span-4 space-y-6">
              <NeedForm onSuccess={() => setActiveTab('needs')} />
              
              {isVolunteer === false && (
                <VolunteerProfileForm onSuccess={() => setIsVolunteer(true)} />
              )}

              {isVolunteer === true && (
                <div className="dark-card p-6 border-l-4 border-l-green-600">
                  <div className="flex items-center gap-3 mb-2">
                     <Shield className="text-green-500" size={20} />
                     <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Roster</h2>
                  </div>
                  <p className="text-slate-400 text-xs font-medium leading-relaxed">
                    System active. AI Matcher is processing your profile for incoming crisis reports.
                  </p>
                </div>
              )}
              
              <div className="dark-card p-5 bg-[#0c0e12]/50">
                 <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-widest mb-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                   System Status
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-600">Firestore</span>
                      <span className="text-blue-500">Connected</span>
                    </div>
                    <div className="flex justify-between text-[10px]">
                      <span className="text-slate-600">Gemini AI</span>
                      <span className="text-blue-500">Online</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-8">
              <AIDashboard />
            </div>
          </div>
        )}
      </main>

      <footer className="h-14 bg-bg-header border-t border-border-subtle px-6 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
        <div className="flex gap-4">
          <p>© 2026 AidSync Global</p>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-blue-400 transition">Transparency</a>
          <a href="#" className="hover:text-blue-400 transition">Privacy</a>
        </div>
      </footer>
    </div>
  );
}
