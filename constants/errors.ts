export const ERROR_MESSAGES = {
  404: {
    title: "Page Not Found",
    message: "The page you're looking for doesn't exist or has been moved.",
    description: "Please check the URL and try again.",
  },
  403: {
    title: "Access Denied",
    message: "You don't have permission to access this page.",
    description: "Please log in and try again.",
  },
  500: {
    title: "Server Error",
    message: "Something went wrong on our end. Please try again later.",
    description: "If the problem persists, please contact support.",
  },
  401: {
    title: "Unauthorized",
    message: "You need to be logged in to access this page.",
    description: "Please sign in and try again.",
  },
  429: {
    title: "Too Many Requests",
    message: "You've made too many requests. Please wait a moment and try again.",
    description: "Rate limit exceeded. Please slow down your requests.",
  },
} as const;

export type ErrorCode = keyof typeof ERROR_MESSAGES;
