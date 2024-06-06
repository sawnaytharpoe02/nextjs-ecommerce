"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { ComponentProps, PropsWithChildren, useMemo } from "react";
import { usePathname } from "next/navigation";

const Nav = ({ children }: PropsWithChildren) => {
  return (
    <div>
      <div className="w-full h-12 bg-primary text-primary-foreground flex justify-center px-4">
        {children}
      </div>
    </div>
  );
};

export default Nav;

export const NavLink = (
  props: Omit<ComponentProps<typeof Link>, "className">
) => {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={cn(
        "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
        pathname === props.href && "bg-background text-foreground"
      )}
    />
  );
};
