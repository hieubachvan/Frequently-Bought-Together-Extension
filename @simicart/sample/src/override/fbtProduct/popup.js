import React, {
    useCallback,
    useEffect,
    useState,
    Suspense,
    Fragment
} from 'react';
import { gql } from '@apollo/client';
import defaultClass from '@simicart/sample/src/override/fbtProduct/popup.css';
import { useMutation, useQuery } from '@apollo/client';
import mergeOperations from 'node_modules/@magento/peregrine/lib/util/shallowMerge.js';
import DEFAULT_OPERATIONS from 'node_modules/@magento/peregrine/lib/talons/RootComponents/Product/product.gql.js';
import PopupContent from '@simicart/sample/src/override/fbtProduct/PopupContent.js';
import { Form } from 'informed';
import Button from 'node_modules/@magento/venia-ui/lib/components/Button';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { set } from 'lodash-es';
import { FaTimes } from 'react-icons/fa';

const Popup = props => {
    const { isOpenPopup, setOpenPopup, listItem, product } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getProductDetailQuery } = operations;

    const urlKey_fbtProduct = listItem.map(item => item.url_key);

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // setup....................................................
    const [{ cartId }] = useCartContext();

    const [variables, setVariables] = useState([]);
    const [listSku, setListSku] = useState([]);

    let payload = {
        cartId,
        cartItems: variables
    };

    const handleSubmit = (s, q, sku) => {
        if (q > 0) {
            let data = {
                sku: sku,
                quantity: q,
                selected_options: s
            };

            if (variables.length === 0) {
                setVariables([...variables, data]);
            } else if (variables.length > 0) {
                let temp = [...variables];
                let find = temp.find(item => item.sku === data.sku);
                if (!find) {
                    temp = [...variables, data];
                } else {
                    temp.forEach(item => {
                        if (item.sku === data.sku) {
                            item.quantity = data.quantity;
                            item.selected_options = data.selected_options;
                        }
                    });
                }
                setVariables(temp);
            }
        }
    };
    // console.log('variablelis', variables);

    const ADD_FBT_PRODUCT_TO_CART = gql`
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

    const [addFbtProductToCart] = useMutation(ADD_FBT_PRODUCT_TO_CART);

    const submitToCart = () => {
        payload = {
            cartId,
            cartItems: variables
        };
        addFbtProductToCart({ variables: payload });
    };

    // setup....................................................

    const FbtProduct = urlKey_fbtProduct.map(item => {
        const { error, loading, data } = useQuery(getProductDetailQuery, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            skip: !storeConfigData,
            variables: {
                urlKey: item
            }
        });
        return <PopupContent urlKey={item} handleSubmit={handleSubmit} />;
    });

    const classes = defaultClass;

    return (
        <div className={isOpenPopup ? classes.popupActive : classes.popup}>
            <div className={classes.popupContent}>
                <span
                    className={classes.close}
                    onClick={() => setOpenPopup(false)}
                >
                    <FaTimes />
                </span>

                <Fragment>
                    <Form onSubmit={submitToCart}>
                        {FbtProduct}

                        <Button type="submit">add all to cart</Button>
                    </Form>
                </Fragment>
            </div>
        </div>
    );
};

export default Popup;
