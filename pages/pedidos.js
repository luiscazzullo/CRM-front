import React from "react";
import Layout from "../components/Layout/Layout";
import Link from 'next/link';
import Order from '../components/Orders/Order';
//Queries
import { gql, useQuery } from '@apollo/client';

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

const Orders = () => {
  const { data, loading, error } = useQuery(GET_ORDERS_BY_SELLER);

  if(loading) return 'Cargando...'

  const { getOrdersBySeller } = data;

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>
        <Link href="/nuevopedido">
          <a className="bg-blue-800 py-2 px-5 mt-3 inline-block text-white hover:bg-gray-800 hover:text-gray-200 mb-3 rounded uppercase font-bold text-sm">
            Nuevo Pedido
          </a>
        </Link>
        { getOrdersBySeller.length === 0 ? (
          <p className="mt-5 text-center text-2xl">No hay pedidos aún</p>
        ) : (
          getOrdersBySeller.map(order => (
            <Order key={order.id} order={order} />
          ))
        )
        }
      </Layout>
    </div>
  );
};

export default Orders;
