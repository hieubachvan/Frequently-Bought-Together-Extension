import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { Link, Route } from 'react-router-dom';

import Logo from 'node_modules/@magento/venia-ui/lib/components/Logo';
import AccountTrigger from 'node_modules/@magento/venia-ui/lib/components/Header/accountTrigger.js';
import CartTrigger from 'node_modules/@magento/venia-ui/lib/components/Header/cartTrigger.js';
import NavTrigger from 'node_modules/@magento/venia-ui/lib/components/Header/navTrigger.js';
import SearchTrigger from 'node_modules/@magento/venia-ui/lib/components/Header/searchTrigger.js';
import OnlineIndicator from 'node_modules/@magento/venia-ui/lib/components/Header/onlineIndicator.js';
import { useHeader } from '@magento/peregrine/lib/talons/Header/useHeader';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

import { useStyle } from 'node_modules/@magento/venia-ui/lib/classify.js';
import defaultClasses from 'node_modules/@magento/venia-ui/lib/components/Header/header.css';
import PageLoadingIndicator from 'node_modules/@magento/venia-ui/lib/components/PageLoadingIndicator';
import StoreSwitcher from 'node_modules/@magento/venia-ui/lib/components/Header/storeSwitcher.js';
import CurrencySwitcher from 'node_modules/@magento/venia-ui/lib/components/Header/currencySwitcher.js';
import MegaMenu from 'node_modules/@magento/venia-ui/lib/components/MegaMenu';
import SimicartIcon from './simicartIcon';

const SearchBar = React.lazy(() => import('node_modules/@magento/venia-ui/lib/components/SearchBar'));

const Header = props => {
    const {
        handleSearchTriggerClick,
        hasBeenOffline,
        isOnline,
        isPageLoading,
        isSearchOpen,
        searchRef,
        searchTriggerRef
    } = useHeader();

    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isSearchOpen ? classes.open : classes.closed;
    const searchBarFallback = (
        <div className={classes.searchFallback} ref={searchRef}>
            <div className={classes.input}>
                <div className={classes.loader} />
            </div>
        </div>
    );
    const searchBar = isSearchOpen ? (
        <Suspense fallback={searchBarFallback}>
            <Route>
                <SearchBar isOpen={isSearchOpen} ref={searchRef} />
            </Route>
        </Suspense>
    ) : null;
    const pageLoadingIndicator = isPageLoading ? (
        <PageLoadingIndicator />
    ) : null;

    return (
        <Fragment>
            <div className={classes.switchersContainer}>
                <div className={classes.switchers}>
                    <StoreSwitcher />
                    <CurrencySwitcher />
                </div>
            </div>
            <header className={rootClass}>
                <div className={classes.toolbar}>
                    <div className={classes.primaryActions}>
                        <NavTrigger />
                    </div>
                    {pageLoadingIndicator}
                    <OnlineIndicator
                        hasBeenOffline={hasBeenOffline}
                        isOnline={isOnline}
                    />
                    <Link
                        to={resourceUrl('/')}
                        className={classes.logoContainer}
                    >
                        <Logo classes={{ logo: classes.logo }} />
                    </Link>
                    <MegaMenu />
                    <div className={classes.secondaryActions}>
                        <SearchTrigger
                            onClick={handleSearchTriggerClick}
                            ref={searchTriggerRef}
                        />
                        <SimicartIcon />
                        <AccountTrigger />
                        <CartTrigger />
                    </div>
                </div>
                {searchBar}
            </header>
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
