import React, { useCallback, useEffect, useState } from 'react';

import defaultClass from '@simicart/sample/src/override/fbtProduct/fptProducts.css';
import { Link } from 'react-router-dom';
import Popup from './popup';
import '@simicart/sample/src/override/fbtProduct/fptProducts.css';

const FbtProducts = props => {
    const [isOpenPopup, setOpenPopup] = useState(false);
    // const {product1} = useProduct("")

    const { product } = props;
    const fbtProducts = product.fbt_products;
    const classes = defaultClass;

    const listItem = Array.from(fbtProducts, item => {
        return {
            ...item,
            active: true,
            url: item.image.url,
            name: item.name
        };
    });

    const [listImage, setListImage] = useState(listItem);

    const openPopup = () => {
        setOpenPopup(true);
    };

    const upDateProduct = e => {
        let name = e.target.name;
        let value = e.target.checked;
        let temp = [...listImage];
        temp.forEach(item => {
            if (item.name === name) {
                item.active = value;
            }
        });
        setListImage(temp);
    };

    console.log(listImage);

    const listCheckBox = listImage.map((item, index) => {
        const urlkey = `/${item.url_key}.html`;
        return (
            <div className="form-control">
                <input
                    type="checkbox"
                    name={item.name}
                    id={index}
                    onChange={upDateProduct}
                    checked={item.active}
                />
                <label htmlFor={item.name}>
                    <Link to={urlkey}>
                        {`${item.name} ${
                            item.price.regularPrice.amount.value
                        }$`}
                    </Link>
                </label>
            </div>
        );
    });

    const productActive = listImage.filter(item => item.active === true);

    // console.log("product filter", productActive);

    const image = listImage.map((item, index) => {
        return item.active ? (
            <img
                className={classes.image}
                key={index}
                src={item.url}
                alt={item.name}
            />
        ) : null;
    });

    return (
        <div className={classes.root}>
            <Popup
                isOpenPopup={isOpenPopup}
                setOpenPopup={setOpenPopup}
                listItem={listImage}
                product={product}
            />

            <h1 className={classes.title}>FREQUENTLY BOUGHT TOGETHER</h1>
            <div className={classes.imgContainer}>
                <img
                    className={classes.image}
                    src={product.small_image}
                    alt={product.name}
                />
                {image}
            </div>
            <div className={classes.listItem}>
                <div className="form-control">
                    <input
                        type="checkbox"
                        name={product.name}
                        id={product.id}
                        checked={true}
                    />
                    <label htmlFor={product.name}>This Product</label>
                </div>

                {listCheckBox}
            </div>
            <button
                className={classes.btn}
                type="button"
                onClick={openPopup}
            >{`Add ${listImage.length} to cart with this product`}</button>
        </div>
    );
};

export default FbtProducts;
