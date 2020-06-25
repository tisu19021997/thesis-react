import { useEffect, useState } from 'react';
import axios from 'axios';

export const useInput = (initialState) => {
  const [state, setState] = useState(initialState);

  return {
    state,
    setState,
    reset: () => setState(''),
    bind: {
      state,
      onChange: (event) => (setState(event.target.value)),
    },
  };
};

export const useDataList = (endpoint) => {
  const [data, setData] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [search, setSearch] = useState('');
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [limit, setLimit] = useState(100);
  const [sort, setSort] = useState('newest');
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = `${endpoint}?s=${search}&page=${page}&sort=${sort}&limit=${limit}`;

    axios.get(query)
      .then((res) => {
        const {
          docs, totalDocs, totalPages, hasPrevPage, hasNextPage,
        } = res.data;

        setData(docs);
        setPages(totalPages);
        setTotalDataCount(totalDocs);
        setHasPrev(hasPrevPage);
        setHasNext(hasNextPage);
      })
      .catch((e) => e);
  }, [endpoint, limit, page, search, sort]);

  return {
    data,
    totalDataCount,
    page,
    setPage,
    pages,
    setSearch,
    hasPrev,
    hasNext,
    setLimit,
    setSort,
    error,
  };
};
