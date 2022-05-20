import React from "react";
import { MantineProvider, AppShell, Navbar, Header } from "@mantine/core";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider
      theme={{
        // Override any other properties from default theme
        fontFamily: "Open Sans, sans serif",
        spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
        colorScheme: "dark",
      }}
    >
      <AppShell
        padding="md"
        navbar={
          <Navbar width={{ base: 300 }} p="xs">
            Navbar content
          </Navbar>
        }
        header={
          <Header height={60} p="xs">
            Header content
          </Header>
        }
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        {children}
      </AppShell>
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
