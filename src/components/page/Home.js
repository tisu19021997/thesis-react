import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Wrapper from '../Wrapper';
import Section from '../Section';
import PrevArrow from '../slider/PrevArrow';
import NextArrow from '../slider/NextArrow';
import ProductSlider from '../slider/ProductSlider';
import local from '../../helper/localStorage';
import { UserContext } from '../../context/user';
import { Desktop, Mobile } from '../../helper/mediaQuery';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [],
    };

    this.getUserHistory = this.getUserHistory.bind(this);
  }

  componentDidMount() {
    const { currentUser } = this.props;
    this.getUserHistory(currentUser);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { currentUser } = this.props;
    if (prevProps.currentUser !== currentUser) {
      this.getUserHistory(currentUser);
    }
  }

  getUserHistory(user) {
    if (user) {
      axios.get(`/home/${user}`)
        .then((res) => {
          const { history } = res.data;

          this.setState({
            history,
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
          ready: true,
        });
      }

      // TODO: implement axios request for other products (except history products)
    }
  }

  render() {
    const { ready, history } = this.state;

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

    return (
      <UserContext.Consumer>
        {() => (
          <Wrapper className="u-ph-0">

            <Desktop>
              <Section title="Pick up where you left off" data="History">


                {historyProducts.length
                  ? (
                    <ProductSlider
                      products={historyProducts}
                      settings={sliderSettings}
                      className="c-slider [  c-slider--tiny-gut c-slider--right-dots ] u-ph-48"
                    />

                  )
                  : ''}


              </Section>
            </Desktop>


            <Mobile>
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

                {historyProducts.length
                  ? (
                    <ProductSlider
                      products={historyProducts}
                      settings={sliderMobileSettings}
                    />
                  )
                  : ''}

              </Section>

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
