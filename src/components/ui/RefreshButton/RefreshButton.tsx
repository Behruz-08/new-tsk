/**
 * Refresh Button Component
 * Client component for handling page refresh
 */

"use client";

import { Button } from "@/components/ui/Button";
import { RefreshCw } from "lucide-react";
// import styles from "./RefreshButton.module.scss"; // Пока не используется

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
