import { useState, useEffect } from "react";
import { db } from "@/src/lib/firebase";
import { collection, query, where, onSnapshot, doc, updateDoc, setDoc } from "firebase/firestore";
import { Need, Volunteer, NeedStatus, NeedUrgency } from "@/src/types";
import { Sparkles, Users, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { matchVolunteerWithNeed } from "@/src/services/gemini";
import { motion, AnimatePresence } from "motion/react";

export default function AIDashboard() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [matching, setMatching] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<{ needId: string, volunteerId: string, result: any } | null>(null);

  useEffect(() => {
    const q = query(collection(db, "needs"), where("status", "==", NeedStatus.OPEN));
    const vq = collection(db, "volunteers");

    const unsubscribeNeeds = onSnapshot(q, (snapshot) => {
      setNeeds(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Need)));
    });

    const unsubscribeVols = onSnapshot(vq, (snapshot) => {
      setVolunteers(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Volunteer)));
    });

    return () => {
      unsubscribeNeeds();
      unsubscribeVols();
    };
  }, []);

  const handleMatch = async (need: Need) => {
    if (volunteers.length === 0) return alert("No volunteers available for matching.");
    
    setMatching(need.id);
    setMatchResult(null);
    try {
      const result = await matchVolunteerWithNeed(need, volunteers);
      // The result.bestVolunteerId is 1-based index string from prompt
      const volIndex = parseInt(result.bestVolunteerId) - 1;
      const bestVol = volunteers[volIndex];
      
      setMatchResult({
        needId: need.id,
        volunteerId: bestVol?.id || "",
        result
      });
    } catch (error) {
      console.error("Match failed:", error);
    } finally {
      setMatching(null);
    }
  };

  const confirmMatch = async () => {
    if (!matchResult) return;
    try {
      await updateDoc(doc(db, "needs", matchResult.needId), {
        status: NeedStatus.MATCHED
      });
      // Create a match record
      await setDoc(doc(collection(db, "matches")), {
        needId: matchResult.needId,
        volunteerId: matchResult.volunteerId,
        reasoning: matchResult.result.reasoning,
        status: "accepted",
        createdAt: Date.now()
      });
      setMatchResult(null);
    } catch (error) {
      console.error("Confirmation failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
          <Clock className="text-blue-500" size={16} />
          Volunteer Dashboard
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
          <Users size={12} />
          <span>{volunteers.length} Active in Network</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {needs.map((need) => (
            <motion.div
              key={need.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="dark-card p-4 flex flex-col group relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter ${
                  need.urgency === NeedUrgency.HIGH ? 'bg-red-500/10 text-red-500' :
                  need.urgency === NeedUrgency.MEDIUM ? 'bg-orange-500/10 text-orange-500' :
                  'bg-green-500/10 text-green-500'
                }`}>
                  {need.urgency}
                </span>
                <span className="text-[10px] text-slate-600 font-medium">
                  {new Date(need.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                {need.title}
              </h3>
              <p className="text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                {need.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-4 mt-auto">
                <AlertTriangle size={12} />
                <span>{need.location}</span>
              </div>

              {matchResult?.needId === need.id ? (
                 <div className="space-y-3 pt-3 border-t border-border-subtle">
                    <div className="bg-bg-dark border border-blue-500/30 p-3 rounded-lg">
                      <div className="flex items-baseline justify-between mb-1">
                        <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">
                          Optimal Recommendation
                        </p>
                      </div>
                      <p className="text-xs font-bold text-white mb-1">
                        {matchResult.result.bestVolunteerName}
                      </p>
                      <p className="text-[10px] text-slate-400 italic leading-relaxed">
                        "{matchResult.result.reasoning}"
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={confirmMatch}
                        className="dark-button-primary py-2 text-xs"
                      >
                        Confirm Match
                      </button>
                      <button 
                         onClick={() => setMatchResult(null)}
                         className="dark-button-secondary py-2 text-xs"
                      >
                        Decline
                      </button>
                    </div>
                 </div>
              ) : (
                <button
                  id={`match-btn-${need.id}`}
                  onClick={() => handleMatch(need)}
                  disabled={!!matching}
                  className="w-full py-2 bg-blue-600/10 hover:bg-blue-600 transition-all text-blue-500 hover:text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"
                >
                   {matching === need.id ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles size={14} />
                      </motion.div>
                   ) : <Sparkles size={14} />}
                   {matching === need.id ? "Analyzing..." : "Run AI Match"}
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {needs.length === 0 && (
        <div className="text-center py-16 dark-card border-dashed bg-transparent border-slate-800">
          <CheckCircle className="mx-auto text-slate-800 mb-3" size={32} />
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest text-[10px]">No active crisis reports</p>
        </div>
      )}
    </div>
  );
}
