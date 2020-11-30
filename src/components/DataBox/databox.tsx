import { ReactNode } from 'react';
import styles from './databox.module.css';
import Draggable from '../Draggable/draggable';

interface DataBoxProps {
  icon: ReactNode;
  text: string;
}

export default function DataBox(props: DataBoxProps) {
  const { text, icon } = props;

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
