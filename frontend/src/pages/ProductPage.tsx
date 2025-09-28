import { useParams } from "react-router-dom"

const ProductPage = () => {
    const {id} = useParams()
    return (
        <div>
            ProductPage {id}
        </div>
    )
}

export default ProductPage
