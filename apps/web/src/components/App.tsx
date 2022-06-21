import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import { Anchor, AppShell, Navbar, Header, Footer, Text, MediaQuery, Burger, useMantineTheme } from "@mantine/core";

import { createTo } from "@/routes";

// import logo from "@/assets/logo.svg";
// import muffin from "@/assets/muffin.png";

export default function App({ children }: { children: React.ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  return (
    <AppShell
      /* NOTE: Apply style with the Styles API to concrete App sub-element - e,g. by passing classes */
      styles={{
        main: {
          background: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      fixed
      header={
        <Header height={70} p="md">
          {/* NOTE: Apply style with the Styles API to a - e.g. with inline styles */}
          <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.orange[6]}
                mr="md"
              />
            </MediaQuery>

            <Text color={theme.colors.orange[5]} size="xl">
              Cherniovo Live Report
            </Text>
          </div>
        </Header>
      }
      navbar={
        <Navbar p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 120, lg: 150 }}>
          <Link to="today" name="Today" />
          <Link to="yesterday" name="Yesterday" />
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
      {/* <img src={logo} className="App-logo" alt="logo" />
      <img src={muffin} alt="muffin" /> */}
    </AppShell>
  );
}

function Link({ to, name }: { to: string; name: string }) {
  const theme = useMantineTheme();
  return (
    <Anchor component={NavLink} to={createTo(to)} activeStyle={{ color: theme.colors.orange[9] }}>
      {name}
    </Anchor>
  );
}
