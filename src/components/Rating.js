import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Pagination from './Pagination';
import { useInput } from '../helper/hooks';
import { nowString } from '../helper/string';

function Rating(props) {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ratings, setRatings] = useState([]);

  const { state: summary, bind: bindSummary } = useInput('');
  const { state: reviewText, bind: bindReviewText } = useInput('');
  const { state: overall, bind: bindOverall } = useInput(1);
  const { asin, user, productId } = props;

  useEffect(() => {
    axios.get(`/ratings/${asin}?page=${page}`)
      .then((res) => {
        const {
          ratings: ratingList, totalPages: pages, page: currentPage,
        } = res.data;

        setPage(currentPage);
        setTotalPages(pages);
        setRatings(ratingList);
      })
      .catch((error) => {
        throw new Error(error.message);
      });
  }, [page, asin]);


  const newRating = async (event) => {
    event.preventDefault();

    const data = {
      rating: {
        product: productId,
        reviewer: user,
        reviewText,
        summary,
        overall,
        unixReviewTime: Date.now(),
        reviewTime: nowString(),
      },
      user,
    };

    // Save new rating to Database
    await axios.post('/ratings', data)
      .then((res) => {
        const { rating } = res.data;
        setRatings([rating, ...ratings]);
      })
      .catch((err) => {
        throw new Error(err);
      });

    const reviewVector = {
      user,
      item: asin,
      rating: overall,
      k: 100,
    };
    await axios.patch(`/users/${user}/recommendations`, reviewVector)
      .then(() => true)
      .catch((err) => {
        throw new Error(err);
      });
  };

  let ratingsDOM;

  if (ratings) {
    ratingsDOM = ratings.map((rating) => {
      const starRating = [];

      for (let i = 1; i <= rating.overall; i += 1) {
        starRating.push(<FontAwesomeIcon className="u-mr-4" icon="star" key={i} />);
      }

      return (
        <div className="u-mb-24" key={rating._id}>

          {/* RATING INFORMATION */}
          <div className="o-media [ o-media--small ]">
            <div className="o-media__img c-avatar [ c-avatar--small ]">
              <img
                src="asset/img/avatar-1.svg"
                alt="Avatar"
              />
            </div>

            <div className="o-media__body u-txt-14">
              <div
                className="u-txt--bold u-mb-6"
              >
                {rating.reviewer.name}
              </div>

              <div className="u-txt-12">

                {/* STAR RATINGS */}
                <span className="u-mr-6">{starRating}</span>

                {/* RATING TIME */}
                <span className="u-txt--light u-txt--blur">{rating.reviewTime}</span>

              </div>

            </div>

          </div>
          {/* /RATING INFORMATION */}

          {/* RATING HEADING */}
          <div
            className="u-mt-12 u-txt--bold u-txt-16"
          >
            {rating.summary}
          </div>

          {/* RATING CONTENT */}
          <div className="u-txt-14 u-mt-6">
            {rating.reviewText}
          </div>

        </div>
      );
    });
  }

  return (
    <section className="c-section u-mt-24 u-mb-36">

      {/* RATING LIST */}
      {ratingsDOM}
      {/* /RATING LIST */}

      <div className="u-txt-align-right u-mh-24">
        <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
      </div>

      {/* NEW RATING */}
      <div className="u-txt-24 u-txt--hairline u-mb-24">
        Write your own review
      </div>

      <form method="post" onSubmit={newRating}>


        <div className="u-mb-12 u-txt-12 u-txt--light">

          <input
            className="u-w--80 u-pv-12 u-mb-12"
            {...bindSummary}
            type="text"
            placeholder="Your review's title"
            required
          />
          <textarea
            className="u-w--80 u-pv-12"
            cols="8"
            rows="4"
            {...bindReviewText}
            placeholder="What do you want to say about this product?"
            required
          />

        </div>

        <div>
          <span className="u-txt-12 u-txt--blur">Rate this product</span>
          <input
            style={{
              maxWidth: '70px',
              border: 'none',
              fontSize: '14px',
            }}
            {...bindOverall}
            type="number"
            min={1}
            max={5}
            defaultValue={1}
            className="u-txt-20"
            required
          />
        </div>

        <div className="u-mt-36 u-txt-align-right u-txt-12">
          <button
            className="c-btn [ c-btn--rounded c-btn--secondary ] u-w--15"
            type="reset"
          >
            Cancel
          </button>
          <button
            className="c-btn [ c-btn--rounded c-btn--primary ] u-w--15 u-ml-12"
            type="submit"
          >
            Post
          </button>
        </div>


      </form>
      {/* /NEW RATING */}

    </section>
  );
}

Rating.propTypes = {
  asin: PropTypes.string.isRequired,
  user: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
};

export default Rating;
