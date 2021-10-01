import React from 'react';
import Icon from '@magento/venia-ui/lib/components/Icon';
import {FastForward} from 'react-feather';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useHistory } from 'react-router-dom';
import { shape, string } from 'prop-types';

import DefaultClasses from './simicartIcon.css';
import {FormattedMessage, useIntl} from 'react-intl';

const SimicartIcon = props => {
    const classes = DefaultClasses;
    const {formatMessage} = useIntl();
    const history = useHistory();

    return(
        <button
            aria-aria-label={formatMessage({
                id: 'blog.bloglabel',
                defaultMessage: 'Blog',
            })}
            className={classes.root}
            onClick={()=> history.push(resourceUrl('/simicart'))}
        >
            <Icon src={FastForward} />
            <span className={classes.label}>
                <FormattedMessage id={"Blog"} />
            </span>

        </button>
    )
}

SimicartIcon.propTypes = {
    classes: shape({root: string})
}

SimicartIcon.defaultProps = {};
export default SimicartIcon;