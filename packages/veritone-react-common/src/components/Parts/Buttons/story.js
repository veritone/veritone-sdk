import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';
import PillButton from './PillButton';

storiesOf('Common Buttons', module).add('Pill Button', () => {
	return (
		<div>
        	<PillButton label='default label' info='(2)'/>
			<PillButton 
				label = 'custom label'
				info = 'custom info'
				className = {styles.pillButton}
				infoClassName = {styles.pillBadge}
				labelClassName = {styles.pillLabel}
			/>
			<PillButton label = 'label only'/>
			<PillButton info = '(info only)'/>
			<PillButton label = 'this is a very long label for a pill button' info = '(2)'/>
			<PillButton label = 'highlighted button' info = '(tada)' highlight/>
		</div>
	);
});
