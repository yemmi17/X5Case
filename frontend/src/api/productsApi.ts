import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    Product,
    ProductCreateRequest,
    ProductUpdateRequest,
    ProductsResponse,
    ProductsQueryParams
} from '../types/product'

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8002/api/v1/',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            return headers
        }
    }),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getRoot: builder.query<string, void>({
            query: () => '/',
        }),

    
        createProduct: builder.mutation<Product, ProductCreateRequest>({
            query: (productData) => ({
                url: 'products/',
                method: 'POST',
                body: productData
            }),
            invalidatesTags: ['Product']
        }),

    
        getProducts: builder.query<ProductsResponse, ProductsQueryParams>({
            query: ({ skip = 0, limit = 100, category = null }) => {
                const params = new URLSearchParams()
                params.append('skip', skip.toString())
                params.append('limit', limit.toString())
            
                if (category) {
                    params.append('category', category)
                }

                return `products/?${params.toString()}`
            },
            providesTags: ['Product']
        }),

    
        getProduct: builder.query<Product, number>({
            query: (productId) => `products/${productId}`,
            providesTags: (result, error, id) => [{ type: 'Product', id }]
        }),

    
        updateProduct: builder.mutation<Product, { productId: number; updates: ProductUpdateRequest }>({
            query: ({ productId, updates }) => ({
                url: `products/${productId}`,
                method: 'PATCH',
                body: updates
            }),
            invalidatesTags: (result, error, { productId }) => [
                { type: 'Product', id: productId },
                'Product'
            ]
        }),

    
        deleteProduct: builder.mutation<void, number>({
            query: (productId) => ({
                url: `products/${productId}`,
                method: 'DELETE'
            }),
                invalidatesTags: ['Product']
            })
        }
    )
})

export const {
    useGetRootQuery,
    useCreateProductMutation,
    useGetProductsQuery,
    useGetProductQuery,
    useUpdateProductMutation,
    useDeleteProductMutation
} = productsApi