import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AuthLayout } from '@/layout/AuthLayout';
import { useVerifyEmail } from '@/features/auth/hooks/useAuthQueries';
import { AuthButton } from '@/components/ui/auth-button';

export default function VerifyEmail() {
  const { uidb64 = '', token = '' } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const { mutate: verifyEmail, isPending } = useVerifyEmail();

  useEffect(() => {
    if (!uidb64 || !token) {
      setVerificationStatus('error');
      toast.error('Invalid verification link');
      return;
    }

    // Automatically verify on mount
    verifyEmail(
      { uidb64, token },
      {
        onSuccess: () => {
          setVerificationStatus('success');
          toast.success('Email verified successfully!');
        },
        onError: (error: any) => {
          setVerificationStatus('error');
          toast.error(error?.message || 'Email verification failed');
        }
      }
    );
  }, [uidb64, token, verifyEmail]);

  const handleContinue = () => {
    navigate('/auth/login');
  };

  const getContent = () => {
    switch (verificationStatus) {
      case 'pending':
        return {
          title: 'Verifying Email',
          subtitle: 'Please wait while we verify your email address...',
          showButton: false
        };
      case 'success':
        return {
          title: 'Email Verified!',
          subtitle: 'Your email has been successfully verified. You can now sign in to your account.',
          showButton: true
        };
      case 'error':
        return {
          title: 'Verification Failed',
          subtitle: 'The verification link is invalid or has expired. Please request a new verification email.',
          showButton: true
        };
    }
  };

  const content = getContent();

  return (
    <AuthLayout
      title={content.title}
      subtitle={content.subtitle}
    >
      <div className="space-y-4">
        {isPending && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {content.showButton && (
          <>
            {verificationStatus === 'success' ? (
              <AuthButton
                variant="primary"
                onClick={handleContinue}
              >
                Continue to Sign In
              </AuthButton>
            ) : (
              <Link to="/auth/login">
                <AuthButton
                  variant="primary"
                  className="w-full"
                >
                  Back to Sign In
                </AuthButton>
              </Link>
            )}
          </>
        )}

        <div className="mt-4 text-center text-sm">
          <span className="text-sm text-white/80 font-manrope">Need help? </span>
          <Link
            to="/auth/login"
            className="font-semibold text-white hover:text-white/80 transition-colors underline"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
