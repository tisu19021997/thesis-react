import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import EditCat from './EditCat';
import Pagination from '../../Pagination';

function CatList() {
  const [cats, setCats] = useState([]);
  const [totalCats, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [limit, setLimit] = useState(50);
  const [editing, setEditing] = useState('');
  const [isEditOpen, setEditModal] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const query = `?s=${search}&page=${page}&limit=${limit}`;

    axios.get(`/store-management/cats${query}`)
      .then((res) => {
        const {
          docs, totalPages, totalDocs,
        } = res.data;

        // update state
        setCats(docs);
        setPages(totalPages);
        setTotal(totalDocs);
        setIsSearching(false);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, [page, isSearching, limit, isEdited]);

  const resetPaging = () => {
    setPage(1);
  };

  const deleteHandle = (event) => {
    const id = event.currentTarget.getAttribute('data-id');

    if (window.confirm('Do you really want to delete this category?')) {
      axios.delete(`/store-management/cats/${id}`)
        .then((res) => {
          const { id: catId } = res.data;
          setCats(cats.filter((cat) => (cat._id !== catId)));
        })
        .catch((error) => {
          throw new Error(error);
        });
    }

    return false;
  };

  const editHandle = (event) => {
    setEditing(JSON.parse(event.currentTarget.getAttribute('data-id')));
    setEditModal(true);
    setIsEdited(false);
  };

  return (
    <div className="u-mv-24">
      <div className="u-txt-40 u-txt--bold u-mb-24">
        Category List
      </div>

      <input
        style={{ width: '50%' }}
        className="c-searchbar__box u-mb-24"
        onChange={(event) => {
          const { value } = event.target;
          setSearch(value);
        }}
        type="search"
        placeholder="Search"
        data-border="rounded"
      />

      <button
        type="button"
        className="c-btn c-btn--small c-btn--rounded c-btn--primary"
        onClick={() => {
          setIsSearching(true);
          resetPaging();
        }}
      >
        Search
      </button>

      <div className="u-mv-24 u-txt-16">

        <span className="u-txt--light">Showing</span>
        <input
          style={{
            maxWidth: '70px',
            border: 'none',
            fontWeight: '700',
          }}
          type="number"
          min={limit}
          max={totalCats}
          defaultValue={limit}
          onChange={(event) => {
            setLimit(event.target.value);
            resetPaging();
          }}
          className="u-txt-20"
        />
        <span className="u-txt--light">
          of
          <span className="u-txt-20 u-txt--bold">{` ${totalCats} `}</span>
          cats
        </span>

      </div>

      <table border={1}>
        <thead>
        <tr>
          <th>Name</th>
          <th>Icon</th>
          <th>Category Image</th>
        </tr>
        </thead>
        <tbody>
        {
          cats
            ? cats.map((cat) => (
              <tr key={cat.name}>
                <td>
                  <Link className="u-txt-underline" to={`/cats/${cat.name}`}>
                    {cat.name}
                  </Link>
                </td>
                <td>
                  <FontAwesomeIcon icon={cat.iconClass} />
                </td>
                <td>
                  <img src={cat.imUrl} alt={cat.name} width={200} />
                </td>
                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-id={cat._id}
                    onClick={deleteHandle}
                  >
                    <FontAwesomeIcon icon="times" size="1x" />
                  </button>
                </td>

                <td>
                  <button
                    type="button"
                    className="c-btn c-btn--rounded"
                    data-id={JSON.stringify(cat)}
                    onClick={editHandle}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))
            : <p>Loading</p>
        }
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={pages}
        setPage={setPage}
      />


      <Modal
        style={{
          content: {
            inset: '50% auto auto 50%',
            width: '70%',
            height: '60%',
            transform: 'translate(-50%, -50%)',
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, .35)',
          },
        }}
        isOpen={isEditOpen}
        onRequestClose={() => {
          setEditModal(false);
        }}
      >
        <EditCat
          setIsEdited={setIsEdited}
          closeModal={() => {
            setEditModal(false);
          }}
          cat={editing}
        />
      </Modal>

    </div>
  );
}

export default CatList;
