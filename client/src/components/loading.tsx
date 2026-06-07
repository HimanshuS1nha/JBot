import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

const Loading = ({
  size = 20,
  className,
}: {
  size?: number;
  className?: string;
}) => {
  return (
    <Loader2Icon
      className={cn("animate-spin text-primary", className)}
      size={size}
    />
  );
};

export default Loading;
