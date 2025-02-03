import { cn } from '@/lib/utils';
import { cva, VariantProps } from 'class-variance-authority';
import { Loader, LoaderCircle, Sparkle } from 'lucide-react';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      default: 'h-4 w-4',
      sm: 'h-2 w-2',
      md: 'h-4 w-4',
      lg: 'h-6 w-6',
      icon: 'h-16 w-16',
    },
    variant: {
      loader: 'text-[#ffaa05]',
      loaderCircle: 'text-[#ffaa05]',
      sparkle: 'text-[#ffaa05] fill-current',
    },
  },
  defaultVariants: {
    size: 'default',
    variant: 'loaderCircle',
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

const icons = {
  loader: Loader,
  loaderCircle: LoaderCircle,
  sparkle: Sparkle,
} as const;

export const Spinner = ({ size, variant, className }: SpinnerProps) => {
  const IconComponent = icons[variant || 'loaderCircle'];

  return <IconComponent className={cn(spinnerVariants({ size, variant }), className)} />;
};
