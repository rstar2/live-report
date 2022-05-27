import { useState } from "react";
import { withLayout } from "../components/Layout";
import Images from "../components/Images";

import logo from "../assets/logo.svg";
import muffin from "../assets/muffin.png";

import "./today.css";

function Today() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Images list={[]} title="Today" />

      <header>
        <img src={logo} className="App-logo" alt="logo" />
        <img src={muffin} alt="muffin" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {" | "}
          <a
            className="App-link"
            href="https://vitejs.dev/guide/features.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default withLayout(Today);
