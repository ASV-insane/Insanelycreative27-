export interface CampaignTemplate {
  id: string;
  title: string;
  category: string;
  badge: string;
  prompt: string;
  defaultBrand: string;
  defaultAudience: string;
  defaultTone: string;
  primaryColor: string;
  accentColor: string;
  description: string;
}

export const CAMPAIGN_TEMPLATES: CampaignTemplate[] = [
  {
    id: 'cafe-launch',
    title: 'Moon Brew Café Grand Opening',
    category: 'Food & Beverage',
    badge: 'Campus Launch',
    prompt: 'I’m launching a new café called Moon Brew. Grand opening this Saturday. Target audience is college students and creative night owls.',
    defaultBrand: 'Moon Brew',
    defaultAudience: 'College undergrads, graduate students & campus night owls',
    defaultTone: 'Atmospheric, warm, bold, culturally savvy',
    primaryColor: '#0c1222',
    accentColor: '#e0a96d',
    description: 'Coordinated opening blitz with campus posters, Instagram hype reels, discount story sequences, and local email invites.',
  },
  {
    id: 'tutoring-exam',
    title: 'Apex Scholars Class 10 Board Exam Crash Course',
    category: 'Education & Coaching',
    badge: 'Exam Prep',
    prompt: 'I want to promote my new tutoring centre called Apex Scholars for Class 10 students before upcoming board exams. High-impact revision, mock tests, and top rank mentors.',
    defaultBrand: 'Apex Scholars',
    defaultAudience: 'Class 10 students and their parents aiming for 95%+ board scores',
    defaultTone: 'Inspiring, authoritative, reassuring, results-focused',
    primaryColor: '#0f172a',
    accentColor: '#0ea5e9',
    description: 'Complete parent-student trust package with curriculum breakdown posters, confidence-boosting Shorts, and enrollment email copy.',
  },
  {
    id: 'saas-launch',
    title: 'SyntaxPulse AI Code Review Launch',
    category: 'B2B Software',
    badge: 'Tech Beta',
    prompt: 'Launching SyntaxPulse: an AI tool that cuts pull request review times in half by catching edge-case bugs and architectural smells in CI/CD.',
    defaultBrand: 'SyntaxPulse',
    defaultAudience: 'Staff engineers, tech leads, and fast-moving dev teams',
    defaultTone: 'Technical, clean, high-precision, pragmatic',
    primaryColor: '#090d16',
    accentColor: '#10b981',
    description: 'Dev-first product announcement with workflow diagrams, LinkedIn thought-leadership copy, and developer community teaser reels.',
  },
  {
    id: 'fashion-drop',
    title: 'Nocturne Atelier Autumn Capsule Release',
    category: 'Fashion & Streetwear',
    badge: 'Limited Drop',
    prompt: 'Announcing our autumn capsule drop "Monochrome Drift" by Nocturne Atelier. Heavyweight Japanese cotton hoodies and tailored cargo pants. Only 300 pieces.',
    defaultBrand: 'Nocturne Atelier',
    defaultAudience: 'Minimalist streetwear enthusiasts and design lovers',
    defaultTone: 'Understated, avant-garde, premium, exclusive',
    primaryColor: '#18181b',
    accentColor: '#f43f5e',
    description: 'Scarcity-driven drop hype with aesthetic lookbook stories, teaser voiceover reels, and VIP waitlist emails.',
  },
  {
    id: 'fitness-challenge',
    title: 'IronForge 30-Day Strength Reset',
    category: 'Health & Fitness',
    badge: 'Seasonal Challenge',
    prompt: 'Promoting IronForge Gym’s New Year 30-Day Strength Reset. Certified coach check-ins, custom macro guidelines, and supportive cohort accountability.',
    defaultBrand: 'IronForge Gym',
    defaultAudience: 'Busy professionals looking to build real muscle and metabolic stamina',
    defaultTone: 'Energizing, disciplined, encouraging, non-gimmicky',
    primaryColor: '#1c1917',
    accentColor: '#f97316',
    description: 'Motivational challenge rollout with habit transformation reels, printable tracking posters, and early-bird discount ads.',
  },
];
