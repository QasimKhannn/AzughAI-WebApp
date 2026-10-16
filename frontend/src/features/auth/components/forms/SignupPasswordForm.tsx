import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FormField } from "@/components/ui/form-field";
import { AuthButton } from "@/components/ui/auth-button";
import { Divider } from "@/components/ui/divider";
import { validateRequired } from "@/utils/validation";
import { GoogleButton } from "../socials/GoogleButton";
import { AppleButton } from "../socials/AppleButton";
import { useSignup } from "../../hooks/useAuthQueries";

interface SignupPasswordFormProps {
  email: string;
}

export const SignupPasswordForm: React.FC<SignupPasswordFormProps> = ({
  email,
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { mutate: signup, isPending } = useSignup();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!validateRequired(formData.password)) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!validateRequired(formData.confirmPassword)) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!validateRequired(formData.firstName)) {
      newErrors.firstName = "First name is required";
    }

    if (!validateRequired(formData.lastName)) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    await signup({
      email: email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
      create_azugh_account: true,
    }, {
      onSuccess: () => {
        console.log("✅ Signup successful, navigating to /onboarding");
        toast.success("Account created successfully!");
         navigate("/onboarding", { replace: true, state: { from: 'signup' } });
         console.log("➡️ Navigated to /onboarding");
      },
      onError: (error: any) => {
        toast.error(
          error?.message || "Failed to create account. Please try again."
        );
        console.error("Registration error:", error);
      }
    });
  };

  const handleGoogleSignup = () => {
    toast.info("Google signup not implemented yet");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="flex flex-row justify-between items-center space-x-3 sm:space-x-4">
        <FormField
          type="first-name"
          placeholder="First Name"
          value={formData.firstName || ""}
          onChange={(value) => updateField("firstName", value)}
          error={errors.firstName}
          required
        />
        <FormField
          type="last-name"
          placeholder="Last Name"
          value={formData.lastName || ""}
          onChange={(value) => updateField("lastName", value)}
          error={errors.lastName}
          required
        />
      </div>
      <FormField
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(value) => updateField("password", value)}
        error={errors.password}
        required
      />

      <FormField
        type="password"
        placeholder="Confirm Password"
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
        {isPending ? "Creating Account..." : "Create Account"}
      </AuthButton>

      <Divider />

      <GoogleButton onClick={handleGoogleSignup} />
      <AppleButton
        onClick={() => toast.info("Apple signup not implemented yet")}
      />
    </form>
  );
};
