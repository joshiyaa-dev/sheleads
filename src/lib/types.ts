export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'remote';
  salary?: string;
  description: string;
  requirements: string[];
  postedISO: string;
  companyId: string;
  womenPreferred: boolean;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  diversityScore: number; // 1-10
  verified: boolean;
}

export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  skills: string[];
  experience: string[];
  education: string[];
  photoEncrypted?: string; // base64 AES-GCM encrypted
  photoIV?: string;
  photoSalt?: string;
  voiceVerified: boolean;
  createdAt: string;
  preferences: {
    jobTypes: string[];
    remoteOk: boolean;
    minSalary?: number;
    locations: string[];
  };
}

export interface Application {
  id: string;
  jobId: string;
  profileId: string;
  status: 'applied' | 'viewed' | 'interview' | 'offered' | 'declined';
  appliedAt: string;
  voiceNote?: string; // base64 encrypted audio
}

export interface VoiceSearch {
  transcript: string;
  confidence: number;
  timestamp: number;
}

export interface SheLeadsState {
  jobs: Job[];
  companies: Company[];
  profile: Profile | null;
  applications: Application[];
  savedJobs: string[];
  voiceHistory: VoiceSearch[];
  settings: {
    voiceEnabled: boolean;
    accessibilityMode: boolean;
    reducedMotion: boolean;
    encryptPhotos: boolean;
  };
}
