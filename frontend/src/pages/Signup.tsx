import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '@/layout/AuthLayout';
import { SignupEmailForm } from '@/features/auth/components/SignupForm';
import { SignupPasswordForm } from '@/features/auth/components/SignupPasswordForm';

const SignupPage: React.FC = () => {
  const { step } = useParams<{ step: string }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleEmailNext = (emailValue: string) => {
    setEmail(emailValue);
    navigate('/auth/signup/password');
  };

  const getTitle = () => {
    switch (step) {
      case 'email':
        return 'Create an account';
      case 'password':
        return 'Choose a password';
      default:
        return 'Sign up';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'email':
        return 'Join Azugh to discover your perfect style';
      case 'password':
        return 'Create a secure password for your account';
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
        navigate('/auth/signup/email');
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
