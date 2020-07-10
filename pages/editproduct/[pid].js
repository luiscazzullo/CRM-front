import React from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout/Layout';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik'
import * as Yup from 'yup';
import Swal from 'sweetalert2';
const GET_PRODUCT = gql`
  query getProduct($id: ID!) {
    getProduct(id: $id) {
      name
      price
      stock
    }
  }
`
const UPDATE_PRODUCT = gql`
  mutation updateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      stock
      price
    }
  }
`
const EditProduct = () => {
  const router = useRouter();
  const { query:{ id } } = router;
  const { data, loading, error } = useQuery(GET_PRODUCT, {
    variables: {
      id
    }
  })
  const [updateProduct] = useMutation(UPDATE_PRODUCT)
  const validationSchema = Yup.object({
    name: Yup.string().required('El nombre del producto es obligatorio'),
    stock: Yup.number().required('El stock es obligatorio').positive('No se aceptan números negativos').integer('El número debe ser entero'),
    price: Yup.number().required('El precio es obligatorio').positive('No se aceptan valores negativos')
  });
  if(loading) return 'Cargando...'
  if(!data) return 'Acción no permitida'
  const updateInfoProduct = async values => {
    const { name, stock, price } = values;
    try {
      const data = await updateProduct({
        variables: {
          id,
          input: {
            name,
            stock,
            price
          }
        }
      })
      router.push('/productos');
      Swal.fire('Correcto', 'El producto se actualizó correctamente', 'success');
    } catch (error) {
      
    }
  }
  const { getProduct } = data;
  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Editar producto</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <Formik
            enableReinitialize
            initialValues={getProduct}
            validationSchema={validationSchema}
            onSubmit={ values => {
              updateInfoProduct(values)
            }}
          >
            {props => {
              return(
                <form
                  onSubmit={props.handleSubmit}
                  className="bg-white shadow-md px-8 pt-6 pb-8 mb-4"
                >
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Nombre
              </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Nombre de Cliente"
                      value={props.values.name}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.name && props.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{props.errors.name}</p>
              </div>
            ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="stock"
                    >
                      Stock
              </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="stock"
                      type="number"
                      name="stock"
                      placeholder="Stock"
                      value={props.values.stock}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                  </div>
                  {props.touched.stock && props.errors.stock ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{props.errors.stock}</p>
              </div>
            ) : null}
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="name"
                    >
                      Precio
              </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="price"
                      type="number"
                      name="price"
                      placeholder="Precio"
                      value={props.values.price}
                      onChange={props.handleChange}
                      onBlur={props.handleBlur}
                    />
                      {
                        props.touched.price && props.errors.price ? (
                          <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                            <p className="font-bold">Error</p>
                            <p>{props.errors.price}</p>
                          </div>
                        ) : null
                      }
                    <input
                      type="submit"
                      className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-300"
                      value="Guardar cambios"
                    />
                  </div>
                </form>
              )
            }}
          </Formik>
        </div>
      </div>
    </Layout>
  );
}
 
export default EditProduct;