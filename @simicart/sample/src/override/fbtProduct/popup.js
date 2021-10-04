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
import { FaTimes, FaPlusCircle } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';

import defaultOperations from "./fbtProduct.gql"

const Popup = props => {
    const { isOpenPopup, setOpenPopup, listItem, product } = props;
    const [loading, setLoading] = useState(false);
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getProductDetailQuery } = operations;

    const [{ cartId }] = useCartContext();

    const [variables, setVariables] = useState([]);

    const urlKey_fbtProduct = listItem.map(item => item.url_key);
 
    // const urlKey= listItem.filter(item => item.active ===true);
    
    // console.log("hahhas", urlKey);

    

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    // setup....................................................
    // const [listSku, setListSku] = useState([]);

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

    // const ADD_FBT_PRODUCT_TO_CART = gql`
    //     mutation AddFbtProductToCart(
    //         $cartId: String!
    //         $cartItems: [CartItemInput!]!
    //     ) {
    //         addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
    //             cart {
    //                 items {
    //                     product {
    //                         name
    //                         sku
    //                     }
    //                     quantity
    //                 }
    //             }
    //         }
    //     }
    // `;

    const [addFbtProductToCart] = useMutation(defaultOperations.addFbtProductToCartMutation);

    const submitToCart = async () => {
        setLoading(true);
        if (variables.length > 0) {
            payload = {
                cartId,
                cartItems: variables
            };
            await addFbtProductToCart({ variables: payload });
        } else {
            console.log('error  ');
        }
        setLoading(false);
    };
    // setup....................................................

    const FbtProduct = urlKey_fbtProduct.map(item => {
        // const { error, loading, data } = useQuery(getProductDetailQuery, {
        //     fetchPolicy: 'cache-and-network',
        //     nextFetchPolicy: 'cache-first',
        //     skip: !storeConfigData,
        //     variables: {
        //         urlKey: item
        //     }
        // });
        return  <PopupContent urlKey={item} handleSubmit={handleSubmit} />
        
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

                        <Button disabled={loading} type="submit">
                            <FormattedMessage
                                id={'productFullDetail.cartAction'}
                                // defaultMessage={'Add to Cart'}
                            />
                        </Button>
                    </Form>
                </Fragment>
            </div>
        </div>
    );
};

export default Popup;
