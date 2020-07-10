import React, { useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { gql, useQuery } from '@apollo/client';

const GET_TOP_SELLERS = gql`
  query getTopSellers {
    getTopSellers {
      seller {
        name
        email
      }
      total
    }
  }
` 

const BestSellers = () => {

  const  { data, loading, error, startPolling, stopPolling } = useQuery(GET_TOP_SELLERS);

  useEffect(() => {
    startPolling(1000);
    return () => {
      stopPolling();
    }
  }, [startPolling, stopPolling])

  if(loading) return 'Cargando...';

  const { getTopSellers } = data;
  const sellers = [];
  getTopSellers.map((seller, index) => {
    sellers[index] = {
      ...seller.seller[0],
      total: seller.total
    }
  })

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Mejores vendedores</h1>
      <ResponsiveContainer
        width={'99%'}
        height={550}
      >
        <BarChart
          className="mt-10"
          width={600}
          height={500}
          data={sellers}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3182ce" />
        </BarChart>
      </ResponsiveContainer>
    </Layout>
  );
}
 
export default BestSellers;