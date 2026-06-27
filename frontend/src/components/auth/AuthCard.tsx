import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useDesktopAnimation } from "@/hooks/useDesktopAnimation";
import { scaleIn, fadeUp, staggerContainer } from "@/lib/animations";

export interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * Auth sahifalari uchun markazlashgan glassmorphism card.
 * backdrop-blur faqat shu kichik elementda ishlatiladi.
 */
export function AuthCard({ title, subtitle, children, className }: AuthCardProps) {
  const { shouldAnimate } = useDesktopAnimation();

  const CardWrapper = shouldAnimate ? motion.div : "div";
  const ContentWrapper = shouldAnimate ? motion.div : "div";

  return (
    <CardWrapper
      {...(shouldAnimate ? {
        variants: scaleIn,
        initial: "hidden",
        animate: "visible"
      } : {})}
      className={cn(
        "glass-card w-full max-w-md   p-6 shadow-lg sm:p-8",
        className
      )}
    >
      <ContentWrapper
        {...(shouldAnimate ? {
          variants: staggerContainer,
          initial: "hidden",
          animate: "visible"
        } : {})}
        className="mb-6 space-y-2 text-center sm:mb-8"
      >
        <motion.h1 
          {...(shouldAnimate ? { variants: fadeUp } : {})}
          className="font-heading text-2xl font-bold text-text-primary sm:text-3xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p 
            {...(shouldAnimate ? { variants: fadeUp } : {})}
            className="text-sm text-text-secondary sm:text-base"
          >
            {subtitle}
          </motion.p>
        )}
      </ContentWrapper>
      {children}
    </CardWrapper>
  );
}
