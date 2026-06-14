import * as Icons from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
  key?: any;
}

export const LucideIcon = ({ name, className, size, strokeWidth }: LucideIconProps) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle className={className} size={size} strokeWidth={strokeWidth} />;
  }
  return <IconComponent className={className} size={size} strokeWidth={strokeWidth} />;
};
