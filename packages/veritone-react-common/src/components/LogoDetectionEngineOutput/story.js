import React from 'react';
import { storiesOf } from '@storybook/react';

import styles from './story.styles.scss';
import LogoDetectionEngineOutput from './';


storiesOf('LogoDetectionEngineOutput', module).add('Base', () => {
	return (
		<div className={styles.container}>
			<div className={styles.left}>
				Left Box
			</div>
			<LogoDetectionEngineOutput 
				className={styles.outputViewRoot}
				data={mockData}
			/>
			<div className={styles.right}>
				Right Box
			</div>
			<div className={styles.bottom}>
				Bottom Box
			</div>
		</div>
	);
});

const mockData = [
	{
		startTimeMs: 0,
		endTimeMs: 9000,
		sourceEngineId: "2dc5166f-c0ad-4d84-8a85-515c42b5d357",
		sourceEngineName: "Server-R",
		taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf",
		series: [
			{
				startTimeMs: 0,
				endTimeMs: 1000,
				logo: {
					label: "ESPN",
					confidence: 0.942457377910614
				}
			},
			{
				startTimeMs: 4000,
				endTimeMs: 5000,
				logo: {
				label: "Google",
				confidence: 0.942457377910614
				}
			},
			{
				startTimeMs: 4000,
				endTimeMs: 15000,
				logo: {
					label: "Veritone",
					confidence: 0.942457377910614
				}
			},
			{
				startTimeMs: 7500,
				endTimeMs: 238000,
				logo: {
					label: "Veritone",
					confidence: 0.942457377910614
				}
			},
			{
				startTimeMs: 7500,
				endTimeMs: 238000,
				logo: {
					label: "This is a very long logo name it goes on for a while",
					confidence: 0.942457377910614
				}
			}
		]
	},
	{
		startTimeMs: 0,
		endTimeMs: 9000,
		sourceEngineId: "2dc5166f-c0ad-4d84-8a85-515c42b5d358",
		sourceEngineName: "Machine X",
		taskId: "e1fa7d7c-6f1c-480e-b181-68940509f070-fef496da-f36e-49ec-a304-426d96017ddf",
		series: [
			{
				startTimeMs: 0,
				endTimeMs: 1000,
				logo: {
					label: "data1",
					confidence: 0.942457377910614
				}
			},
			{
				startTimeMs: 2000,
				endTimeMs: 123000,
				logo: {
					label: "data2",
					confidence: 0.942457377910614
				}
			}
		]
	}
]
