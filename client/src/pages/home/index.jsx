import React from "react";
import Table from "./Table";
import SearchForm from "./SearchForm";

import { GlobalProvider } from "../../context/GlobalState";

const Home = () => {
  return (
    <div className="container-fluid mt-3">
      <GlobalProvider>
        <SearchForm />
        <Table />
      </GlobalProvider>
    </div>
  );
};

export default Home;
