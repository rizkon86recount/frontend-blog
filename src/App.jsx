import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ArticlePage from "./pages/ArticlePage";
import AddArticle from "./pages/AddArticle";
import EditArticle from "./pages/EditArticle";
import About from "./pages/About";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {" "}
        {/* Wrapper dengan flex dan min-h-screen */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/articles/:id" element={<ArticlePage />} />
          <Route path="/add-article" element={<AddArticle />} />
          <Route path="/edit-article/:id" element={<EditArticle />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
