import React, { useState } from "react";
import { db, auth } from "@/src/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Users, Info, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export default function VolunteerProfileForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    availability: "Available now",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "volunteers", auth.currentUser.uid), {
        userId: auth.currentUser.uid,
        displayName: auth.currentUser.displayName || "Anonymous",
        email: auth.currentUser.email || "",
        photoURL: auth.currentUser.photoURL || "",
        bio: formData.bio,
        skills: formData.skills.split(",").map(s => s.trim()).filter(s => s.length > 0),
        availability: formData.availability,
        createdAt: Date.now()
      });
      onSuccess?.();
    } catch (error) {
      console.error("Error creating volunteer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="dark-card p-6 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-2xl" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
            <Users size={20} />
          </div>
          <h2 className="text-sm font-semibold text-white tracking-tight uppercase">Become a Volunteer</h2>
        </div>

        <p className="text-slate-500 text-[10px] mb-6 leading-relaxed uppercase font-bold tracking-tighter">
          Join our community of responders and crisis specialists.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Short Bio</label>
            <textarea
              required
              rows={2}
              placeholder="Your background..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="dark-input w-full resize-none"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Skills (Comma separated)</label>
            <input
              required
              placeholder="e.g. First Aid, Logistics"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="dark-input w-full"
            />
          </div>

          <button
            id="register-volunteer"
            type="submit"
            disabled={loading}
            className="dark-button-primary w-full py-2.5"
          >
            <ShieldCheck size={16} />
            {loading ? "Registering..." : "Join Active Roster"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}
