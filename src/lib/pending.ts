import { toast } from "sonner";

export function notifyPending(action: string) {
  toast.info(`${action} isn't available yet`, {
    description: "Backend setup is pending. Nothing was saved or sent.",
  });
}
