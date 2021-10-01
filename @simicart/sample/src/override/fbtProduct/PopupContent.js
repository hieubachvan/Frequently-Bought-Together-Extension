import React, {
    useCallback,
    useEffect,
    useState,
    Suspense,
    Fragment
} from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { QuantityFields } from '@simicart/sample/src/components/productList/quantity.js';

import { useQuery } from '@apollo/client';
import mergeOperations from 'node_modules/@magento/peregrine/lib/util/shallowMerge.js';
import DEFAULT_OPERATIONS from 'node_modules/@magento/peregrine/lib/talons/RootComponents/Product/product.gql.js';
import defaultClass from '@simicart/sample/src/override/fbtProduct/popup.css';

import Price from '@magento/venia-ui/lib/components/Price';
import { Form } from 'informed';
import ProductOptions from './productOptions';

const PopupContent = props => {
    const classes = defaultClass;
    const { urlKey, handleSubmit } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getProductDetailQuery } = operations;

    // console.log(urlKey_fbtProduct);

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { error, loading, data } = useQuery(getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey
        }
    });

    if (loading) {
        return <h1>Loading...</h1>;
    }

    const product = data.products.items[0];
    // console.log("product",product);

    return (
        <>
            <ProductOptions product={product} handleSubmit={handleSubmit} />
        </>
    );
};

export default PopupContent;
