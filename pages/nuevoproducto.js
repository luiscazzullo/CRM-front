import React from 'react';
import Layout from '../components/Layout/Layout';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import Swal from 'sweetalert2';
import { useRouter } from 'next/router';
const NEW_PRODUCT = gql`
  mutation newProduct($input: ProductInput) {
    newProduct(input: $input) {
      id
      name
      stock
      price
    }
  }
`
const GET_PRODUCTS = gql`
  query getProducts {
    getProducts {
      id
      name
      price
      stock
    }
  }
`;
const NewProduct = () => {
  const [newProduct] = useMutation(NEW_PRODUCT, {
    update(cache, { data: { newProduct }}) {
      //Obtener nuevo producto
      const { getProducts } = cache.readQuery({ query: GET_PRODUCTS})
      //Reescribir el producto
      cache.writeQuery({
        query: GET_PRODUCTS,
        data: {
          getProducts: [newProduct, ...getProducts]
        }
      })
    }
  });
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      name: '',
      stock: '',
      price: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre del producto es obligatorio'),
      stock: Yup.number().required('El stock es obligatorio').positive('No se aceptan números negativos').integer('El número debe ser entero'),
      price: Yup.number().required('El precio es obligatorio').positive('No se aceptan valores negativos')
    }),
    onSubmit: async values => {
      const { name, stock, price } = values
      try {
        const { data } = await newProduct({
          variables: {
            input: {
              name,
              stock,
              price
            }
          }
        })
        Swal.fire('Creado', 'Se creo el producto correctamente', 'success');
        router.push('/productos');
      } catch (error) {
        console.log(error)
      }
    }
  })

  return (
    <Layout>
      <h1 className="text-2xl text-gray-800 font-light">Crear nuevo producto</h1>
      <div className="flex justify-center mt-5">
        <div className="w-full max-w-lg">
          <form
            onSubmit={formik.handleSubmit}
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
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.name}</p>
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
                value={formik.values.stock}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.stock && formik.errors.stock ? (
              <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <p className="font-bold">Error</p>
                <p>{formik.errors.stock}</p>
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
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.price && formik.errors.price ? (
                <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                  <p className="font-bold">Error</p>
                  <p>{formik.errors.price}</p>
                </div>
              ) : null}
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-300"
                value="Agregar nuevo producto"
              />
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
 
export default NewProduct;