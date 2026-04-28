import { User, LogIn, LogOut, Heart } from "lucide-react";
import { auth, googleProvider } from "@/src/lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { motion } from "motion/react";

export default function Navbar() {
  const [user] = useAuthState(auth);

  const login = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  return (
    <nav className="h-16 border-b border-border-subtle bg-bg-header px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <h1 className="text-xl font-bold text-white tracking-tight">AidSync <span className="text-blue-500">AI</span></h1>
          <span className="hidden xs:block text-[10px] uppercase tracking-widest text-slate-500 font-bold border border-slate-800 px-2 py-0.5 rounded">GDG Challenge 2026</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 py-1 px-3 bg-bg-dark rounded-full border border-border-subtle">
              <img src={user.photoURL || ""} alt="" className="w-6 h-6 rounded-full" />
              <span className="hidden sm:block text-xs font-bold text-white">{user.displayName}</span>
            </div>
            <button 
              onClick={logout}
              className="text-slate-400 hover:text-white transition-colors p-2"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={login}
            className="dark-button-primary px-6"
            id="login-btn"
          >
            <LogIn size={18} />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}
