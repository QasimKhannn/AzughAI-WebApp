import React, { useEffect, useState } from "react"
import { AudioLines, MousePointer2, User, Camera } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select"
import { 
    Form, 
    FormControl, 
    FormField, 
    FormItem, 
    FormLabel, 
    FormMessage 
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UserProfile, UserProfileService } from '../services/UserProfileService'
import { UploadMedia } from "@/components/UploadMedia"
import SwipingInterface from "@/components/SwipingInterface"

type OnboardingModes = {
    title: string
    description: string
    icon: React.ReactNode
    onClick: () => void
    className?: string
    delay?: number
}

export const TextOnboardingMode: OnboardingModes = {
    title: "Silent Swipe",
    description: "No talking just tapping into looks",
    icon: <MousePointer2 className="h-f w-f text-azugh-text" />,
    onClick: () => {
        console.log("Text mode selected")
    }
}

export const VoiceOnboardingMode: OnboardingModes = {
    title: "Style Chat",
    description: "Speak your way into a new look",
    icon: <AudioLines className="h-f w-f text-azugh-text" />,
    onClick: () => {
        console.log("Voice mode selected")
    }
}


export const OnboardingModeCards: React.FC<OnboardingModes> = ({ 
    title, 
    description, 
    icon, 
    onClick, 
    className,
    delay = 0 
}) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [delay]);

    return (
        <Card 
            className={`
                w-auto h-auto cursor-pointer 
                group
                bg-white/5 border-azugh-highlight/10 
                hover:border-azugh-highlight/30 
                transition-all duration-700
                hover:shadow-lg hover:shadow-azugh-highlight/5
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                ${className}
            `} 
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="font-manrope text-center text-azugh-accent group-hover:text-azugh-highlight transition-colors duration-500">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div className="
                    flex items-center justify-center 
                    h-auto w-auto mb-4 
                    transition-all duration-700 ease-in-out
                    group-hover:scale-110
                ">
                    {icon}
                </div>
                <CardDescription className="text-sm text-azugh-text/50 transition-opacity duration-500 group-hover:text-azugh-text/70">
                    {description}
                </CardDescription>
            </CardContent>
        </Card>
    )
}

interface UserOnboardingDetails extends UserProfile {
    title?: string;
    description?: string;
    hideHeader?: boolean;
    onClick: () => void;
    className?: string;
}

const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    gender: z.string().min(1, { message: "Please select a gender" }),
    age: z.number().min(16, { message: "You must be at least 16 years old" }),
    spendingAmount: z.number().min(0, { message: "Amount must be positive" }),
    currency: z.string().min(1, { message: "Please select a currency" })
});

type FormValues = z.infer<typeof formSchema>;

export const OnboardingUserDetails: React.FC<UserOnboardingDetails> = ({
    name,
    gender,
    age,
    spending,
    title = "Tell Us About You",
    description = "Help us personalize your experience",
    hideHeader = false,
    onClick,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: name || "",
            gender: gender || "",
            age: age || 25,
            spendingAmount: spending?.amount || 100,
            currency: spending?.currency || "USD"
        },
    });

    const onSubmit = (data: FormValues) => {
        console.log("Form submitted:", data);
        // Transform data to match UserProfile structure
        // const profileData: UserProfile = {
        //     name: data.name,
        //     gender: data.gender,
        //     age: data.age,
        //     spending: {
        //         amount: data.spendingAmount,
        //         currency: data.currency
        //     }
        // };
        // Save to UserProfileService
        UserProfileService.getInstance().updateProfile('name', data.name);
        UserProfileService.getInstance().updateProfile('gender', data.gender);
        UserProfileService.getInstance().updateProfile('age', data.age);
        UserProfileService.getInstance().updateProfile('spending', {
            amount: data.spendingAmount,
            currency: data.currency
        });
        onClick();
    };

    const incrementSpending = () => {
        const current = form.getValues("spendingAmount");
        const next = current < 100 ? current + 10 : 
                    current < 500 ? current + 50 : 
                    current < 1000 ? current + 100 : current + 500;
        form.setValue("spendingAmount", next);
    };

    const decrementSpending = () => {
        const current = form.getValues("spendingAmount");
        const next = current > 1000 ? current - 500 : 
                    current > 500 ? current - 100 : 
                    current > 100 ? current - 50 : 
                    current > 10 ? current - 10 : current;
        form.setValue("spendingAmount", next);
    };

    return (
        <Card 
            className={`
                w-auto max-w-md mx-auto h-auto
                group
                bg-white/5 border-azugh-highlight/10 
                hover:border-azugh-highlight/30 
                transition-all duration-700
                hover:shadow-lg hover:shadow-azugh-highlight/5
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                ${className}
            `} 
        >
            {hideHeader === false ? (<CardHeader>
                <CardTitle className="font-manrope text-center text-azugh-accent">
                    {title}
                </CardTitle>
                <CardDescription className="text-center text-azugh-text/50">
                    {description}
                </CardDescription>
            </CardHeader>
            ) :(
                <>
                </>
            )

            }
            <CardContent className={hideHeader ? 'pt-6' : 'pt-0'}>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-azugh-text">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your name" 
                                               {...field} 
                                               className="placeholder:text-azugh-text placeholder:opacity-50 text-azugh-text" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-azugh-text">Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                                            <FormControl className="text-azugh-text">
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select gender" className="text-azugh-text" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="men">Men</SelectItem>
                                                <SelectItem value="women">Women</SelectItem>
                                                <SelectItem value="non-binary">Non-binary</SelectItem>
                                                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-azugh-text">Age</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                placeholder="Enter your age" 
                                                {...field} 
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                className="placeholder:text-azugh-text placeholder:opacity-50 text-azugh-text" 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="spendingAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-azugh-text">Spending Amount</FormLabel>
                                        <div className="flex items-center">
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={decrementSpending}
                                                className="h-10 w-10 aspect-square p-0 text-azugh-text"
                                            >
                                                <span className="text-xl font-thin">-</span>
                                            </Button>
                                            <FormControl>
                                                <Input 
                                                    type="number" 
                                                    {...field} 
                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                    className="mx-2 text-center placeholder:text-azugh-text placeholder:opacity-50 text-azugh-text" 
                                                />
                                            </FormControl>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                onClick={incrementSpending}
                                                className="h-10 w-10 aspect-square p-0 text-azugh-text"
                                            >
                                                <span className="text-xl font-thin">+</span>
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="currency"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-azugh-text">Currency</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full text-azugh-text">
                                                    <SelectValue placeholder="Select currency" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="USD">USD</SelectItem>
                                                <SelectItem value="EUR">EUR</SelectItem>
                                                <SelectItem value="GBP">GBP</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button 
                    onClick={form.handleSubmit(onSubmit)} 
                    className="w-full bg-azugh-accent hover:bg-azugh-accent/90 text-white transition-colors duration-300"
                >
                    Continue
                </Button>
            </CardFooter>
        </Card>
    );
}

