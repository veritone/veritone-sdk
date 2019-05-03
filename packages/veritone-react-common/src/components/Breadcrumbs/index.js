import React from 'react';
import { shape, string, number, arrayOf, func } from 'prop-types';
import { MenuList, Popover } from '@material-ui/core';

import BreadcrumbSeparator from './BreadcrumbSeparator';
import BreadcrumbElipsis from './BreadcrumbElipsis';
import BreadcrumbItem from './BreadcrumbItem';
import BreadcrumbRoot from './BreadcrumbRoot';

import styles from './Breadcrumbs.scss';

export default class Breadcrumbs extends React.Component {
	static propTypes = {
		pathList: arrayOf(shape({
			id: string.isRequired,
		})),
		maxItems: number,
		seperator: func,
		root: func,
		onCrumbClick: func.isRequired
	}

	static defaultProps = {
		maxItems: 5,
		seperator: BreadcrumbSeparator,
		root: BreadcrumbRoot
	}

	state = {
		openSpreadPath: false
	}

	onSpreadClick = (event) => {
		this.anchorEl = event.target;
		this.setState(({ openSpreadPath }) => ({
			openSpreadPath: !openSpreadPath
		}));
	}

	clickAwway = () => {
		this.anchorEl = null;
		this.setState({
			openSpreadPath: false
		})
	}

	onCrumbClick = (event) => {
		const elementData = Object.assign({}, event.target.dataset);
		this.props.onCrumbClick(elementData);
	}

	handleClose = (event) => {
		event.stopPropagation();
	}

	render() {
		const {
			pathList,
			maxItems,
			seperator: BreadcrumbItemSeparator,
			root: BreadcrumRootItem
		} = this.props;
		const [rootScrumb, ...remainPathList] = pathList;

		const {
			1: firstScrumb,
			[pathList.length - 1]: lastScrumb
		} = pathList;
		const midleScrumbs = pathList.slice(2, pathList.length - 1)

		return (
			<div className={styles['breadcrumb-container']}>
				<BreadcrumRootItem
					id={rootScrumb.id}
					label={rootScrumb.label}
					onClick={this.onCrumbClick}
				/>
				{
					pathList.length < maxItems ? (
						remainPathList.map((crumb, index) => (
							<React.Fragment key={crumb.id}>
								<BreadcrumbItemSeparator />
								<BreadcrumbItem
									{...crumb}
									index={index + 1}
									key={crumb.id}
									onClick={this.onCrumbClick}
								/>
							</React.Fragment>
						))
					) : (
							<React.Fragment>
								<BreadcrumbItemSeparator />
								<BreadcrumbItem
									{...firstScrumb}
									index={1}
									key={firstScrumb.id}
									onClick={this.onCrumbClick}
								/>
								<BreadcrumbItemSeparator />
								<BreadcrumbElipsis onClick={this.onSpreadClick} />
								<BreadcrumbItemSeparator />
								<BreadcrumbItem
									{...lastScrumb}
									index={pathList.length - 1}
									key={lastScrumb.id}
									onClick={this.onCrumbClick}
								/>
								<Popover
									open={Boolean(this.anchorEl)}
									anchorEl={this.anchorEl}
									onClick={this.clickAwway}
									anchorOrigin={{
										vertical: 'bottom',
										horizontal: 'left',
									}}
									transformOrigin={{
										vertical: 'top',
										horizontal: 'left',
									}}
								>
									<MenuList role="menu">
										{
											midleScrumbs.map(({ id, label }, index) => (
												<BreadcrumbItem
													key={id}
													isHidden
													id={id}
													index={index + 2}
													label={label}
													onClick={this.onCrumbClick}
												/>
											))
										}
									</MenuList>
								</Popover>
							</React.Fragment>
						)
				}
			</div>
		)
	}
}
