import { ReactNode } from 'react';
import styles from './rater.module.css';
import { Card, Icon, IconButton } from '@material-ui/core';
import {
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentSatisfied,
} from '@material-ui/icons';

interface RaterProps {
  icons: ReactNode;
  text: string;
}

export default function Rater(props: RaterProps) {
  const { icons, text } = props;
  return (
    <Card>
      <div className={styles.container}>
        <div className={styles.text}>{text}</div>
        <div className={styles.ratings}>
          <SentimentSatisfiedAlt />
          <SentimentSatisfied />
          <SentimentVeryDissatisfied />
        </div>
      </div>
    </Card>
  );
}
