import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FormField } from '@/components/ui/form-field';
import { AuthButton } from '@/components/ui/auth-button';
import { Divider } from '@/components/ui/divider';
import { validateEmail, validateRequired } from '@/utils/validation';
import { GoogleButton } from '../socials/GoogleButton';
import { AppleButton } from '../socials/AppleButton';
import { useLogin } from '@/features/auth/hooks/useAuthQueries';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: login, isPending, error } = useLogin();
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.email)) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validateRequired(formData.password)) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    await login({ email: formData.email, password: formData.password }, {
      onSuccess: (data) => {
        // Check if email is verified
        if (data.email_verified === false) {
          toast.error('Please verify your email address before signing in. Check your inbox for the verification link.');
          return;
        }
        
        toast.success('Login successful!');
        navigate('/onboarding');
      },
      onError: (error: any) => {
        const errorMessage = error?.message || 'Login failed. Please try again.';
        toast.error(errorMessage);
        console.error("Login failed:", error);
      }
    });
  };

  const handleGoogleLogin = () => {
    toast.info('Google login not implemented yet');
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <FormField
        type="email"
        placeholder="Enter your email"
        value={formData.email}
        onChange={(value) => updateField('email', value)}
        error={errors.email}
        required
      />
      
      <FormField
        type="password"
        placeholder="Enter your password"
        value={formData.password}
        onChange={(value) => updateField('password', value)}
        error={errors.password}
        required
      />
      
      <AuthButton
        type="submit"
        variant="primary"
        loading={isPending}
        disabled={isPending}
      >
        {isPending ? 'Signing In...' : 'Sign In'}
      </AuthButton>
      
      <Divider />
      
      <GoogleButton onClick={handleGoogleLogin} />
      <AppleButton onClick={() => toast.info('Apple login not implemented yet')} />
    </form>
  );
};
