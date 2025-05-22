import React, { PropsWithChildren } from "react";
import { ApolloClientProvider } from "./ApolloClientProvider";

const MainProviders = ({ children }: PropsWithChildren) => {
  return (
    <ApolloClientProvider>
        {children}
    </ApolloClientProvider>
  );
};

export default MainProviders;
