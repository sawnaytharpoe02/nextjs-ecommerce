import React, { PropsWithChildren } from "react";

const PageHeader = ({ children }: PropsWithChildren) => {
  return <div className="text-4xl font-medium mb-6">{children}</div>;
};

export default PageHeader;
