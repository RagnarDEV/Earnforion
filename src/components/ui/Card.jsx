import { cn } from '../../utils/cn';

export default function Card({ children, className, featured = false }) {
  return (
    <div
      className={cn(
        'card-premium',
        featured && 'border-l-4 border-l-blue-500 bg-blue-50/20 dark:bg-blue-900/10',
        className
      )}
    >
      {children}
    </div>
  );
}
