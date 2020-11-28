import { useState, useEffect } from 'react';
import styles from './databox.module.css';

interface DataBoxProps {
  icon: Node;
  text: String;
}

export default function DataBox(props: DataBoxProps) {
  const { text } = props;

  const [icon, setIcon] = useState(null);
  useEffect(() => {
    setIcon(props.icon);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.icon}>{icon}</div>
      <span className={styles.text}>{text}</span>
    </div>
  );
}
