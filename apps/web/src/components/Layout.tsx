import React from "react";
import { MantineProvider } from "@mantine/core";

import App from "@/components/App";

const dark = false;

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={{
        // Override any other properties from default theme
        fontFamily: "Open Sans, sans serif",
        spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
        colorScheme: dark ? "dark" : "light",
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
