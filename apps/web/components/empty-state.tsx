import { Button, ButtonProps } from "@/components/ui/button";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string | ReactNode;
  actionText?: string;
  actionHref?: string;
  action?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = "No items found",
  description = "Get started by creating a new item.",
  actionText = "Create New",
  actionHref,
  action,
  icon,
  className = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 text-center ${className}`}>
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        {icon || <AlertCircle className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action || (actionHref && actionText) ? (
        <div className="mt-6">
          {action || (
            <Link href={actionHref!}>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {actionText}
              </Button>
            </Link>
          )}
        </div>
      ) : null}
    </div>
  );
}
