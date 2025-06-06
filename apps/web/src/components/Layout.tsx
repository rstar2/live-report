import React from "react";
import { MantineProvider } from "@mantine/core";

import App from "@/components/App";

const dark = true;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        // Override any other properties from default theme
        fontFamily: "Open Sans, sans serif",
        // spacing: { xs: "1rem", sm: "1.2rem", md: "1.5rem", lg: "2rem", xl: "3rem" },
        colorScheme: dark ? "dark" : "light",

        // can be any color defined in theme.colors
        primaryColor: "orange",
      }}
    >
      <App>{children}</App>
    </MantineProvider>
  );
}
export default Layout;

/**
 * HOC for wrapping any passed component type with the Mantine layout
 * @param Comp React component type to wrap
 * @returns a React component type
 */
export function withLayout(Comp: React.ComponentType) {
  return () => {
    return (
      <Layout>
        <Comp />
      </Layout>
    );
  };
}
