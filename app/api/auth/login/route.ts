import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'tp_admin';

function getExpectedCreds() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  // Dev fallback to make local iteration easy.
  if ((!email || !password) && process.env.NODE_ENV !== 'production') {
    return { email: 'admin@local', password: 'admin' };
  }

  return { email: email ?? '', password: password ?? '' };
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = body?.email?.trim() ?? '';
  const password = body?.password ?? '';

  const expected = getExpectedCreds();

  if (!expected.email || !expected.password) {
    return NextResponse.json(
      { error: '관리자 계정이 설정되지 않았습니다(ADMIN_EMAIL/ADMIN_PASSWORD)' },
      { status: 500 },
    );
  }

  if (email !== expected.email || password !== expected.password) {
    return NextResponse.json({ error: '이메일 또는 비밀번호가 올바르지 않습니다' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
