import { cn } from "../../../../../libs/ui/src/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
  open: boolean;
};

export const Drawer = ({ children, className, onClose, open }: Props) => {
  const [shouldHide, setShouldHide] = useState(false);

  return (
    <div
      className={cn(
        "absolute right-0 top-0 z-0 flex h-full w-0",
        open && "z-10 w-full",
        shouldHide && "hidden"
      )}
    >
      <div
        className={cn(
          "h-full w-full bg-black/70 transition-all",
          !open && "hidden"
        )}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onClose();
          }
        }}
        role="button"
        aria-label="Close"
      ></div>
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{
          width: open ? 640 : 0,
          opacity: open ? 1 : 0,
        }}
        exit={{ width: 0, opacity: 0 }}
        className={cn(
          "absolute right-0 top-0 z-10 h-full overflow-y-auto border bg-card",
          className
        )}
        onAnimationStart={() => open && setShouldHide(false)}
        onAnimationComplete={() => !open && setShouldHide(true)}
      >
        {children}
      </motion.div>
    </div>
  );
};
