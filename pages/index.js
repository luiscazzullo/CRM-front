import { gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
//Components
import Layout from "../components/Layout/Layout";
import Client from "../components/Client/Client";

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
const Home = () => {
  const { data, loading, error } = useQuery(GET_CLIENTS_BY_SELLER);
  const router = useRouter();
  if (loading) {
    return "Cargando...";
  }
  if (!data.getClientsBySeller) {
    return router.push("/login");
  }
  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <Link href="/nuevocliente">
          <a className="bg-blue-800 py-2 px-5 mt-5 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold w-full lg:w-auto text-center">
            Nuevo cliente
          </a>
        </Link>
        <div className="overflow-x-scroll">
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">Nombre</th>
                <th className="w-1/5 py-2">Empresa</th>
                <th className="w-1/5 py-2">Mail</th>
                <th className="w-1/5 py-2">Eliminar</th>
                <th className="w-1/5 py-2">Editar</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {data.getClientsBySeller.map((client) => {
                return <Client key={client.id} client={client} />;
              })}
            </tbody>
          </table>
        </div>
      </Layout>
    </div>
  );
};
export default Home;
