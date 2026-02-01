import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROPOSALS_FILE = path.join(DATA_DIR, 'proposals.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');
const TEMPLATES_FILE = path.join(DATA_DIR, 'templates.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

// Profile management
export async function getProfile() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROFILE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return {
      name: '',
      skills: '',
      experience: '',
      portfolio: '',
      rate: '',
    };
  }
}

export async function saveProfile(profile) {
  await ensureDataDir();
  await fs.writeFile(PROFILE_FILE, JSON.stringify(profile, null, 2));
  return profile;
}

// Proposals management
async function readProposals() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(PROPOSALS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { proposals: [] };
  }
}

async function writeProposals(data) {
  await ensureDataDir();
  await fs.writeFile(PROPOSALS_FILE, JSON.stringify(data, null, 2));
}

export async function saveProposal(jobDetails, proposal, analysis = null) {
  const data = await readProposals();
  
  const saved = {
    id: Date.now().toString(),
    jobDetails,
    proposal,
    analysis,
    status: 'draft',
    createdAt: new Date().toISOString(),
  };
  
  data.proposals.unshift(saved);
  data.proposals = data.proposals.slice(0, 100);
  
  await writeProposals(data);
  return saved;
}

export async function getProposals(status = null) {
  const data = await readProposals();
  if (status) {
    return data.proposals.filter(p => p.status === status);
  }
  return data.proposals;
}

export async function updateProposalStatus(id, status) {
  const data = await readProposals();
  const proposal = data.proposals.find(p => p.id === id);
  if (proposal) {
    proposal.status = status;
    proposal.updatedAt = new Date().toISOString();
    await writeProposals(data);
  }
  return proposal;
}

// Templates
export async function getTemplates() {
  await ensureDataDir();
  try {
    const data = await fs.readFile(TEMPLATES_FILE, 'utf-8');
    return JSON.parse(data).templates;
  } catch (e) {
    return [];
  }
}

export async function saveTemplate(name, content) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(TEMPLATES_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { templates: [] };
  }
  
  data.templates.push({
    id: Date.now().toString(),
    name,
    content,
    createdAt: new Date().toISOString(),
  });
  
  await fs.writeFile(TEMPLATES_FILE, JSON.stringify(data, null, 2));
}
