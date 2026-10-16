import { useTheme } from "next-themes"
import { Toaster as Sonner, toast as sonnerToast } from "sonner"
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react"
import React from "react"

type ToasterProps = React.ComponentProps<typeof Sonner>
type ToastType = "success" | "error" | "warning" | "info" | "default"

const statusStyles: Record<
  ToastType,
  {
    borderColor: string
    icon: React.ReactNode
    iconBg: string
    iconColor: string
  }
> = {
  success: {
    borderColor: "#22c55e", // green-500
    icon: <CheckCircle className="w-6 h-6" />,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  error: {
    borderColor: "#ef4444", // red-500
    icon: <XCircle className="w-6 h-6" />,
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
  },
  warning: {
    borderColor: "#facc15", // yellow-400
    icon: <AlertTriangle className="w-6 h-6" />,
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  info: {
    borderColor: "#3b82f6", // blue-500
    icon: <Info className="w-6 h-6" />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  default: {
    borderColor: "#DED8D4",
    icon: null,
    iconBg: "",
    iconColor: "",
  },
}

// Helper for consistent toast usage
function toast(
  message: string,
  opts?: {
    type?: ToastType
    title?: string
    description?: string
    action?: React.ReactNode
    cancel?: React.ReactNode
    duration?: number
  }
) {
  const status = statusStyles[opts?.type || "default"]
  return sonnerToast(message, {
    ...opts,
    duration: opts?.duration ?? 3500,
    icon: status.icon ? (
      <span
        className={`flex items-center justify-center rounded-full ${status.iconBg} ${status.iconColor} mt-0.5`}
        style={{ minWidth: 32, minHeight: 32 }}
      >
        {status.icon}
      </span>
    ) : undefined,
    style: {
      borderLeft: `4px solid ${status.borderColor}`,
    },
  })
}

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster"
      toastOptions={{
        classNames: {
          toast:
            "flex items-start gap-3 bg-white text-gray-900 border border-gray-200 shadow-xl rounded-xl px-5 py-4 min-w-[320px] max-w-[380px] font-manrope",
          description: "text-gray-700 text-sm mt-1",
          actionButton:
            "bg-azugh-accent text-white rounded-lg px-4 py-2 font-medium shadow hover:bg-azugh-accent/90 transition",
          cancelButton:
            "bg-gray-100 text-gray-700 rounded-lg px-4 py-2 font-medium hover:bg-gray-200 transition",
        },
      }}
      position="top-center"
      {...props}
    />
  )
}

export { Toaster, toast }
