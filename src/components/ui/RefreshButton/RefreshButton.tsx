'use client';

import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/Button';

interface RefreshButtonProps {
  className?: string;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ className }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleRefresh}
      leftIcon={<RefreshCw size={18} />}
      className={className}
    >
      Обновить страницу (новый SSR)
    </Button>
  );
};
