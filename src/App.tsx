import DndCardPage from "./pages/DndCard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import "./App.css";

const App = () => {
  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <DndCardPage />
      </DndProvider>
    </div>
  );
};

export default App;
