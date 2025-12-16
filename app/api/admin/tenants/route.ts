import { NextResponse } from 'next/server';
import { createTenant, listTenants } from '@/lib/server/tenantStore';

export async function GET() {
  const tenants = await listTenants();
  return NextResponse.json({ tenants });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | {
        name?: string;
        domain?: string;
        language?: string;
        siteType?: string;
        modules?: string[];
        plugins?: string[];
      }
    | null;

  try {
    const tenant = await createTenant({
      name: body?.name ?? '',
      domain: body?.domain ?? '',
      language: body?.language ?? '',
      siteType: body?.siteType ?? '',
      modules: body?.modules ?? [],
      plugins: body?.plugins ?? [],
    });

    return NextResponse.json({ tenant }, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Failed to create tenant' },
      { status: 400 },
    );
  }
}
