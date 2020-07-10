import React, { useContext, useState, useEffect } from 'react';
import OrderContext from '../../context/orders/orderContext';

const ProductResume = ({ product }) => {
  const { name, price } = product;
  const orderContext = useContext(OrderContext);
  const { addProductQuantity, updateTotal } = orderContext;
  const [quantity, setQuantity] = useState(0);
  useEffect(() => {
    updateQuantity();
    updateTotal();
  }, [quantity])
  const updateQuantity = () => {
    const newProduct = {...product, quantity: Number(quantity)}
    addProductQuantity(newProduct);
  }
  return (
    <div className="md:flex md:justify-between md:items-center mt-5">
      <div className="md:w-2/4 mb-2 md:mb-0">
        <p className="text-sm">{name}</p>
        <p> $ {price}</p>
      </div>
      <input 
        type="number"
        placeholder="Cantidad"
        name="quantity"
        value={quantity}
        className="shadow apperance-none border w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline md:ml-4"
        onChange={e => setQuantity(e.target.value)}
      />
    </div>
  );
}
 
export default ProductResume;