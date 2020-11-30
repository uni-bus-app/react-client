import styles from './rater.module.css';
import { Card, IconButton } from '@material-ui/core';
import Draggable from '../Draggable/draggable';
import {
  SentimentSatisfiedAlt,
  SentimentVeryDissatisfied,
  SentimentSatisfied,
} from '@material-ui/icons';

interface RaterProps {
  text: string;
  action1: () => void;
  action2: () => void;
  action3: () => void;
}

export default function Rater(props: RaterProps) {
  const { text, action1, action2, action3 } = props;
  return (
    <Draggable>
      <Card>
        <div className={styles.container}>
          <div className={styles.text}>{text}</div>
          <div className={styles.ratings}>
            <IconButton onClick={action1}>
              <SentimentSatisfiedAlt />
            </IconButton>
            <IconButton onClick={action2}>
              <SentimentSatisfied />
            </IconButton>
            <IconButton onClick={action3}>
              <SentimentVeryDissatisfied />
            </IconButton>
          </div>
        </div>
      </Card>
    </Draggable>
  );
}
