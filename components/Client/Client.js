import React from "react";
import Swal from "sweetalert2";
import Router from "next/router";
import { gql, useMutation } from "@apollo/client";
const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id)
  }
`;

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

const Client = ({ client }) => {
  const { name, lastname, company, email, id } = client;
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    update(cache) {
      const { getClientsBySeller } = cache.readQuery({
        query: GET_CLIENTS_BY_SELLER,
      });
      cache.writeQuery({
        query: GET_CLIENTS_BY_SELLER,
        data: {
          getClientsBySeller: getClientsBySeller.filter(
            (client) => client.id !== id
          ),
        },
      });
    },
  });
  const removeClient = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás recuperar este archivo luego",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, seguro",
      cancelButtonTexxt: "No, cancelar",
    }).then(async (result) => {
      if (result.value) {
        try {
          const { data } = await deleteClient({
            variables: {
              id,
            },
          });
          Swal.fire("Eliminado", data.deleteClient, "success");
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const editClient = () => {
    Router.push({
      pathname: "/editarcliente/[id]",
      query: { id },
    });
  };
  return (
    <tr>
      <td className="border px-4 py-2">
        {name} {lastname}
      </td>
      <td className="border px-4 py-2">{company}</td>
      <td className="border px-4 py-2">{email}</td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-red-800 py-2 px-4 w-full rounded text-white text-xs uppercase font-bold"
          onClick={() => removeClient()}
        >
          Eliminar
          <svg
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 ml-2"
          >
            <path d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6"></path>
          </svg>
        </button>
      </td>
      <td className="border px-4 py-2">
        <button
          type="button"
          className="flex justify-center items-center bg-green-600 py-2 px-4 w-full rounded text-white text-xs uppercase font-bold"
          onClick={() => editClient()}
        >
          Editar
          <svg
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-4 h-4 ml-2"
          >
            <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default Client;
