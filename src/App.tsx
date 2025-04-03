import { Route, Routes } from "react-router-dom";
import "./App.css";
import GlobalLayout from "./components/GlobalLayout";
import Home from "./pages/Home";
import Items from "./pages/items";
import AddItem from "./pages/add-item";
import Settings from "./settings";
import AuthPage from "./pages/AuthPage";
import pkg from 'react-router-dom';

console.log('✅ react-router-dom keys:', Object.keys(pkg));
console.log('✅ useLocation:', typeof pkg.useLocation);

export function App() {
  return (
      <GlobalLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/add-item" element={<AddItem />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </GlobalLayout>
    
  );
}

export default App;
