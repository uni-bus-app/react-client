import {
  motion,
  MotionValue,
  PanInfo,
  useAnimation,
  useMotionValue,
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import styles from './NewPanel.module.css';
import { Card } from '@material-ui/core';

interface PanelProps {
  panel1Children?: ReactNode;
  panel2Children?: ReactNode;
  style?: any;
  onLoad?: (motionValue: MotionValue<number>) => void;
}

export const NewPanelComponent = (props: PanelProps) => {
  const { panel1Children, panel2Children, style, onLoad } = props;

  const constrainstRef1 = useRef(null);
  const constrainstRef2 = useRef(null);

  const x = useMotionValue<number>(0);

  useEffect(() => {
    x.set(window.innerWidth);
    onLoad && onLoad(x);
  }, []);

  const panel1Controls = useAnimation();
  const panel2Controls = useAnimation();

  const panel2DragEnd = (ev: Event, info: PanInfo) => {
    const shouldClose =
      info.velocity.x > 20 || (info.velocity.x >= 0 && info.point.x > 45);
    if (shouldClose) {
      panel2Controls.start('stage1');
    } else {
      panel2Controls.start('stage0');
    }
  };
  const panel1DragEnd = (ev: Event, info: PanInfo) => {
    const shouldClose =
      info.velocity.x > 20 || (info.velocity.x >= 0 && info.point.x > 45);
    if (shouldClose) {
      panel1Controls.start('stage1');
    } else {
      panel1Controls.start('stage0');
    }
  };

  return (
    <div style={{ height: '100vh' }}>
      <motion.div
        ref={constrainstRef1}
        className={styles.panelContainer1}
        style={{ height: '100vh' }}
      >
        <motion.div
          drag="x"
          dragConstraints={constrainstRef1}
          className={styles.panel1}
          style={{ x, zIndex: 999 }}
          animate={panel1Controls}
          variants={{
            stage0: { x: 0 },
            stage1: { x: window.innerWidth },
          }}
          transition={{
            type: 'spring',
            damping: 40,
            stiffness: 400,
          }}
          onDragEnd={panel2DragEnd}
          dragElastic={0}
        >
          <Card>{panel1Children}</Card>
        </motion.div>
        <motion.div
          drag="x"
          dragConstraints={constrainstRef2}
          className={styles.panel2}
          style={{ x, zIndex: 999 }}
          animate={panel2Controls}
          variants={{
            stage0: { x: 0 },
            stage1: { x: window.innerWidth },
          }}
          transition={{
            type: 'spring',
            damping: 40,
            stiffness: 400,
          }}
          onDragEnd={panel1DragEnd}
          dragElastic={0}
        >
          <Card>{panel2Children}</Card>
        </motion.div>
      </motion.div>
      <motion.div
        ref={constrainstRef2}
        className={styles.panelContainer2}
        style={{ height: '100vh' }}
      ></motion.div>
    </div>
  );
};
