// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//   } from "@/components/ui/form"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Link } from "react-router-dom";
// import UserService from "@/services/UserService";
// import { toast } from "sonner";
// import { useAuth } from "@/context/AuthContext";

// // define form schema
// const formSchema = z
//     .object({
//         email: z.string().email({ message: "Invalid email address." }),
//         password: z.string().min(6, { message: "Password must be at least 6 characters." }).optional(),
//         confirmPassword: z.string().optional(),
//     })
//     .refine((data) => {
//         if (data.password && data.confirmPassword) {
//             return data.password === data.confirmPassword;
//         }
//         return true;
//     }, {
//         message: "Passwords do not match",
//         path: ["confirmPassword"], // ⬅️ This determines where the error shows up
//     });
// // infer the type from the schema
// type FormValues = z.infer<typeof formSchema>;


// const LoginForm = () => {
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();
//     const { login } = useAuth();

//     // Form definition
//     const form = useForm<FormValues>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             email: "",
//             password: "",
//         },
//     });

//     const handleGoogleLogin = () => {
//         // TODO: Implement Google login
//         console.log('Google login clicked');
//         toast("Google login not implemented yet");
//     };

//     const handleSubmit = async (data: FormValues) => {
//         if (!data.email || !data.password) {
//             toast("Please fill in all fields");
//             return;
//         }
        
//         setIsLoading(true);
//         try {
//             await login(data.email, data.password);
//             toast("Login successful!");
//             navigate('/onboarding');
//         } catch (error) {
//             toast("Login failed. Please check your credentials.");
//             console.error('Login error:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full space-y-4 sm:space-y-5">
//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormControl>
//                                 <Input 
//                                     placeholder="Enter your email" 
//                                     {...field} 
//                                     className="bg-white/20 border-white/30 text-black placeholder:text-black/60 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix"
//                                 />
//                             </FormControl>
//                             <FormMessage className="text-red-300 text-xs sm:text-sm" />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormControl>
//                                 <Input 
//                                     type="password" 
//                                     placeholder="Enter your password" 
//                                     {...field} 
//                                     className="bg-white/20 border-white/30 text-black placeholder:text-black/60 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix"
//                                 />
//                             </FormControl>
//                             <FormMessage className="text-red-300 text-xs sm:text-sm" />
//                         </FormItem>
//                     )}
//                 />
                
//                 <Button 
//                     type="submit" 
//                     disabled={isLoading}
//                     className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold py-3 sm:py-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 h-12 sm:h-auto text-base ios-tap-highlight-none"
//                 >
//                     {isLoading ? "Signing In..." : "Sign In"}
//                 </Button>
                
//                 {/* Divider */}
//                 <div className="relative py-2">
//                     <div className="absolute inset-0 flex items-center">
//                         <span className="w-full border-t border-white/20" />
//                     </div>
//                     <div className="relative flex justify-center text-xs uppercase">
//                         <span className="bg-transparent px-2 text-white/60 font-manrope">
//                             Or continue with
//                         </span>
//                     </div>
//                 </div>
                
//                 {/* Google button */}
//                 <button
//                     className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl py-3 font-manrope font-medium text-white hover:bg-white/20 transition-all duration-300 shadow-lg h-12 sm:h-auto text-sm sm:text-base ios-tap-highlight-none"
//                     type="button"
//                     onClick={handleGoogleLogin}
//                 >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                     </svg>
//                     Continue with Google
//                 </button>
//             </form>
//         </Form>
//     )
// }

// interface Step {
//     onNext: (email?: string) => void;
// }

// export const SignupForm: React.FC<Step> = ({onNext}) => {
//     const [isLoading, setIsLoading] = useState(false);

//     const form = useForm<FormValues>({
//         resolver: zodResolver(z.object({
//             email: z.string().email({ message: "Invalid email address." }),
//         })),
//         defaultValues: {
//             email: "",
//         },
//     });
    
//     const handleNext = async (data: { email: string }) => {
//         if (!data.email) {
//             toast("Please enter your email");
//             return;
//         }
        
//         setIsLoading(true);
//         try {
//             // Check if email already exists
//             const emailExists = await UserService.checkEmail(data.email);
//             if (emailExists) {
//                 toast("An account with this email already exists. Please sign in instead.");
//                 return;
//             }
            
//             // If email doesn't exist, proceed to password step
//             onNext(data.email);
//         } catch (error) {
//             toast("Error checking email. Please try again.");
//             console.error('Email check error:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     const handleGoogleSignup = () => {
//         // TODO: Implement Google signup
//         console.log('Google signup clicked');
//         toast("Google signup not implemented yet");
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleNext)} className="w-full space-y-4 sm:space-y-5">
//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormLabel className="text-white font-manrope font-medium text-sm sm:text-base">Email Address</FormLabel>
//                             <FormControl>
//                                 <Input 
//                                     placeholder="Enter your email" 
//                                     {...field} 
//                                     className="bg-white/20 border-white/30 text-black placeholder:text-black/60 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix"
//                                 />
//                             </FormControl>
//                             <FormMessage className="text-red-300 text-xs sm:text-sm" />
//                         </FormItem>
//                     )}
//                 />
//                 <Button 
//                     type="submit" 
//                     disabled={isLoading}
//                     className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 h-12 sm:h-auto text-base ios-tap-highlight-none"
//                 >
//                     {isLoading ? "Checking..." : "Continue"}
//                 </Button>
                
