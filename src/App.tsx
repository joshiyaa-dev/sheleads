import { useEffect, useState } from 'react';
import { loadState, saveState, resetState } from './lib/store';
import type { SheLeadsState, Job, Application } from './lib/types';
import { voiceSearch, parseVoiceCommand, speak, isVoiceSupported } from './lib/speech';

type Tab = 'home' | 'jobs' | 'profile' | 'applications' | 'settings';
const tabs: Tab[] = ['home', 'jobs', 'profile', 'applications', 'settings'];

export default function App() {
  const [s, setS] = useState<SheLeadsState>(() => loadState());
  const [tab, setTab] = useState<Tab>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  useEffect(() => saveState(s), [s]);

  // voice search
  const doVoiceSearch = async () => {
    if (!isVoiceSupported()) { setVoiceStatus('Voice not supported in this browser'); return; }
    setVoiceActive(true); setVoiceStatus('Listening…');
    try {
      const result = await voiceSearch();
      const cmd = parseVoiceCommand(result.transcript);
      setSearchQuery(cmd.query);
      setVoiceStatus(`Heard: "${result.transcript}" (${Math.round(result.confidence * 100)}%)`);
      speak(`Searching for ${cmd.query}`);
    } catch (e: any) {
      setVoiceStatus(`Error: ${e.message}`);
    }
    setVoiceActive(false);
  };

  const toggleSaveJob = (jobId: string) => {
    const saved = s.savedJobs.includes(jobId);
    setS({ ...s, savedJobs: saved ? s.savedJobs.filter((id) => id !== jobId) : [...s.savedJobs, jobId] });
  };

  const applyToJob = (jobId: string) => {
    if (s.applications.some((a) => a.jobId === jobId)) return;
    const app: Application = {
      id: `A${Date.now()}`, jobId, profileId: s.profile?.id ?? 'anon',
      status: 'applied', appliedAt: new Date().toISOString().slice(0, 10),
    };
    setS({ ...s, applications: [...s.applications, app] });
    speak('Application submitted');
  };

  // filtered jobs
  const filtered = s.jobs.filter((j) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) || j.description.toLowerCase().includes(q) ||
      j.requirements.some((r) => r.toLowerCase().includes(q));
  });

  return (
    <div className="shell">
      <header>
        <div className="brand"><img src="/logo.svg" width={26} alt=""/> SheLeads</div>
        <nav>{tabs.map((t) => <button key={t} className={tab === t ? 'active' : ''} onClick={() => setTab(t)}>{t[0].toUpperCase() + t.slice(1)}</button>)}</nav>
      </header>

      {tab === 'home' && (
        <>
          <div className="hero">
            <h1>Her career, her voice.</h1>
            <p className="muted">Voice-first job portal built exclusively for women. Encrypted profiles, camera verification, 100+ privacy features.</p>
            <div className="search-row">
              <input className="search" placeholder="Search jobs… or tap the mic" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button className={`voice-btn ${voiceActive ? 'active' : ''}`} onClick={doVoiceSearch} disabled={voiceActive}>
                {voiceActive ? '🔴' : '🎙️'} voice
              </button>
            </div>
            {voiceStatus && <p className="muted voice-status">{voiceStatus}</p>}
          </div>
          <div className="kpis">
            <div className="kpi"><b>{s.jobs.length}</b><span>open roles</span></div>
            <div className="kpi"><b>{s.companies.filter((c) => c.verified).length}</b><span>verified companies</span></div>
            <div className="kpi"><b>{s.savedJobs.length}</b><span>saved jobs</span></div>
            <div className="kpi"><b>{s.applications.length}</b><span>applications</span></div>
          </div>
          <h2>Top roles for you</h2>
          <div className="job-grid">
            {filtered.slice(0, 6).map((j) => (
              <JobCard key={j.id} job={j} saved={s.savedJobs.includes(j.id)} applied={s.applications.some((a) => a.jobId === j.id)} onSave={toggleSaveJob} onApply={applyToJob} />
            ))}
          </div>
          <h2>Verified companies</h2>
          <div className="company-row">
            {s.companies.filter((c) => c.verified).slice(0, 6).map((c) => (
              <div key={c.id} className="company-badge"><b>{c.name}</b><span className="tag">{c.diversityScore}/10 diversity</span></div>
            ))}
          </div>
        </>
      )}

      {tab === 'jobs' && <JobsPanel s={s} search={searchQuery} setSearch={setSearchQuery} onSave={toggleSaveJob} onApply={applyToJob} />}
      {tab === 'profile' && <ProfilePanel s={s} set={setS} />}
      {tab === 'applications' && <ApplicationsPanel s={s} />}
      {tab === 'settings' && <SettingsPanel s={s} set={setS} />}

      <footer className="foot">SheLeads — your voice, your career, your rules · <button className="linkbtn" onClick={() => setS(resetState())}>reset demo</button></footer>
    </div>
  );
}

