export enum NeedUrgency {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high"
}

export enum NeedStatus {
  OPEN = "open",
  MATCHED = "matched",
  RESOLVED = "resolved"
}

export interface Need {
  id: string;
  title: string;
  description: string;
  location: string;
  urgency: NeedUrgency;
  status: NeedStatus;
  reporterId: string;
  createdAt: number;
}

export interface Volunteer {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  bio: string;
  skills: string[];
  availability: string;
  photoURL?: string;
}

export interface Match {
  id: string;
  needId: string;
  volunteerId: string;
  reasoning: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: number;
}