//                 {/* Divider */}
//                 <div className="relative py-2">
//                     <div className="absolute inset-0 flex items-center">
//                         <span className="w-full border-t border-white/20" />
//                     </div>
//                     <div className="relative flex justify-center text-xs uppercase">
//                         <span className="bg-transparent px-2 text-white/60 font-manrope">
//                             Or continue with
//                         </span>
//                     </div>
//                 </div>
                
//                 {/* Google button */}
//                 <button
//                     className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl py-3 font-manrope font-medium text-white hover:bg-white/20 transition-all duration-300 shadow-lg h-12 sm:h-auto text-sm sm:text-base ios-tap-highlight-none"
//                     type="button"
//                     onClick={handleGoogleSignup}
//                 >
//                     <img src="/assets/google.svg" alt="Google" className="w-5 h-5" />
//                     Continue with Google
//                 </button>
//             </form>
//         </Form>
//     )
// }

// interface PasswordStep {
//     onNext: () => void;
//     email: string;
// }

// export const ChoosePasswordForm: React.FC<PasswordStep> = ({onNext, email}) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const navigate = useNavigate();

//     const form = useForm<FormValues>({
//         resolver: zodResolver(z.object({
//             email: z.string().email({ message: "Invalid email address." }),
//             password: z.string().min(6, { message: "Password must be at least 6 characters." }),
//             confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
//         }).refine((data) => data.password === data.confirmPassword, {
//             message: "Passwords do not match",
//             path: ["confirmPassword"],
//         })),
//         defaultValues: {
//             email: email || "",
//             password: "",
//             confirmPassword: "",
//         },
//         mode: "onChange"
//     });

//     const handleNext = async (data: FormValues) => {
//         if (!data.email || !data.password) {
//             toast("Please fill in all fields");
//             return;
//         }
        
//         setIsLoading(true);
//         try {
//             await UserService.register(data.email, data.password);
//             toast("Account created successfully!");
//             navigate('/onboarding');
//         } catch (error) {
//             toast("Failed to create account. Please try again.");
//             console.error('Registration error:', error);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     const handleGoogleSignup = () => {
//         // TODO: Implement Google signup
//         console.log('Google signup clicked');
//         toast("Google signup not implemented yet");
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(handleNext)} className="w-full space-y-4 sm:space-y-5">
//                 <FormField
//                     control={form.control}
//                     name="email"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormControl>
//                                 <Input 
//                                     placeholder="Enter your email" 
//                                     {...field} 
//                                     className="bg-white/20 border-white/30 text-black placeholder:text-black/60 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix"
//                                 />
//                             </FormControl>
//                             <FormMessage className="text-red-300 text-xs sm:text-sm" />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="password"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormControl>
//                                 <Input 
//                                     type="password" 
//                                     placeholder="Create a strong password" 
//                                     {...field} 
//                                     className="bg-white/20 border-white/30 text-black placeholder:text-black/60 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix"
//                                 />
//                             </FormControl>
//                             <FormMessage className="text-red-300 text-xs sm:text-sm" />
//                         </FormItem>
//                     )}
//                 />
//                 <FormField
//                     control={form.control}
//                     name="confirmPassword"
//                     render={({ field }) => (
//                         <FormItem>
//                             <FormControl>
//                                 <Input 
//                                     type="password" 
//                                     placeholder="Confirm your password" 
//                                     {...field} 
//                                     className="bg-white/20 border-white/30 text-black placeholder:text-black/60 backdrop-blur-sm rounded-xl focus:bg-white/30 focus:border-white/50 transition-all h-12 sm:h-auto text-base ios-input-fix"
//                                 />
//                             </FormControl>
//                             <FormMessage className="text-red-300 text-xs sm:text-sm" />
//                         </FormItem>
//                     )}
//                 />
//                 <Button 
//                     type="submit" 
//                     disabled={isLoading}
//                     className="w-full bg-white text-gray-900 hover:bg-white/90 font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 h-12 sm:h-auto text-base ios-tap-highlight-none"
//                 >
//                     {isLoading ? "Creating Account..." : "Create Account"}
//                 </Button>
//                 <div className="relative py-2">
//                     <div className="absolute inset-0 flex items-center">
//                         <span className="w-full border-t border-white/20" />
//                     </div>
//                     <div className="relative flex justify-center text-xs uppercase">
//                         <span className="bg-transparent px-2 text-white/60 font-manrope">
//                             Or continue with
//                         </span>
//                     </div>
//                 </div>
//                 <button
//                     className="w-full flex items-center justify-center gap-3 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl py-3 font-manrope font-medium text-white hover:bg-white/20 transition-all duration-300 shadow-lg h-12 sm:h-auto text-sm sm:text-base ios-tap-highlight-none"
//                     type="button"
//                     onClick={handleGoogleSignup}
//                 >
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
//                         <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                         <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                         <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
//                         <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//                     </svg>
//                     Continue with Google
//                 </button>
//             </form>
//         </Form>
//     )
// }




// export default LoginForm;

