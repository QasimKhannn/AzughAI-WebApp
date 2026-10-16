import Logo from "@/components/logos/Logo";
import Loader from "@/components/ui/loader";
import BackgroundLayout from "@/layout/backgrounds/BackgroundLayout";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  showBackground?: boolean;
  className?: string;
}

const LoadingScreen = ({
  showBackground = true,
  className = "",
}: LoadingScreenProps) => {
  const content = (
    <div
      className={`flex flex-col items-center justify-center h-screen ${className}`}
    >
      <div className="flex flex-col items-center justify-center mb-6">
        <div className="flex items-center justify-center" style={{ width: 72, height: 120 }}>
          <Logo width={72} height={72} />
        </div>
        <span className="text-3xl font-light text-foreground mt-3">
          Azugh AI
        </span>
      </div>
      <Loader size={10} dotColor="rgba(0, 0, 0, 1)" />
    </div>
  );

  return (
    <BackgroundLayout>
      <div
        className={cn(
          "w-screen min-h-screen overflow-hidden",
          showBackground ? "bg-transparent" : "bg-white"
        )}
      >
        {content}
      </div>
    </BackgroundLayout>
  );
};

export default LoadingScreen;