import React, { useCallback, useEffect, useState } from 'react';

import defaultClass from '@simicart/sample/src/override/fbtProduct/fptProducts.css';
import { Link } from 'react-router-dom';
import Popup from './popup';
import '@simicart/sample/src/override/fbtProduct/fptProducts.css';
import { FaTimes, FaPlusCircle } from 'react-icons/fa';

const FbtProducts = props => {
    const { product } = props;
    const [isOpenPopup, setOpenPopup] = useState(false);
    // const {product1} = useProduct("")
  
    // console.log("product", product);
    const fbtProducts = product.fbt_products;


    const classes = defaultClass;

    // console.log("product url key", product);

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

    console.log("hhahaha",listImage);

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
    // const [productActive, setProductActive] = useState(listImage);

    // useEffect(()=> {
    //     let temp = listImage.filter(item => item.active === true);
    //     setProductActive(temp)
    // }, [listImage])



    const productActive = listImage.filter(item => item.active === true);

    // console.log("product filter", productActive);

    const image = listImage.map((item, index) => {
        return item.active ? (
            <>
                <img
                    className={classes.image}
                    key={index}
                    src={item.url}
                    alt={item.name}
                />
                {index < listImage.length - 1 ? (
                    <span className={classes.plusIcon}>
                        <FaPlusCircle className={classes.plusIconSvg} />
                    </span>
                ) : null}
            </>
        ) : null;
    });

    return (
        <div className={classes.root}>
            <Popup
                isOpenPopup={isOpenPopup}
                setOpenPopup={setOpenPopup}
                listItem={productActive}
                product={product}
            />

            <h1 className={classes.title}>FREQUENTLY BOUGHT TOGETHER</h1>
            <div className={classes.imgContainer}>{image}</div>
            <div className={classes.listItem}>{listCheckBox}</div>
            <button
                className={classes.btn}
                type="button"
                onClick={openPopup}
            >{`Add ${productActive.length} to cart with this product`}</button>
        </div>
    );
};

export default FbtProducts;
