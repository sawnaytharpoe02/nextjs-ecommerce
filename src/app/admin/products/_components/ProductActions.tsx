"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  DeleteProduct,
  toggleProductAvailability,
} from "../../_action/products";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export const ActivateToggleDropDownItem = ({
  id,
  isAvailableForPurchase,
}: {
  id: string;
  isAvailableForPurchase: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await toggleProductAvailability(id, !isAvailableForPurchase);
          router.refresh();
        });
      }}>
      {isAvailableForPurchase ? "Deactivate" : "Activate"}
    </DropdownMenuItem>
  );
};

export const DeleteDropDownItem = ({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending || disabled}
      onClick={() => {
        startTransition(async () => {
          await DeleteProduct(id);
          router.refresh();
        });
      }}>
      Delete
    </DropdownMenuItem>
  );
};
