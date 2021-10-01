import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';
import { Form } from 'informed';
import { func, number, string } from 'prop-types';
// import { Minus as MinusIcon, Plus as PlusIcon } from 'react-feather';
import { useQuantity } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useQuantity';

import { useStyle } from 'node_modules/@magento/venia-ui/lib/classify.js';
// import Icon from '../../Icon';
import TextInput from 'node_modules/@magento/venia-ui/lib/components/TextInput';
import { Message } from 'node_modules/@magento/venia-ui/lib/components/Field';
import defaultClasses from 'node_modules/@magento/venia-ui/lib/components/CartPage/ProductListing/quantity.css';

export const QuantityFields = props => {
    const { initialValue, itemId, label, min, onChange, message } = props;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    // const iconClasses = { root: classes.icon };

    const talonProps = useQuantity({
        initialValue,
        min,
        onChange
    });

    const {
        handleBlur,
        maskInput
    } = talonProps;

    const errorMessage = message ? <Message>{message}</Message> : null;

    return (
        <Fragment>
            <div className={classes.root}>
                <label className={classes.label} htmlFor={itemId}>
                    {label}
                </label>
                <TextInput
                    aria-label={formatMessage({
                        id: 'quantity.input',
                        defaultMessage: 'Item Quantity'
                    })}
                    classes={{ input: classes.input }}
                    field="quantity"
                    id={itemId}
                    inputMode="numeric"
                    mask={maskInput}
                    min={min}
                    onBlur={handleBlur}
                    pattern="[0-9]*"
                />
            </div>
            {errorMessage}
        </Fragment>
    );
};

const Quantity = props => {
    return (
        <Form
            initialValues={{
                quantity: props.initialValue
            }}
        >
            <QuantityFields {...props} />
        </Form>
    );
};

Quantity.propTypes = {
    initialValue: number,
    itemId: string,
    label: string,
    min: number,
    onChange: func,
    message: string
};

Quantity.defaultProps = {
    label: 'Quantity',
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

QuantityFields.defaultProps = {
    min: 0,
    initialValue: 1,
    onChange: () => {}
};

export default Quantity;
