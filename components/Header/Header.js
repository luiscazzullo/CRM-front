import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
const GET_USER = gql`
  query getUser {
    getUser {
      id
      name
      lastname
    }
  }
`;
const Header = () => {
  const { data, loading, error } = useQuery(GET_USER);
  const router = useRouter();
  if (loading) return "Cargando...";
  if (!data) {
    return router.push("/login");
  }
  const { name, lastname } = data.getUser;
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };
  return (
    <div className="sm:flex sm:justify-between mb-6">
      <p className="mr-2 mb-5 lg:mb-0">
        Hola: {name} {lastname}
      </p>
      <button
        className="bg-blue-800 sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow-md"
        type="button"
        onClick={() => logout()}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Header;
