import type { Company, Job, SheLeadsState } from './types';

const COMPANIES: Company[] = [
  { id: 'C1', name: 'Asha Technologies', diversityScore: 9, verified: true },
  { id: 'C2', name: 'Lakshmi Health AI', diversityScore: 10, verified: true },
  { id: 'C3', name: 'Sakshi Fintech', diversityScore: 8, verified: true },
  { id: 'C4', name: 'Nari Robotics', diversityScore: 7, verified: true },
  { id: 'C5', name: 'Pragati Climate', diversityScore: 9, verified: true },
  { id: 'C6', name: 'Devi Education', diversityScore: 10, verified: true },
  { id: 'C7', name: 'Shakti Biotech', diversityScore: 8, verified: false },
  { id: 'C8', name: 'Maya Design Co.', diversityScore: 9, verified: true },
];

const soon = (d: number) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().slice(0, 10); };

const JOBS: Job[] = [
  { id: 'J1', title: 'Senior React Engineer', company: 'Asha Technologies', location: 'Bangalore', type: 'remote', salary: '₹18-25L', description: 'Lead frontend architecture for women-health platform.', requirements: ['React', 'TypeScript', '5+ years'], postedISO: soon(-2), companyId: 'C1', womenPreferred: true },
  { id: 'J2', title: 'ML Engineer — Health AI', company: 'Lakshmi Health AI', location: 'Hyderabad', type: 'full-time', salary: '₹20-30L', description: 'Build diagnostic models for maternal health screening.', requirements: ['Python', 'PyTorch', 'ML'], postedISO: soon(-1), companyId: 'C2', womenPreferred: true },
  { id: 'J3', title: 'Product Manager', company: 'Sakshi Fintech', location: 'Mumbai', type: 'full-time', salary: '₹22-28L', description: 'Own the women-lending product line end-to-end.', requirements: ['PM experience', 'Fintech', 'Analytics'], postedISO: soon(-3), companyId: 'C3', womenPreferred: true },
  { id: 'J4', title: 'Robotics Software Intern', company: 'Nari Robotics', location: 'Pune', type: 'part-time', salary: '₹25K/mo', description: 'Work on robot navigation algorithms in ROS2.', requirements: ['C++', 'ROS2', '3D perception'], postedISO: soon(-1), companyId: 'C4', womenPreferred: true },
  { id: 'J5', title: 'Climate Data Analyst', company: 'Pragati Climate', location: 'Delhi', type: 'contract', salary: '₹15-20L', description: 'Analyze satellite data for climate impact models.', requirements: ['Python', 'GIS', 'Statistics'], postedISO: soon(-4), companyId: 'C5', womenPreferred: true },
  { id: 'J6', title: 'Full Stack Developer', company: 'Asha Technologies', location: 'Bangalore', type: 'remote', salary: '₹14-20L', description: 'Build the mentorship platform from end to end.', requirements: ['Node.js', 'React', 'PostgreSQL'], postedISO: soon(-2), companyId: 'C1', womenPreferred: true },
  { id: 'J7', title: 'EdTech Curriculum Designer', company: 'Devi Education', location: 'Chennai', type: 'full-time', salary: '₹12-18L', description: 'Design STEM curriculum for girls\' schools.', requirements: ['Education', 'STEM', 'Content design'], postedISO: soon(-1), companyId: 'C6', womenPreferred: true },
  { id: 'J8', title: 'UI/UX Design Lead', company: 'Maya Design Co.', location: 'Mumbai', type: 'remote', salary: '₹16-22L', description: 'Lead design for accessible fintech products.', requirements: ['Figma', 'Accessibility', 'Design systems'], postedISO: soon(-5), companyId: 'C8', womenPreferred: true },
  { id: 'J9', title: 'Biotech Research Scientist', company: 'Shakti Biotech', location: 'Hyderabad', type: 'full-time', salary: '₹18-26L', description: 'Research novel biomarkers for women-specific diseases.', requirements: ['PhD Bio', 'Lab skills', 'Publications'], postedISO: soon(-3), companyId: 'C7', womenPreferred: false },
  { id: 'J10', title: 'DevOps Engineer', company: 'Asha Technologies', location: 'Bangalore', type: 'remote', salary: '₹15-22L', description: 'Manage cloud infrastructure and CI/CD pipelines.', requirements: ['AWS', 'Kubernetes', 'Terraform'], postedISO: soon(-1), companyId: 'C1', womenPreferred: true },
  { id: 'J11', title: 'Data Engineer', company: 'Lakshmi Health AI', location: 'Hyderabad', type: 'full-time', salary: '₹16-24L', description: 'Build data pipelines for real-time health analytics.', requirements: ['Spark', 'Airflow', 'SQL'], postedISO: soon(-2), companyId: 'C2', womenPreferred: true },
  { id: 'J12', title: 'Community Manager', company: 'Sakshi Fintech', location: 'Mumbai', type: 'part-time', salary: '₹8-12L', description: 'Grow the women-in-finance community to 100K members.', requirements: ['Social media', 'Events', 'Writing'], postedISO: soon(-6), companyId: 'C3', womenPreferred: true },
];

export function seedState(): SheLeadsState {
  return {
    jobs: JOBS,
    companies: COMPANIES,
    profile: null,
    applications: [
      { id: 'A1', jobId: 'J1', profileId: 'p1', status: 'applied', appliedAt: soon(-1) },
      { id: 'A2', jobId: 'J3', profileId: 'p1', status: 'interview', appliedAt: soon(-5) },
    ],
    savedJobs: ['J2', 'J5'],
    voiceHistory: [],
    settings: { voiceEnabled: true, accessibilityMode: false, reducedMotion: false, encryptPhotos: true },
  };
}
