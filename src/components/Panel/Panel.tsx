import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimation,
} from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import styles from './panel.module.css';
import { Button, Card, Icon, IconButton } from '@material-ui/core';
import { ExpandLess, ExpandMore } from '@material-ui/icons';

interface PanelProps {
  constraints: any;
}

export default function Panel(props: PanelProps) {
  const dragControls = useDragControls();
  const [stage, setStage] = useState(0);
  const controls = useAnimation();
  const panelRef = useRef(null);
  const [height, setHeight] = useState(null);
  const y = useMotionValue(0);
  const [value, setValue] = useState(true);
  const [y2, setY2] = useState(0);
  const onDragEnd = (ev, info) => {
    const shouldClose =
      info.velocity.y > 20 || (info.velocity.y >= 0 && info.point.y > 45);
    if (shouldClose) {
      controls.start('stage0');
    } else {
      controls.start('stage1');
    }
    console.log(info);
  };
  const onUpdate = (latest) => {
    setY2(latest.y);
  };

  useEffect(() => {
    setHeight(window.innerHeight);
  }, []);

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
        stage1: { y: -(height / 2) },
      }}
      className={styles.panel}
      ref={panelRef}
      dragControls={dragControls}
    >
      <Card>
        <IconButton
          className="panelButton"
          onClick={() => {
            stage === 1 ? controls.start('stage0') : controls.start('stage1');
            setStage(+!stage);
          }}
        >
          {stage === 0 ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Card>
    </motion.div>
  );
}
