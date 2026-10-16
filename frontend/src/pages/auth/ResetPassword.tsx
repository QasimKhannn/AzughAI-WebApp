import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '@/layout/AuthLayout';
import { ResetPasswordForm } from '@/features/auth/components/forms/ResetPasswordForm';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const uidb64 = searchParams.get('uidb64') || undefined;
  const token = searchParams.get('token') || undefined;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your new password below"
    >
      <ResetPasswordForm uidb64={uidb64} token={token} />
      
      <div className="mt-4 text-center text-sm">
        <span className="text-sm text-white/80 font-manrope">Remember your password? </span>
        <Link
          to="/auth/login"
          className="font-semibold text-white hover:text-white/80 transition-colors underline"
        >
          Sign In
        </Link>
      </div>
    </AuthLayout>
  );
}

