import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimation,
} from 'framer-motion';
import { useRef, useState } from 'react';
import styles from './panel.module.css';
import { Card } from '@material-ui/core';

interface PanelProps {
  constraints: any;
}

export default function Panel(props: PanelProps) {
  const dragControls = useDragControls();
  const controls = useAnimation();
  const panelRef = useRef(null);
  // const height = window?.innerHeight;
  const y = useMotionValue(0);
  const [value, setValue] = useState(true);
  const [y2, setY2] = useState(0);
  const onDragEnd = (ev, info) => {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
    console.log(info);
    if (shouldClose) {
      controls.start('stage0');
    } else {
      controls.start('stage1');
    }
  };
  const onUpdate = (latest) => {
    setY2(latest.y);
  };
  return (
    <motion.div
      drag="y"
      dragConstraints={props.constraints}
      dragElastic={0}
      onDragEnd={onDragEnd}
      onUpdate={onUpdate}
      animate={controls}
      transition={{
        type: 'spring',
        damping: 40,
        stiffness: 400,
      }}
      variants={{
        stage0: { y: 0 },
        stage1: { y: -(812 / 2) },
      }}
      className={styles.panel}
      ref={panelRef}
      dragControls={dragControls}
    >
      <Card>PANEL</Card>
    </motion.div>
  );
}
