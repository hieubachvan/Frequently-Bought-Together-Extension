import { gql } from '@apollo/client';



export const ADD_FBT_PRODUCT_TO_CART = gql`
mutation AddFbtProductToCart($cartId: String!, $cartItems: CartItemInput!) {
    addFbtProductsToCart(
      cartId: $cartId
      cartItems: [$cartItems]
    ) {
      cart {
        items {
          product {
            name
            sku
          }
          ... on ConfigurableCartItem {
            configurable_options {
              configurable_product_option_uid
              option_label
              configurable_product_option_value_uid
              value_label
            }
          }
          quantity
        }
      }
    }
  }

`
export default {
    addFbtProductToCartMutation : ADD_FBT_PRODUCT_TO_CART,
}

