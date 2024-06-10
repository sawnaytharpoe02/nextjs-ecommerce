"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { DeleteUser } from "../../_action/users";

export const DeleteDropDownItem = ({ id }: { id: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  return (
    <DropdownMenuItem
      variant="destructive"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await DeleteUser(id);
          router.refresh();
        });
      }}>
      Delete
    </DropdownMenuItem>
  );
};
