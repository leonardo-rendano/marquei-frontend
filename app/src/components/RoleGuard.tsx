'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../hooks/useAuth';

type Role = 'GESTOR' | 'PROFISSIONAL' | 'CLIENTE';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({
  children,
  allowedRoles,
}: RoleGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    router.replace('/dashboard');

    return null;
  }

  return <>{children}</>;
}