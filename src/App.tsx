import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";

import { subscribeWindowSizeChange, WindowSize } from "@/lib/window";
import { useEffect, useSyncExternalStore } from "react";

import Scene0 from "./routes/Scene0";
import Scene1 from "./routes/Scene1";
import Scene2 from "./routes/Scene2";
import Scene3 from "./routes/Scene3";
import Scene4 from "./routes/Scene4";
import Scene5 from "./routes/Scene5";
import Scene6 from "./routes/Scene6";

import Check1 from "./routes/Check1";

import Scene7 from "./routes/Scene7";
import Scene8 from "./routes/Scene8";
import Scene9 from "./routes/Scene9";

import Scene7d from "./routes/Scene7d";
import Scene8d from "./routes/Scene8d";
import Scene9d from "./routes/Scene9d";

import Check2 from "./routes/Check2";

import Scene10 from "./routes/Scene10";

const getContainerWidthRatio = (width: number) => {
  if (width <= 768) {
    return 0.8;
  } else if (width <= 1024) {
    return -0.15 / 256 * (width - 1024) + 0.7;
  } else {
    return 0.5;
  }
};

const App = () => {
  const windowSize: WindowSize = {
    width: useSyncExternalStore(
      subscribeWindowSizeChange,
      () => window.innerWidth,
    ),
    height: useSyncExternalStore(
      subscribeWindowSizeChange,
      () => window.innerHeight,
    ),
  };

  const containerWidthRatio = getContainerWidthRatio(windowSize.width);

  const containerWidth = windowSize.width * containerWidthRatio;

  const baseSize = containerWidth / 24;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === " ") {
      // スクロールを無効化
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={<Home containerWidth={containerWidth} />}
      />
      <Route
        path="/0"
        element={<Scene0 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/1"
        element={<Scene1 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/2"
        element={<Scene2 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/3"
        element={<Scene3 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/4"
        element={<Scene4 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/5"
        element={<Scene5 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/6"
        element={<Scene6 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/A"
        element={<Check1 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/7"
        element={<Scene7 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/7d"
        element={
          <Scene7d containerWidth={containerWidth} baseSize={baseSize} />
        }
      />
      <Route
        path="/8"
        element={<Scene8 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/8d"
        element={
          <Scene8d containerWidth={containerWidth} baseSize={baseSize} />
        }
      />
      <Route
        path="/9"
        element={<Scene9 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/9d"
        element={
          <Scene9d containerWidth={containerWidth} baseSize={baseSize} />
        }
      />
      <Route
        path="/B"
        element={<Check2 containerWidth={containerWidth} baseSize={baseSize} />}
      />
      <Route
        path="/10"
        element={
          <Scene10 containerWidth={containerWidth} baseSize={baseSize} />
        }
      />
    </Routes>
  );
};

export default App;
