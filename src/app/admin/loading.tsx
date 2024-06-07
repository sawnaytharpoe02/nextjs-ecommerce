import React from "react";
import { SymbolIcon } from "@radix-ui/react-icons";

const Loading = () => {
  return (
    <div className="flex justify-center">
      <SymbolIcon className="size-10 animate-spin" />
    </div>
  );
};

export default Loading;
