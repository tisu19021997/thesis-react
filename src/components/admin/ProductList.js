import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/store-management/products')
      .then((res) => {
        const { docs } = res.data;
        setProducts(docs);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }, []);

  return (
    <table border={1}>
      <tr>
        <th>ASIN</th>
        <th>Name</th>
        <th>Price</th>
        <th>Image URL</th>
      </tr>
      {
        products
          ? products.map((product) => (
            <tr key={product.asin}>
              <td>{product.asin}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.imUrl}</td>
            </tr>
          ))
          : <p>Loading</p>
      }
    </table>
  );
}

export default ProductList;
