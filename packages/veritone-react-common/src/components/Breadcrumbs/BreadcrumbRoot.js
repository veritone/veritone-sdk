import React from 'react';
import { string } from 'prop-types';

import classNames from 'classnames';
import styles from './BreadcrumbRoot.scss';

import breadCrumbItem from './breadcrumbItemShape';

const BreadcrumbRoot = ({ id, label, onClick }) => (
	<div
		className={classNames(
			'icon-work',
			styles['font-icon-work']
		)}
		data-index={0}
		data-id={id}
		onClick={onClick}
	>
		{label}
	</div>
)

BreadcrumbRoot.propTypes = {
	...breadCrumbItem,
	label: string,
}

export default BreadcrumbRoot;
