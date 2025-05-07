declare module 'react-hot-toast' {
  import { ReactNode } from 'react';

  export interface ToasterProps {
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
    toastOptions?: {
      duration?: number;
      style?: React.CSSProperties;
      className?: string;
      success?: {
        duration?: number;
        iconTheme?: {
          primary: string;
          secondary: string;
        };
      };
      error?: {
        duration?: number;
        iconTheme?: {
          primary: string;
          secondary: string;
        };
      };
    };
    reverseOrder?: boolean;
    gutter?: number;
    containerStyle?: React.CSSProperties;
    containerClassName?: string;
    children?: (toast: any) => ReactNode;
  }

  export const Toaster: React.FC<ToasterProps>;

  export interface Toast {
    (message: string, options?: any): string;
    success: (message: string, options?: any) => string;
    error: (message: string, options?: any) => string;
    loading: (message: string, options?: any) => string;
    custom: (render: (t: any) => ReactNode, options?: any) => string;
    dismiss: (toastId?: string) => void;
  }

  export const toast: Toast;
} 