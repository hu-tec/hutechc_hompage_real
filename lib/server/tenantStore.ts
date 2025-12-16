import 'server-only';

import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

export type TenantStatus = 'active' | 'inactive';

export type Tenant = {
  id: string;
  name: string;
  domain: string;
  language: string;
  siteType: string;
  modules: string[];
  plugins: string[];
  status: TenantStatus;
  createdAt: string;
};

export type CreateTenantInput = {
  name: string;
  domain: string;
  language: string;
  siteType: string;
  modules: string[];
  plugins: string[];
};

const DATA_DIR = path.join(process.cwd(), '.data');
const TENANTS_FILE = path.join(DATA_DIR, 'tenants.json');

async function ensureStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(TENANTS_FILE);
  } catch {
    await fs.writeFile(TENANTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

async function readTenants(): Promise<Tenant[]> {
  await ensureStore();
  const raw = await fs.readFile(TENANTS_FILE, 'utf-8');
  const parsed = JSON.parse(raw) as unknown;
  return Array.isArray(parsed) ? (parsed as Tenant[]) : [];
}

async function writeTenants(tenants: Tenant[]) {
  await ensureStore();
  await fs.writeFile(TENANTS_FILE, JSON.stringify(tenants, null, 2), 'utf-8');
}

export async function listTenants(): Promise<Tenant[]> {
  const tenants = await readTenants();
  return tenants.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  const name = input.name.trim();
  const domain = input.domain.trim();
  const language = input.language.trim();
  const siteType = input.siteType.trim();

  if (!name) throw new Error('사이트명을 입력해주세요');
  if (!domain) throw new Error('도메인을 입력해주세요');
  if (!language) throw new Error('기본 언어를 입력해주세요');
  if (!siteType) throw new Error('사이트 타입을 선택해주세요');

  const tenants = await readTenants();
  const normalizedDomain = domain.toLowerCase();

  if (tenants.some((t) => t.domain.toLowerCase() === normalizedDomain)) {
    throw new Error('이미 사용 중인 도메인입니다');
  }

  const tenant: Tenant = {
    id: randomUUID(),
    name,
    domain,
    language,
    siteType,
    modules: Array.from(new Set(input.modules ?? [])).sort(),
    plugins: Array.from(new Set(input.plugins ?? [])).sort(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  tenants.push(tenant);
  await writeTenants(tenants);

  return tenant;
}
