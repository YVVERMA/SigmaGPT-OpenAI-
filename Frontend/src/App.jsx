import Sidebar from "./sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContextProvider } from "./MyContext.jsx";
import "./App.css";

function App() {
  return (
    <MyContextProvider>
      <div className="app">
        <Sidebar />
        <ChatWindow />
      </div>
    </MyContextProvider>
  );
}

export default App;