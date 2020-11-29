import { ReactNode } from 'react';
import styles from './rater.module.css';
import { Card, Icon, IconButton } from '@material-ui/core';
import {
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentSatisfied,
} from '@material-ui/icons';

interface RaterProps {
  text: string;
}

export default function Rater(props: RaterProps) {
  const { text } = props;
  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.text}>{text}</div>
        <div className={styles.ratings}>
          <IconButton
            onClick={() => {
              console.log('Happy');
            }}
          >
            <SentimentSatisfiedAlt />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log('Not Upset/Happy');
            }}
          >
            <SentimentSatisfied />
          </IconButton>
          <IconButton
            onClick={() => {
              console.log('Upset');
            }}
          >
            <SentimentVeryDissatisfied />
          </IconButton>
        </div>
      </div>
    </Card>
  );
}
