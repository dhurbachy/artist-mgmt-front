import { ApiError } from "@/services/artist-services";
import { toast } from "sonner";

export const handleApiError = (error: ApiError, defaultTitle = "Action Failed") => {
  // 1. Extract message (handles NestJS arrays or strings)
  const message = error.body?.message || error.statusText || "Something went wrong.";
  const displayMessage = Array.isArray(message) ? message[0] : message;

  // 2. Determine Title based on Status
  const title = 
    error.status === 413 ? "File Too Large" :
    error.status === 401 ? "Unauthorized" :
    error.status === 403 ? "Access Denied" :
    error.status === 404 ? "Resource Not Found" :
    defaultTitle;

  // 3. Fire Toast
  toast.error(title, {
    description: displayMessage,
    action: error.status >= 500 ? {
      label: "Support",
      onClick: () => window.open("/support"),
    } : undefined,
  });

  console.error(`[API Error ${error.status}]:`, error.body);
};