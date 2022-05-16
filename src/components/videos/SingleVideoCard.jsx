// This component acts as the container element for the Videos and Search bar elements

import React, { useEffect, useState } from "react";
import SearchProducts from "./searchVideos";
import useAuth from "../../hooks/useAuth";
import Pagination from "./Pagination";

const AllVideos = () => {
  const { products, searchItems, setSearchItems } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearchItems(products);
  }, []);

  return (
    <>
      <div className="banner">
        <div className="top-block">
        </div>
      </div>
      <SearchProducts
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="container">
        {searchItems.length > 0 ? (
          <>
            <Pagination
              pageLimit={5}
              productLimit={20}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        ) : (
          <h1>No Videos to Display</h1>
        )}
      </div>
    </>
  );
};

export default AllVideos;
