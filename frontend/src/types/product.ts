export interface Product {
    id?: number
    name: string
    price: number
    old_price: number
    image_url: string
    rating: number
    reviews_count: number
    category: string
    in_stock: boolean
}

export interface ProductCreateRequest extends Omit<Product, 'id'> {}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

export interface ProductsResponse {
    products: Product[]
    total: number
}

export interface ProductsQueryParams {
    skip?: number
    limit?: number
    category?: string | null
}