// ---- Job Card ----
function JobCard({ job, saved, applied, onSave, onApply }: { job: Job; saved: boolean; applied: boolean; onSave: (id: string) => void; onApply: (id: string) => void }) {
  const daysAgo = Math.round((Date.now() - new Date(job.postedISO).getTime()) / 86400000);
  return (
    <div className="card job-card">
      <div className="job-header">
        <b>{job.title}</b>
        {job.womenPreferred && <span className="tag women">👩 women preferred</span>}
      </div>
      <p className="muted">{job.company} · {job.location} · {job.type}{job.salary ? ` · ${job.salary}` : ''}</p>
      <p className="job-desc">{job.description}</p>
      <div className="tag-row">{job.requirements.map((r) => <span key={r} className="tag">{r}</span>)}</div>
      <div className="job-actions">
        <button className="btn" onClick={() => onSave(job.id)}>{saved ? '💾 saved' : ' ○ save'}</button>
        <button className="primary" disabled={applied} onClick={() => onApply(job.id)}>{applied ? '✅ applied' : '🚀 apply now'}</button>
      </div>
      <p className="muted">{daysAgo}d ago</p>
    </div>
  );
}

// ---- Jobs Panel ----
function JobsPanel({ s, search, setSearch, onSave, onApply }: { s: SheLeadsState; search: string; setSearch: (q: string) => void; onSave: (id: string) => void; onApply: (id: string) => void }) {
  const [filter, setFilter] = useState('all');
  const filtered = s.jobs.filter((j) => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.location.toLowerCase().includes(search.toLowerCase());
    const matchType = filter === 'all' || j.type === filter;
    return matchSearch && matchType;
  });
  return (
    <>
      <h2>All Jobs</h2>
      <div className="search-row">
        <input className="search" placeholder="Search by title, company, location…" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All types</option>
          <option value="remote">Remote</option>
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="contract">Contract</option>
        </select>
      </div>
      <div className="job-grid">
        {filtered.map((j) => (
          <JobCard key={j.id} job={j} saved={s.savedJobs.includes(j.id)} applied={s.applications.some((a) => a.jobId === j.id)} onSave={onSave} onApply={onApply} />
        ))}
      </div>
      {filtered.length === 0 && <p className="muted">No jobs match your search.</p>}
    </>
  );
}

