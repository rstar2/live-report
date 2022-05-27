import React, { useState } from "react";
import { Anchor, AppShell, Navbar, Header, Footer, Text, MediaQuery, Burger, useMantineTheme } from "@mantine/core";
import { Link } from "react-router-dom";
import { createTo } from "../routes";

export default function App({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  return (
    <AppShell
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      fixed
      header={
        <Header height={70} p="md">
          <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Text>Cherniovo Live Report</Text>
          </div>
        </Header>
      }
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
          <Anchor component={Link} to={createTo("today")}>
            Today - {today.toDateString()}
          </Anchor>
          <Anchor component={Link} to={createTo("yesterday")}>
            Yesterday - {yesterday.toDateString()}
          </Anchor>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Copyright &copy; {new Date().getFullYear() + " "}
          <Text component="span" variant="gradient">
            Rumen Neshev
          </Text>
        </Footer>
      }
    >
      {children}
    </AppShell>
  );
}
