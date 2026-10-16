import React, { useState } from 'react';
import { toast } from 'sonner';
import { FormField } from '@/components/ui/form-field';
import { AuthButton } from '@/components/ui/auth-button';
import { Divider } from '@/components/ui/divider';
import { validateEmail, validateRequired } from '@/utils/validation';
import { GoogleButton } from '../socials/GoogleButton';
import { AppleButton } from '../socials/AppleButton';
import { Checkbox } from '@/components/ui/checkbox';
import { useCheckAccountExists } from '../../hooks/useAuthQueries';

interface SignupEmailFormProps {
  onNext: (email: string) => void;
}

export const SignupEmailForm: React.FC<SignupEmailFormProps> = ({ onNext }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{ acceptedTerms?: string }>({});

  const checkAccountMutation = useCheckAccountExists();

  const validateForm = () => {
    if (!validateRequired(email)) {
      setError('Email is required');
      return false;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!acceptedTerms) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        acceptedTerms: 'You must accept the terms and conditions',
      }));
      return false;
    }
    setError('');
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const result = await checkAccountMutation.mutateAsync(email);
      
      if (result.exists) {
        setError('An account with this email already exists. Please sign in instead.');
        return;
      }
      
      onNext(email);
    } catch (error) {
      toast.error('Error checking email. Please try again.');
      console.error('Email check error:', error);
    }
  };

  const handleGoogleSignup = () => {
    toast.info('Google signup not implemented yet');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <FormField
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(value) => {
          setEmail(value);
          if (error) setError('');
        }}
        error={error}
        required
      />

      {/* Terms and Conditions Checkbox - place just before submit */}
      <div>
        <label className="flex items-center gap-2 text-sm text-white/80 font-manrope cursor-pointer select-none">
          <Checkbox
            checked={acceptedTerms}
            onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
            className="accent-white/80 bg-white"
            required
          />
          I accept the&nbsp;
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-white hover:text-white/80"
          >
            terms and conditions
          </a>
        </label>
        {errors.acceptedTerms && (
          <p className="text-xs text-red-500 mt-1 font-manrope">{errors.acceptedTerms}</p>
        )}
      </div>

      <AuthButton
        type="submit"
        variant="primary"
        loading={checkAccountMutation.isPending}
        disabled={checkAccountMutation.isPending}
      >
        {checkAccountMutation.isPending ? 'Checking...' : 'Continue'}
      </AuthButton>

      <Divider />

      <GoogleButton onClick={handleGoogleSignup} />
      <AppleButton onClick={() => toast.info('Apple signup not implemented yet')} />
    </form>
  );
};
