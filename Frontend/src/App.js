import React from "react";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Cards from "./Components/Cards";
import BodyContainer from "./Components/BodyContainer";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Header />
      <Cards />
      <BodyContainer />
      <Footer />
    </div>
  );
}

export default App;