export interface OnboardingSkinColorProps {
    selectedSkinColor?: string;
    title?: string;
    description?: string;
    hideHeader?: boolean;
    onClick: (skinColor: string) => void;
    className?: string;
}

export const OnboardingSkinColor: React.FC<OnboardingSkinColorProps> = ({
    selectedSkinColor,
    title = "Select Your Skin Tone",
    description = "Help us personalize your clothing recommendations",
    hideHeader = false,
    onClick,
    className = ""
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [selected, setSelected] = useState<string | undefined>(selectedSkinColor);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    const skinColors = [
        { name: "Fair", color: "#F8E5D7" },
        { name: "Light", color: "#F3C9AD" },
        { name: "Medium", color: "#E6B78C" },
        { name: "Olive", color: "#C99B6A" },
        { name: "Tan", color: "#AA7A47" },
        { name: "Deep", color: "#8B5A2B" },
        { name: "Rich Ebony", color: "#4A2511" }
    ];

    const handleSelect = (color: string) => {
        if(selected === color) {
            setSelected(undefined);
            UserProfileService.getInstance().updateProfile('skinColor', undefined);
            //onClick(undefined);
        } else {
            setSelected(color);
            UserProfileService.getInstance().updateProfile('skinColor', color);
            //onClick(color);
        }
    };
    
    const handleUploadSuccess = (detectedSkinTone: string) => {
        setShowUploadDialog(false);
        setSelected(detectedSkinTone);
        // onClick is not called here to allow the user to confirm the detected tone
    };

    return (
        <>
            <Card 
                className={`
                    w-auto max-w-md mx-auto h-auto
                    group
                    bg-white/5 border-azugh-highlight/10 
                    hover:border-azugh-highlight/30 
                    transition-all duration-700
                    hover:shadow-lg hover:shadow-azugh-highlight/5
                    ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                    ${className}
                `} 
            >
                {hideHeader === false ? (
                    <CardHeader>
                        <CardTitle className="font-manrope text-center text-azugh-accent">
                            {title}
                        </CardTitle>
                        <CardDescription className="text-center text-azugh-text/50">
                            {description}
                        </CardDescription>
                    </CardHeader>
                ) : (
                    <></>
                )}
                <CardContent className={hideHeader ? 'pt-6' : 'pt-0'}>
                    <div className="grid grid-cols-4 gap-6">
                        <div 
                            className="flex flex-col items-center gap-2"
                            onClick={() => setShowUploadDialog(true)}
                        >
                            <div 
                                className={`
                                    w-12 h-12 rounded-full cursor-pointer
                                    transition-all duration-300
                                    bg-gradient-to-r from-[#F8E5D7] via-[#C99B6A] to-[#4A2511]
                                    flex items-center justify-center
                                    relative overflow-hidden
                                    ${selected === 'Detected' ? 'ring-2 ring-azugh-accent scale-105' : 'hover:scale-105'}
                                `}
                                style={{
                                    backgroundSize: "200% 200%",
                                    animation: "gradient 4s ease infinite"
                                }}
                            >
                                <Camera className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                            <span className="text-sm text-azugh-text text-center">
                                Auto Detect
                            </span>
                        </div>

                        {skinColors.map((skin) => (
                            <div 
                                key={skin.name} 
                                className="flex flex-col items-center gap-2"
                                onClick={() => handleSelect(skin.name)}
                            >
                                <div 
                                    className={`
                                        w-12 h-12 rounded-full cursor-pointer
                                        transition-all duration-300
                                        ${selected === skin.name ? 'ring-2 ring-azugh-accent scale-105' : 'hover:scale-105'}
                                    `}
                                    style={{
                                        background: skin.color
                                    }}
                                />
                                <span className="text-sm text-azugh-text">
                                    {skin.name}
                                </span>
                            </div>
                        ))}

                        {/* Auto Detect Skin Tone Button
                        <div 
                            className="flex flex-col items-center gap-2"
                            onClick={() => setShowUploadDialog(true)}
                        >
                            <div 
                                className={`
                                    w-12 h-12 rounded-full cursor-pointer
                                    transition-all duration-300
                                    bg-gradient-to-r from-[#F8E5D7] via-[#C99B6A] to-[#4A2511]
                                    flex items-center justify-center
                                    relative overflow-hidden
                                    ${selected === 'Detected' ? 'ring-2 ring-azugh-accent scale-105' : 'hover:scale-105'}
                                `}
                                style={{
                                    backgroundSize: "200% 200%",
                                    animation: "gradient 4s ease infinite"
                                }}
                            >
                                <Camera className="w-5 h-5 text-white drop-shadow-md" />
                            </div>
                            <span className="text-sm text-azugh-text text-center">
                                Auto Detect
                            </span>
                        </div> */}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button 
                        onClick={() => selected && onClick(selected)} 
                        disabled={!selected}
                        className="w-full bg-azugh-accent hover:bg-azugh-accent/90 text-white transition-colors duration-300 disabled:opacity-80 disabled:cursor-not-allowed"
                    >
                        Continue
                    </Button>
                </CardFooter>
            </Card>
            
            {showUploadDialog && (
                <UploadMedia 
                    onClose={() => setShowUploadDialog(false)}
                    onSuccess={handleUploadSuccess}
                />
            )}
        </>
    );
};


// prepare fictional data for swiping interface
const swipingElements = [
    { url: "/aesthetics/women/clean_girl.png" },
    { url: "/aesthetics/women/downtown_girl.png"},
    { url: "/aesthetics/women/kaleeji.png"},
    { url: "/aesthetics/women/old_money.png"}
];

export const OnboardingSwipingInterface: React.FC<{
    onLike: (index: number) => void;
    onDislike: (index: number) => void;
    showTutorial?: boolean;
    tutorialTitle?: string;
    tutorialDescription?: string;
}> = ({ 
    onLike, 
    onDislike, 
    showTutorial = true,
    tutorialTitle = "How to Find Your Style",
    tutorialDescription = "Swipe through different styles to help us understand your preferences"
}) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-azugh-bg">
            <div 
                className={`
                    w-1/2 max-w-2xl
                    transition-all duration-1000 ease-in-out
                    ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
            >
                <SwipingInterface 
                    elements={swipingElements} 
                    onLike={onLike} 
                    onDislike={onDislike}
                    showTutorial={showTutorial}
                    tutorialTitle={tutorialTitle}
                    tutorialDescription={tutorialDescription}
                />
            </div>
        </div>
    );
}


export const OnboardingConnectPinterest: React.FC<{
    onClick?: () => void;
    title?: string;
    description?: string;
}> = ({
    onClick = () => {},
}) => {
    const [isVisible, setIsVisible] = useState(false);

    const handleConnectPinterest = () =>{
        // Logic to connect Pinterest account
        console.log("Connecting to Pinterest...");
        // add logic to connect to Pinterest later
    }
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <>
        <Card
            className={`
                        w-full max-w-lg mx-auto h-auto cursor-pointer 
                        group
                        bg-white/5 border-azugh-highlight/10 
                        hover:border-azugh-highlight/30 
                        transition-all duration-700
                        hover:shadow-lg hover:shadow-azugh-highlight/5
                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
                    `}
            onClick={handleConnectPinterest}
        >
            <CardHeader>
                <CardTitle className="font-manrope text-center text-azugh-accent">
                    Connect Pinterest
                </CardTitle>
                <CardDescription className="text-sm text-center text-azugh-text/50">
                Connect your Pinterest to share your vision.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div className="
                            flex items-center justify-center 
                            h-auto w-auto mb-4 
                            transition-all duration-700 ease-in-out
                            group-hover:scale-110
                        ">
                    <img src="/logos/pinterest/logo_red_sign.png" className="w-12 h-12 object-contain"></img>
                </div>
            </CardContent>
        </Card>
        <div className={`flex justify-center mt-4
                    transition-all duration-1000 ease-in-out
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <Button 
            variant="outline" 
            onClick={onClick} 
            className='w-full max-w-xs text-azugh-text border-azugh-highlight/10 hover:border-azugh-highlight/30 transition-color duration-300  shadow-sm'
            >
            Skip
            </Button>
        </div>
        </>
    )
}
