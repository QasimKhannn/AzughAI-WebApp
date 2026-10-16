import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '@/layout/AuthLayout';
import { SignupEmailForm } from '@/features/auth/components/forms/SignupForm';
import { SignupPasswordForm } from '@/features/auth/components/forms/SignupPasswordForm';

const SignupPage: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  // Redirect to email step if no step or invalid step
  useEffect(() => {
    if (!step || !['email', 'password'].includes(step)) {
      navigate('/auth/signup/email', { replace: true });
    }
  }, [step, navigate]);

  // Redirect to email step if trying to access password without email
  useEffect(() => {
    if (step === 'password' && !email) {
      navigate('/auth/signup/email', { replace: true });
    }
  }, [step, email, navigate]);

  const handleEmailNext = (emailValue: string) => {
    setEmail(emailValue);
    navigate('/auth/signup/password');
  };

  const getTitle = () => {
    switch (step) {
      case 'email':
        return 'Create an account';
      case 'password':
        return 'Create an account';
      default:
        return 'Sign up';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'email':
        return 'Join Azugh to discover your perfect style';
      case 'password':
        return 'Finish setting up your account';
      default:
        return '';
    }
  };

  const renderForm = () => {
    switch (step) {
      case 'email':
        return <SignupEmailForm onNext={handleEmailNext} />;
      case 'password':
        return <SignupPasswordForm email={email} />;
      default:
        return null;
    }
  };

  return (
    <AuthLayout
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {renderForm()}
      
      <div className="mt-6 text-center">
        <p className="text-sm text-white/80 font-manrope">
          Already have an account?{' '}
          <Link
            to="/auth/login"
            className="font-semibold text-white hover:text-white/80 transition-colors underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
