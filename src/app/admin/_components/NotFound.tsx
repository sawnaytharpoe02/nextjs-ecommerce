import React from "react";
import Link from "next/link";
import { FaceIcon, HeartFilledIcon } from "@radix-ui/react-icons";

type NotFoundProps = {
  title: string;
  href: string;
};
const NotFound = ({ title, href }: NotFoundProps) => {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceIcon className="size-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 Not Found</h2>
      <p>Could not find the requested {title}.</p>
      <Link
        href={href}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:opacity-85">
        Go Back
      </Link>
    </main>
  );
};

export default NotFound;