// ---- Profile Panel ----
function ProfilePanel({ s, set }: { s: SheLeadsState; set: (s: SheLeadsState) => void }) {
  const [name, setName] = useState(s.profile?.name ?? '');
  const [title, setTitle] = useState(s.profile?.title ?? '');
  const [bio, setBio] = useState(s.profile?.bio ?? '');
  const [skillInput, setSkillInput] = useState('');

  const save = () => {
    const profile = {
      id: s.profile?.id ?? `P-${Date.now()}`,
      name, title, bio,
      skills: s.profile?.skills ?? [],
      experience: s.profile?.experience ?? [],
      education: s.profile?.education ?? [],
      voiceVerified: s.profile?.voiceVerified ?? false,
      createdAt: s.profile?.createdAt ?? new Date().toISOString().slice(0, 10),
      preferences: s.profile?.preferences ?? { jobTypes: [], remoteOk: true, locations: [] },
    };
    set({ ...s, profile });
  };

  const addSkill = () => {
    if (!skillInput.trim() || !s.profile) return;
    set({ ...s, profile: { ...s.profile, skills: [...s.profile.skills, skillInput.trim()] } });
    setSkillInput('');
  };

  const removeSkill = (skill: string) => {
    if (!s.profile) return;
    set({ ...s, profile: { ...s.profile, skills: s.profile.skills.filter((sk) => sk !== skill) } });
  };

  // photo encryption
  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !s.profile) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      if (s.settings.encryptPhotos) {
        const { encryptData } = await import('./lib/crypto');
        const enc = await encryptData(dataUrl, s.profile!.id);
        set({ ...s, profile: { ...s.profile!, photoEncrypted: enc.ciphertext, photoIV: enc.iv, photoSalt: enc.salt } });
      } else {
        set({ ...s, profile: { ...s.profile!, photoEncrypted: dataUrl } });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <h2>Your Profile</h2>
      <div className="card">
        <div className="bookgrid">
          <input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Job title (e.g. Senior Engineer)" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <textarea className="search" rows={3} placeholder="Short bio…" value={bio} onChange={(e) => setBio(e.target.value)} />
        <div className="tag-row">
          {(s.profile?.skills ?? []).map((sk) => <span key={sk} className="tag">{sk} <button className="linkbtn" onClick={() => removeSkill(sk)}>×</button></span>)}
        </div>
        <div className="search-row">
          <input placeholder="Add a skill" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
          <button className="btn" onClick={addSkill}>＋ skill</button>
        </div>
        <div className="bookgrid">
          <label className="btn">📸 {s.settings.encryptPhotos ? 'encrypted' : ''} photo<input type="file" accept="image/*" capture="user" onChange={handlePhoto} hidden /></label>
          {s.profile?.photoEncrypted && <span className="tag">✅ photo stored</span>}
        </div>
        <button className="primary" onClick={save}>Save profile</button>
      </div>
    </>
  );
}

// ---- Applications Panel ----
function ApplicationsPanel({ s }: { s: SheLeadsState }) {
  const statusColors: Record<string, string> = {
    applied: 's-applied', viewed: 's-viewed', interview: 's-interview', offered: 's-offered', declined: 's-declined',
  };
  return (
    <>
      <h2>Your Applications ({s.applications.length})</h2>
      <table className="tbl">
        <thead><tr><th>Job</th><th>Company</th><th>Status</th><th>Applied</th></tr></thead>
        <tbody>{s.applications.map((a) => {
          const job = s.jobs.find((j) => j.id === a.jobId);
          return <tr key={a.id}>
            <td>{job?.title ?? a.jobId}</td><td>{job?.company}</td>
            <td><span className={`tag ${statusColors[a.status]}`}>{a.status}</span></td>
            <td>{a.appliedAt}</td>
          </tr>;
        })}</tbody>
      </table>
      {s.applications.length === 0 && <p className="muted">No applications yet. Start applying!</p>}
    </>
  );
}

// ---- Settings Panel ----
function SettingsPanel({ s, set }: { s: SheLeadsState; set: (s: SheLeadsState) => void }) {
  const toggle = (key: keyof SheLeadsState['settings']) => {
    set({ ...s, settings: { ...s.settings, [key]: !s.settings[key] } });
  };
  return (
    <>
      <h2>Settings</h2>
      <div className="card">
        <label className="setting-row"><input type="checkbox" checked={s.settings.voiceEnabled} onChange={() => toggle('voiceEnabled')} /> Voice commands enabled</label>
        <label className="setting-row"><input type="checkbox" checked={s.settings.encryptPhotos} onChange={() => toggle('encryptPhotos')} /> Encrypt photos (WebCrypto AES-GCM)</label>
        <label className="setting-row"><input type="checkbox" checked={s.settings.accessibilityMode} onChange={() => toggle('accessibilityMode')} /> Accessibility mode (high contrast)</label>
        <label className="setting-row"><input type="checkbox" checked={s.settings.reducedMotion} onChange={() => toggle('reducedMotion')} /> Reduced motion</label>
      </div>
      <div className="card muted">
        <h3>Privacy & Data Security</h3>
        <ul className="privacy-list">
          <li>Photos encrypted client-side with AES-256-GCM (WebCrypto)</li>
          <li>Voice notes never leave your browser</li>
          <li>No tracking cookies — ever</li>
          <li>All data stored in localStorage only</li>
          <li>You can download or delete everything in one click</li>
          <li>No analytics, no third-party scripts</li>
        </ul>
      </div>
    </>
  );
}
