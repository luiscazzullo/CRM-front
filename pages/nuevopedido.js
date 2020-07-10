import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
//Components
import Layout from '../components/Layout/Layout';
import SelectClient from '../components/Orders/SelectClient';
import SelectProduct from '../components/Orders/SelectProduct';
import OrderResume from '../components/Orders/OrderResume';
import Total from '../components/Orders/Total';
//Context
import OrderContext from '../context/orders/orderContext';
//Queries
import { gql, useMutation } from '@apollo/client';

const NEW_ORDER = gql`
  mutation newOrder($input: OrderInput) {
    newOrder(input: $input) {
      id
    }
  }
`

const GET_ORDERS_BY_SELLER = gql`
  query getOrdersBySeller {
    getOrdersBySeller {
      id
      order {
        id
        quantity,
        name
      }
      client {
        id
        name
        lastname
        email
        phone
      }
      seller
      total
      state
    }
  }
`

const NewOrder = () => {
  const router = useRouter();
  const [message, setMessage] = useState(null);

  const orderContext = useContext(OrderContext);
  const { client, products, total } = orderContext;
  
  const [newOrder] = useMutation(NEW_ORDER, {
    update(cache, { data: { newOrder }}) {
      const { getOrdersBySeller } = cache.readQuery({
        query: GET_ORDERS_BY_SELLER
      })
      cache.writeQuery({
        query: GET_ORDERS_BY_SELLER,
        data: {
          getOrdersBySeller: [...getOrdersBySeller, NewOrder]
        }
      })
    }
  });
  
  const validateOrder = () => {
    return !products.every(product => product.quantity > 0)  || total === 0 || client.length === 0 ? " opacity-50 cursor-not-allowed " : ""
  }
  
  const createNewOrder = async () => {
    const { id } = client
    const order = products.map(({__typename, stock, ...product}) => product)
    try {
      const { data } = await newOrder({
        variables: {
          input: {
            client: id,
            total,
            order
          }
        }
      })
      router.push('/pedidos');
      Swal.fire('Correcto', 'El pedido se registró', 'success');
    } catch (error) {
      setMessage(error.message.replace('GraphQL error: ', ''))
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }

  const showMessage = () => {
    return (
      <div className="bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto">
        <p>{message}</p>
      </div>
    )
  }

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear pedido</h1>
      { message && showMessage()}
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <SelectClient />
          <SelectProduct />
          <OrderResume />
          <Total />
          <button
            type="button"
            className={`bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validateOrder()}`}
            onClick={createNewOrder}
          >
            Finalizar pedido
          </button>
        </div>
      </div>
    </Layout>
  );
}
 
export default NewOrder;