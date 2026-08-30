import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'group/button inline-flex shrink-0 items-center justify-center font-semibold whitespace-nowrap transition-all outline-none select-none cursor-pointer disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        outline:
          'border border-border/90 bg-background text-foreground hover:bg-muted/70 hover:text-foreground shadow-2xs',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-2xs',
        ghost: 'hover:bg-muted/70 hover:text-foreground',
        destructive:
          'bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white',
        success: 'bg-safe text-safe-foreground shadow-xs hover:bg-safe/90',
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto font-normal',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm rounded-xl gap-2',
        sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
        lg: 'h-10 px-5 text-sm rounded-xl gap-2.5',
        icon: 'size-9 rounded-xl',
        'icon-sm': 'size-8 rounded-lg',
        'icon-lg': 'size-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
