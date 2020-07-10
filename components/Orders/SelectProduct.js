import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/orders/orderContext';

const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      price
      stock
    }
  }
`

const SelectProduct = () => {
  const [products, setProducts] = useState([]);
  const orderContext = useContext(OrderContext);
  const { addProducts } = orderContext;
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  useEffect(() => {
    addProducts(products);
  }, [products])

  const assingProduct = product => {
    setProducts(product);
  }

  if (loading) return null;
  const { getProducts } = data;

  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">2.- Asigna un producto al pedido </p>
      <Select
        options={getProducts}
        isMulti={true}
        className="mt-3"
        onChange={option => assingProduct(option)}
        getOptionValue={options => options.id}
        getOptionLabel={options => `${options.name} - ${options.stock} disponibles`}
        placeholder="Seleccione los productos"
        noOptionsMessage={() => "No se obtuvieron resultados"}
      />
    </>
  );
}
 
export default SelectProduct;