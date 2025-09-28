export interface Product {
    id: number
    name: string
    price: number
    old_price: number | null
    image_url: string
    rating: number
    reviews_count: number
    category: string
    brand: string
    volume: string
    percentage: string | null
    in_stock: boolean
}

export interface ProductCreateRequest extends Omit<Product, 'id'> {}

export interface ProductUpdateRequest extends Partial<ProductCreateRequest> {}

export interface SearchEntity {
    entity: string
    value: string
}

export interface SearchProductsResponse {
    entities: SearchEntity[]
    products: {
        items: Product[]
        total: number
        page: number
        size: number
        pages: number
    }
}

export interface ProductsResponse {
    products: Product[]
    total: number
}

export interface ProductsQueryParams {
    skip?: number
    limit?: number
    category?: string | null
}

export interface SearchQueryParams {
    q: string
    page?: number
    size?: number
}