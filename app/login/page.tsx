import LoginClient from './LoginClient';

type LoginPageProps = {
  searchParams?: Promise<{ next?: string } | undefined>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = (await searchParams) ?? {};
  const next = sp.next ?? '/admin/dashboard';
  return <LoginClient next={next} />;
}
