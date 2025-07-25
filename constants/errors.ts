import { AlertTriangle, Lock, Server, UserX, Clock } from "lucide-react";

export const ERROR_MESSAGES = {
  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or has been moved.",
    description: "Please check the URL and try again.",
    emoji: "🔍",
    icon: AlertTriangle,
    color: "text-blue-600",
    bgGradient: "from-blue-500 to-indigo-600",
  },
  403: {
    title: "Access Denied",
    message: "You don't have permission to access this page.",
    description: "Please log in and try again.",
    emoji: "🚫",
    icon: Lock,
    color: "text-red-600",
    bgGradient: "from-red-500 to-pink-600",
  },
  500: {
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later.",
    description: "If the problem persists, please contact support.",
    emoji: "🛠️",
    icon: Server,
    color: "text-orange-600",
    bgGradient: "from-orange-500 to-red-600",
  },
  401: {
    title: "Unauthorized",
    message: "You need to be logged in to access this page.",
    description: "Please sign in and try again.",
    emoji: "🔐",
    icon: UserX,
    color: "text-purple-600",
    bgGradient: "from-purple-500 to-indigo-600",
  },
  429: {
    title: "Too Many Requests",
    message: "You've made too many requests. Please wait a moment and try again.",
    description: "Rate limit exceeded. Please slow down your requests.",
    emoji: "⏰",
    icon: Clock,
    color: "text-yellow-600",
    bgGradient: "from-yellow-500 to-orange-600",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
