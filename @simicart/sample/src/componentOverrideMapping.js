/**
 * Mappings for overwrites
 * example: [`@magento/venia-ui/lib/components/Main/main.js`]: './lib/components/Main/main.js'
 */
module.exports = componentOverride = {
    // [`@magento/venia-ui/lib/components/Header/header.js`]:'@simicart/sample/src/override/header.js',
    [`@magento/venia-ui/lib/components/ProductFullDetail/productFullDetail.js`] :'@simicart/sample/src/override/productFullDeatil.js',
    [`@magento/peregrine/lib/talons/RootComponents/Product/productDetailFragment.gql.js`] : '@simicart/sample/src/override/productDetailFragment.gql.js',
    [`@magento/venia-ui/lib/components/ProductOptions/option.css`]:'@simicart/sample/src/override/fbtProduct/popup.css'
};
