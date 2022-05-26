// This component acts as the container element for the Videos and Search bar elements

import React, { useEffect, useState } from "react";
import SearchProducts from "./searchVideos";
import useAuth from "../../hooks/useAuth";
import Pagination from "./Pagination";

const AllVideos = () => {
  const { videos, searchItems, setSearchItems } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearchItems(videos);
  }, []);

  return (
    <>
      <div className="banner">
        <div className="top-block">
        </div>
      </div>
      <SearchVideos
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="container">
        {searchItems.length > 0 ? (
          <>
            <Pagination
              pageLimit={5}
              videoLimit={20}
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
