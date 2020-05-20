import React, { useState, useCallback, useRef } from "react";
import "./App.css";
import produce from "immer";
import { Helmet } from "react-helmet";
import Button from "@material-ui/core/Button";

const numRows = Math.round((window.screen.availHeight - 36) / 25);
const numCols = Math.round((window.screen.availWidth) / 21);

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};
const generateRandomGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => (Math.random() > 0.8 ? 1 : 0)));
  }
  return rows;
};

function App() {

  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [start, setStart] = useState(false);

  const startRef = useRef(start);
  startRef.current = start;

  const [interval, setInterval] = useState(1000);
  const [speedText, setText] = useState("1x");

  const countRef = useRef(interval);
  countRef.current = interval;
  const changeInterval = () => {

    if (interval === 1000) {
      setInterval(500);
      setText("2x");
    }
    else if (interval === 500) {
      setInterval(250);
      setText("4x");
    }
    else if (interval === 250) {
      setInterval(100);
      setText("10x");
    }
    else if (interval === 100) {
      setInterval(1000);
      setText("1x");
    }
  };

  const startSimulation = useCallback(() => {
    if (!startRef.current) {
      return;
    }
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let friends = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                friends += g[newI][newJ];
              }
            });
            if (friends < 2 || friends > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && friends === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setTimeout(startSimulation, countRef.current);
  }, []);

  return (
    <div>
      <Helmet>
        {" "}
        <style>{"body { background-color: #000; }"}</style>{" "}
      </Helmet>
      <div className="buttons">
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setStart(!start);
            if (!start) {
              startRef.current = true;
              startSimulation();
            }
          }}
        >
          {start ? "Stop" : "Start"}
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setGrid(generateEmptyGrid());
          }}
        >
          Clear
        </Button>
        <Button
          color="secondary"
          variant="contained"
          onClick={() => {
            setGrid(generateRandomGrid());
          }}
        >
          Random
        </Button>
        <Button color="secondary" variant="contained" onClick={changeInterval}>
          {speedText}
        </Button>
        <Button color="secondary" variant="contained" className="help" href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life" target="_blank">
          Help
        </Button>
      </div>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "#f50057" : "#EFEFEF",
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
