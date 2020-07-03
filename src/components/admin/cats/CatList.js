import React, { useState, useRef } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import EditCat from './EditCat';
import Pagination from '../../Pagination';
import { useDataList } from '../../../helper/hooks';
import SearchBar from '../../SearchBar';
import DataTableWithHandlers from '../../DataTableWithHandlers';

function CatList() {
  const {
    data: cats, setData: setCats, totalDataCount: totalCats, pages, page, limit,
    setPage, setSearch, setLimit, hasNext, hasPrev, triggerFetch, fetchTriggerer,
  } = useDataList('/management/cats');

  const searchInputRef = useRef(null);

  const [editing, setEditing] = useState({});
  const [isEditOpen, setEditModal] = useState(false);

  const handlers = [
    {
      label: 'Delete',
      cb: (event) => {
        const id = event.currentTarget.getAttribute('data-index');

        if (window.confirm('Do you really want to delete this category?')) {
          axios.delete(`/management/cats/${id}`)
            .then((res) => {
              const { id: catId } = res.data;
              setCats(cats.filter((cat) => (cat._id !== catId)));
            })
            .catch((error) => {
              throw new Error(error);
            });
        }

        return false;
      },
    },
    {
      label: 'Edit',
      cb: (event) => {
        const id = event.currentTarget.getAttribute('data-index');
        const curCat = cats.filter((cat) => cat._id === id)[0];
        const { name, iconClass, imUrl } = curCat;

        setEditing({
          id,
          name,
          iconClass,
          imUrl,
        });
        setEditModal(true);
        triggerFetch(!fetchTriggerer);
      },
    },
  ];

  return (
    <div className="u-mv-24">
      <div className="u-txt-40 u-txt--bold u-mb-24">
        Category List
      </div>

      <div className="u-w--50 u-mb-24">
        <SearchBar
          inputStyle={{
            height: '50px',
          }}
          searchHandler={(event) => {
            event.preventDefault();
            setSearch(searchInputRef.current.value);
            setPage(1);
          }}
          inputRef={searchInputRef}
        />
      </div>

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
            setLimit(parseInt(event.target.value, 10));
            setPage(1);
          }}
          className="u-txt-20"
        />
        <span className="u-txt--light">
          of
          <span className="u-txt-20 u-txt--bold">{` ${totalCats} `}</span>
          cats
        </span>

      </div>


      <div className="u-mb-24">
        <Pagination
          currentPage={page}
          totalPages={pages}
          setPage={setPage}
          hasNextPage={hasNext}
          hasPrevPage={hasPrev}
        />
      </div>

      {cats.length > 0 && (
        <DataTableWithHandlers
          handlers={handlers}
          indexField="_id"
          fields={['name', 'imUrl', 'iconClass']}
          data={cats}
        />
      )}

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
          callback={triggerFetch}
          callbackParam={fetchTriggerer}
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
