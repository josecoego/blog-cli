import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BlogDetails from "./pages/BlogDetails";

import BlogsList from "./pages/BlogsList";

const LazyBlogDetails = React.lazy(() => import("./pages/BlogDetails"));

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/details/:id/:action"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LazyBlogDetails />
              </Suspense>
            }
          />
          <Route path="/" element={<BlogsList />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
