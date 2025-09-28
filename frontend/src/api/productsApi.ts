import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
    SearchProductsResponse,
    SearchQueryParams
} from '../types/product'

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api/v1/',
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
        searchProducts: builder.query<SearchProductsResponse, SearchQueryParams>({
            query: ({ q, page = 1, size = 10 }) => 
                `search?q=${encodeURIComponent(q)}&page=${page}&size=${size}`
        })
    })
})

export const {
    useGetRootQuery,
    useSearchProductsQuery
} = productsApi