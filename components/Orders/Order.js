import React, { useState, useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';

const GET_ORDERS_BY_SELLER = gql`
  query getOrdersBySeller {
    getOrdersBySeller {
      id
    }
  }
`

const UPDATE_ORDER = gql`
  mutation updateOrder($id: ID!, $input: OrderInput) {
    updateOrder(id: $id, input: $input) {
      state
      id
    }
  }
`;

const DELETE_ORDER = gql`
  mutation deleteOrder($id: ID!) {
    deleteOrder(id: $id)
  }
`

const Order = ({ order }) => {
  const { id, total, client: { name, lastname, phone, email }, state, client } = order;

  const [updateOrder] = useMutation(UPDATE_ORDER);
  const [deleteOrder] = useMutation(DELETE_ORDER, {
    update(cache) {
      const { getOrdersBySeller } = cache.readQuery({
        query: GET_ORDERS_BY_SELLER
      })
      cache.writeQuery({
        query: GET_ORDERS_BY_SELLER,
        data: {
          getOrdersBySeller: getOrdersBySeller.filter( order => order.id !== id)
        }
      })
    }
  });

  const [orderState, setOrderState] = useState(state);
  const [style, setStyle] = useState('')

  const styleOrder = () => {
    if (orderState === 'Pendiente') {
      setStyle('border-yellow-500');
    } else if (orderState === 'Completado') {
      setStyle('border-green-500');
    } else {
      setStyle('border-red-800');
    }
  }

  useEffect(() => {
    if(orderState) {
      setOrderState(orderState)
    }
    styleOrder();
  }, [orderState])

  const changeState = async newState => {
    try {
      const { data } = await updateOrder({
        variables: {
          id,
          input: {
            state: newState,
            client: client.id
          }
        }
      })
      setOrderState(data.updateOrder.state);
    } catch (error) {
      console.log(error)
    }
  }

  const confirmDeleteOrder = () => {
    Swal.fire({
      title: "¿Desea eliminar este pedido?",
      text: "No podrás recuperar este archivo luego",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, seguro",
      cancelButtonText: "No, cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const data = await deleteOrder({
            variables: {
              id
            }
          })
          console.log(data);
          Swal.fire('eliminado', data.deleteOrder, "success")
        } catch (error) {
          console.log(error);
        }
      }
    });
  }

  return (
    <div className={`${style} border-t-4 mt-4 mt-4 bg-white rounded p-6 md:grid md:grid-cols-2 md:gap-4 shadow-lg`}>
      <div>
        <p className="font-bold text-gray-800">Cliente: {name} {lastname}</p>
        {email && (
          <p className="flex items-center my-2">
            <svg fill="none"
             className="w-4 h-4 mr-2"
             strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            {email}
          </p>
        )}
        {phone && (
          <p className="flex items-center my-2">
            <svg fill="none"
            className="w-4 h-4 mr-2"
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
            {phone}
          </p>
        )}
        <h2 className="text-gray-800 font-bold mt-10">Estado pedido: </h2>
        <select
          className="mt-2 appearance-none bg-blue-600 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold"
          value={orderState}
          onChange={ e => changeState(e.target.value) }
        >
          <option value="Completado">COMPLETADO</option>
          <option value="Pendiente">PENDIENTE</option>
          <option value="Cancelado">CANCELADO</option>
        </select>
      </div>
      <div>
        <h2 className="text-gray-800 font-bold mt-2">Resumen del pedido</h2>
        { order.order.map(product => (
          <div key={product.id} className="mt-4 ">
            <p className="text-sm text-gray-600">Producto: {product.name}</p>
            <p className="text-sm text-gray-600">Cantidad: {product.quantity}</p>
          </div>
        )) }
        <p className="text-gray-800 mt-3 font-bold">Total a pagar: <span className="font-light">{total}</span></p>
        <button
          className="flex items-center mt-4 bg-red-800 px-5 py-2 inline-block text-white rounded leading-tight uppercase text-xs font-bold"
          onClick={() => confirmDeleteOrder()}
        >
          Eliminar Pedido
          <svg
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 ml-2"
          ></svg>
        </button>
      </div>
    </div>
  );
}
 
export default Order;