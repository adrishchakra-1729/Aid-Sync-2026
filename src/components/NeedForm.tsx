import React, { useState } from "react";
import { db, auth } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { NeedUrgency, NeedStatus } from "@/src/types";
import { AlertCircle, MapPin, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function NeedForm({ onSuccess }: { onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    urgency: NeedUrgency.MEDIUM,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "needs"), {
        ...formData,
        status: NeedStatus.OPEN,
        reporterId: auth.currentUser.uid,
        createdAt: Date.now(),
      });
      setFormData({ title: "", description: "", location: "", urgency: NeedUrgency.MEDIUM });
      onSuccess?.();
    } catch (error) {
      console.error("Error reporting need:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="dark-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500">
          <AlertCircle size={20} />
        </div>
        <h2 className="text-sm font-semibold text-white tracking-tight uppercase">Need Reporter</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Headline</label>
          <input
            id="need-title"
            required
            placeholder="Crisis title..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="dark-input w-full"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
            <input
              id="need-location"
              required
              placeholder="District / Sector"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="dark-input w-full pl-9"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500">Urgency Level</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.values(NeedUrgency)).map((urg) => (
              <button
                key={urg}
                type="button"
                onClick={() => setFormData({ ...formData, urgency: urg })}
                className={`py-2 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                  formData.urgency === urg
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-bg-dark border-border-subtle text-slate-500 hover:border-slate-700'
                }`}
              >
                {urg}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1.5">Description</label>
          <textarea
            id="need-desc"
            required
            rows={3}
            placeholder="Detailed requirements..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="dark-input w-full resize-none"
          />
        </div>

        <button
          id="submit-need"
          type="submit"
          disabled={loading}
          className="dark-button-primary w-full py-2.5"
        >
          <Send size={16} />
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </motion.div>
  );
}
