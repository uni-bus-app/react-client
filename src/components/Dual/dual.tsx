import React, { ReactNode } from 'react';
import styles from './dual.module.css';

interface DualProps {
  children: ReactNode;
}

export default function Dual(props: DualProps) {
  const { children } = props;

  return <div className={styles.container}>{children}</div>;
}
