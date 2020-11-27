import { useRef } from 'react';
import { Map } from '../components/Map/Map';
import Panel from '../components/Panel/Panel';
import { motion } from 'framer-motion';
import styles from '../components/Panel/panel.module.css';

export default function Home() {
  const constraintsRef = useRef(null);
  return (
    <>
      <motion.div ref={constraintsRef} className={styles.panelContainer}>
        <Map></Map>
        <Panel constraints={constraintsRef}></Panel>
      </motion.div>
    </>
  );
}
