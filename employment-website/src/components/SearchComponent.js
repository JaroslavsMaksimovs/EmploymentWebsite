import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const SearchComponent = () => {
  const [query, setQuery] = useState('');


  const search = () => {
    setQuery('');
  };
/*
w3schools.com (2020), “How TO – Search Button”, Available at https://www.w3schools.com/howto/howto_css_search_button.asp
*/
  return(
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
      <button id="search-button" type="submit" onClick={search}><i className="fa fa-search"><Link className="search-button" to={`/vacancies/${query}`} /></i></button>
      <input id="search-query" type="search" placeholder="Search.." value={query} onChange={(event) => setQuery(event.target.value)} />
    </>
  );
};

export default SearchComponent;
