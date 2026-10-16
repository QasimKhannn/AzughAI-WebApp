import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';
import { FormField } from '@/components/ui/form-field';
import { AuthButton } from '@/components/ui/auth-button';
import { Divider } from '@/components/ui/divider';
import { useResetPassword } from '@/features/auth/hooks/useAuthQueries';

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface ResetPasswordFormProps {
  uidb64?: string;
  token?: string;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ uidb64, token }) => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { mutate: resetPassword, isPending } = useResetPassword();

  const validateForm = () => {
    try {
      resetPasswordSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!uidb64 || !token) {
      toast.error('Invalid reset link. Please request a new password reset.');
      return;
    }

    resetPassword(
      { uidb64, token, new_password: formData.password },
      {
        onSuccess: () => {
          toast.success("Password reset successfully!");
          navigate("/auth/login", { replace: true });
        },
        onError: (error: any) => {
          toast.error(
            error?.message || "Failed to reset password. Please try again."
          );
          console.error("Reset password error:", error);
        }
      }
    );
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <FormField
        type="password"
        placeholder="New Password"
        value={formData.password}
        onChange={(value) => updateField("password", value)}
        error={errors.password}
        required
      />

      <FormField
        type="password"
        placeholder="Confirm New Password"
        value={formData.confirmPassword}
        onChange={(value) => updateField("confirmPassword", value)}
        error={errors.confirmPassword}
        required
      />

      <AuthButton
        type="submit"
        variant="primary"
        loading={isPending}
        disabled={isPending}
      >
        {isPending ? "Resetting Password..." : "Reset Password"}
      </AuthButton>
    </form>
  );
};