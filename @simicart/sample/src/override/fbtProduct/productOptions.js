import React, {
    useCallback,
    useEffect,
    useState,
    Suspense,
    Fragment,
    useMemo
} from 'react';

import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { fullPageLoadingIndicator } from 'node_modules/@magento/venia-ui/lib/components/LoadingIndicator';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { Form } from 'informed';
import Button from 'node_modules/@magento/venia-ui/lib/components/Button';
import defaultClass from '@simicart/sample/src/override/fbtProduct/popup.css';
import Price from '@magento/venia-ui/lib/components/Price';
import { QuantityFields } from '@simicart/sample/src/components/productList/quantity.js';
import { FormattedMessage, useIntl } from 'react-intl';

const Options = React.lazy(() =>
    import('node_modules/@magento/venia-ui/lib/components/ProductOptions')
);
const INITIAL_OPTION_SELECTIONS = new Map();

const ProductOptions = props => {
    const classes = defaultClass;

    const { product, handleSubmit } = props;
    const [quantity, setQuantity] = useState();

    const deriveOptionSelectionsFromProduct = product => {
        if (!isProductConfigurable(product)) {
            return INITIAL_OPTION_SELECTIONS;
        }

        const initialOptionSelections = new Map();
        for (const { attribute_id } of product.configurable_options) {
            initialOptionSelections.set(attribute_id, undefined);
        }

        return initialOptionSelections;
    };

    const derivedOptionSelections = useMemo(
        () => deriveOptionSelectionsFromProduct(product),
        [product]
    );
    const [optionSelections, setOptionSelections] = useState(
        derivedOptionSelections
    );

    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values.find(
                item => item.value_index === value
            );

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });

        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    // console.log("this is final", selectedOptionsArray);

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            // We must create a new Map here so that React knows that the value
            // of optionSelections has changed.
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const handleChange = e => {
        setQuantity(e.target.value);
    };

    useEffect(() => {
        if (selectedOptionsArray && quantity) {
            handleSubmit(selectedOptionsArray, quantity, product.sku);
        }
    }, [selectedOptionsArray, quantity, product.sku]);

    // logic add to cart...............................................................

    return (
        <div className={classes.optionSelections}>
            <section className={classes.title}>
                <h1 className={classes.productName}>{product.name}</h1>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={
                            product.price.regularPrice.amount.currency
                        }
                        value={product.price.regularPrice.amount.value}
                    />
                </p>
            </section>
            {isProductConfigurable(product) ? (
                <Suspense fallback={fullPageLoadingIndicator}>
                    <Options
                        options={product.configurable_options}
                        onSelectionChange={handleSelectionChange}
                    />
                </Suspense>
            ) : null}
            <section className={classes.quantity}>
                <p>Quantity</p>
                <input
                    type="number"
                    className={classes.quantityInput}
                    onChange={handleChange}
                />
            </section>
            
        </div>
    );
};

export default ProductOptions;
