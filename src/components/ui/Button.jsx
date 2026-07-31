import { cn } from '../../utils/cn';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

export default function Button({ variant = 'primary', className, children, ...props }) {
  return (
    <button className={cn(variants[variant], className)} {...props}>
      {children}
    </button>
  );
}
