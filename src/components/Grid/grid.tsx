import React from 'react';
import styles from './grid.module.css';

interface GridProps {}

export default function Grid(props: GridProps) {
  return (
    <div className={styles.container}>
      <div className={styles.gridBlock}>{'TEST'}</div>
      <div className={styles.gridBlock}>{'TEST'}</div>
    </div>
  );
}
