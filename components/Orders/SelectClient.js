import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import OrderContext from '../../context/orders/orderContext';

const GET_CLIENTS_BY_SELLER = gql`
  query getClientsBySeller {
    getClientsBySeller {
      id
      name
      lastname
      company
      email
    }
  }
`;

const SelectClient = () => {
  const [client, setClient] = useState([]);
  const orderContext = useContext(OrderContext);
  const { addClient } = orderContext;
  const { data, loading, error } = useQuery(GET_CLIENTS_BY_SELLER);
  useEffect(() => {
    addClient(client)
  }, [client])
  const assignClient = clients => {
    setClient(clients);
  }
  if(loading) return null;
  const { getClientsBySeller } = data;
  
  return (
    <>
    <p className="mt-10 my-2 bg-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold">1.- Asigna un cliente al pedido </p>
    <Select
      options={getClientsBySeller} 
      className="mt-3"
      onChange={option => assignClient(option)}
      getOptionValue={options => options.id}
      getOptionLabel={options => options.name}
      placeholder="Seleccione un cliente"
      noOptionsMessage={() => "No se obtuvieron resultados"}
    />
    </>
  );
}
 
export default SelectClient;