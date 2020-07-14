import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Wrapper from '../components/Wrapper';
import Section from '../components/Section';
import PrevArrow from '../components/slider/PrevArrow';
import NextArrow from '../components/slider/NextArrow';
import ProductSlider from '../components/slider/ProductSlider';
import local from '../helper/localStorage';
import { UserContext } from '../context/user';
import { Desktop, Mobile } from '../helper/mediaQuery';
import Slider from 'react-slick';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
      recommendProducts: [],
      promotion: [],
      cats: [],
    };

    this.getUserData = this.getUserData.bind(this);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.getUserData(currentUser);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentUser } = this.props;
    if (prevProps.currentUser !== currentUser) {
      this.getUserData(currentUser);
    }
  }

  getUserData(user) {
    if (user) {
      axios.get(`/home/users/${user}`)
        .then((res) => {
          const {
            history, promotion, cats, svd: recommendProducts,
          } = res.data;

          this.setState({
            history,
            recommendProducts,
            promotion,
            cats,
            ready: true,
          });
        })
        .catch((error) => {
          throw new Error(error.message);
        });
    } else {
      const history = local.get('history') || [];

      if (history.length) {
        this.setState({
          history,
        });
      }

      axios.get('/home')
        .then((res) => {
          const { promotion, cats } = res.data;

          this.setState({
            promotion,
            cats,
            ready: true,
          });
        });
    }
  }

  render() {
    const { ready, history, recommendProducts, promotion, cats } = this.state;

    if (!ready) {
      return false;
    }

    const historyProducts = history.map((product) => (product.product));

    const sliderSettings = {
      slidesToShow: 4,
      slidesToScroll: 4,
      adaptiveHeight: false,
      infinite: historyProducts.length > 100, // fix slick slider bug auto duplicate
      dots: true,
      dotsClass: 'c-section__dots slick-dots',
      arrows: true,
      draggable: true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
    };

    const catSliderSettings = {
      slidesToShow: 3,
      slidesToScroll: 3,
      adaptiveHeight: false,
      infinite: cats.length > 100, // fix slick slider bug auto duplicate
      dots: true,
      dotsClass: 'c-section__dots slick-dots',
      arrows: true,
      draggable: true,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
    };

    const sliderMobileSettings = {
      slidesToShow: 2.5,
      slidesToScroll: 3,
      infinite: false,
      lazyLoad: 'ondemand',
      dots: false,
      arrows: false,
      draggable: true,
    };

    const catSlider = cats.map((cat) => (
      <React.Fragment key={cat._id}>
        <div className="u-pos-relative">

          <Link
            to={`/categories/${cat._id}`}
            className="u-pos-absolute u-txt-24 u-txt--bold u-ml-12 u-mt-12 u-w--50"
          >
            {cat.name[cat.name.length - 1]}
          </Link>
          <Link
            to={`/categories/${cat._id}`}
            className="u-pos-absolute u-pos-bot-0 u-txt-14 u-txt-underline u-txt--light u-ml-12 u-mb-12"
          >
            More
          </Link>
          <img
            style={{
              height: '260px',
              objectFit: 'cover',
            }}
            className="u-w--100"
            src={cat.imUrl}
            alt={cat.name}
          />
        </div>
      </React.Fragment>
    ));

    return (
      <UserContext.Consumer>
        {() => (
          <Wrapper className="u-ph-0">

            <Desktop>

              {cats.length > 0 && (
                <Section title="Categories that may fit you">
                  <Slider
                    {...catSliderSettings}
                    className="c-slider c-slider--small-gut c-slider--same-h c-slider--right-dots"
                  >
                    {catSlider}
                  </Slider>
                </Section>
              )}

              {promotion.length
                ? (
                  <Section title="Today's Deal" data="Random">
                    <ProductSlider
                      products={promotion}
                      settings={sliderSettings}
                      className="c-slider [  c-slider--tiny-gut c-slider--right-dots ] u-ph-48"
                    />
                  </Section>
                )
                : null}

              {recommendProducts.length
                ? (
                  <Section title="Related to items you rated" data="Recommendation">
                    <ProductSlider
                      products={recommendProducts}
                      settings={sliderSettings}
                      className="c-slider [  c-slider--tiny-gut c-slider--right-dots ] u-ph-48"
                    />
                  </Section>

                )
                : null}

              {historyProducts.length > 0
                ? (
                  <Section title="Pick up where you left off" data="History">
                    <ProductSlider
                      products={historyProducts}
                      settings={sliderSettings}
                      className="c-slider [  c-slider--tiny-gut c-slider--right-dots ] u-ph-48"
                    />
                  </Section>
                )
                : null}

            </Desktop>


            <Mobile>
              {promotion.length
                ? (
                  <Section
                    className="u-pl-6"
                    title="Today's Deal"
                    data="Random"
                    titleClass="c-section__title [ c-section__title--no-margin ] u-m-0"
                    subTitle={(
                      <div className="c-section__sub-title u-txt-underline">
                        <Link to="/">See all</Link>
                      </div>
                    )}
                  >
                    <ProductSlider
                      products={promotion}
                      settings={sliderMobileSettings}
                    />
                  </Section>
                )
                : ''}

              {historyProducts.length
                ? (
                  <Section
                    className="u-pl-6"
                    title="Pick up where you left off"
                    titleClass="c-section__title [ c-section__title--no-margin ] u-m-0"
                    subTitle={(
                      <div className="c-section__sub-title u-txt-underline">
                        <Link to="/">See all</Link>
                      </div>
                    )}
                  >
                    <ProductSlider
                      products={historyProducts}
                      settings={sliderMobileSettings}
                    />
                  </Section>
                )
                : null}

              {recommendProducts.length
                ? (
                  <Section
                    className="u-pl-6"
                    title="Related to items you rated"
                    data="Recommendation"
                    subTitle={(
                      <div className="c-section__sub-title u-txt-underline">
                        <Link to="/">See all</Link>
                      </div>
                    )}
                  >
                    <ProductSlider
                      products={recommendProducts}
                      settings={sliderMobileSettings}
                    />
                  </Section>
                )
                : null}


            </Mobile>

          </Wrapper>
        )}
      </UserContext.Consumer>
    );
  }
}

Home.contextType = UserContext;

Home.propTypes = {
  currentUser: PropTypes.string,
};

Home.defaultProps = {
  currentUser: '',
};

export default Home;
