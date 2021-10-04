import { gql } from '@apollo/client';



export const ADD_FBT_PRODUCT_TO_CART = gql`
mutation AddFbtProductToCart(
    $cartId: String!
    $cartItems: [CartItemInput!]!
) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
        cart {
            items {
                product {
                    name
                    sku
                }
                quantity
            }
        }
    }
}
`;
export default {
    addFbtProductToCartMutation : ADD_FBT_PRODUCT_TO_CART,
}

