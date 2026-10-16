import React from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '@/layout/AuthLayout';
import { LoginForm } from '@/features/auth/components/forms/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue your style journey"
    >
      <LoginForm />
      
      <div className="mt-6 text-center">
        <p className="text-sm text-white/80 font-manrope">
          Don't have an account?{' '}
          <Link
            to="/auth/signup/email"
            className="font-semibold text-white hover:text-white/80 transition-colors underline"
          >
            Sign up here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
