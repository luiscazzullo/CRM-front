import React, { useContext } from 'react';
import OrderContext from '../../context/orders/orderContext';
import ProductResume from './ProductResume';
const OrderResume = () => {
  const orderContext = useContext(OrderContext);
  const { products } = orderContext;
  return (
    <>
      <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">3.- Ajustas las cantidades del producto </p>
      { products.length > 0 ? (
        products.map(product => {
          return (
            <ProductResume key={product.id} product={product} />
          )
        }) 
      ) : (<p>Aún no hay productos</p>)}
    </>
  );
}
 
export default OrderResume;