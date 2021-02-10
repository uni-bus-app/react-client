import { ReactNode, useRef, useState, useEffect } from 'react';
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimation,
  PanInfo,
} from 'framer-motion';

interface DraggableProps {
  persist: boolean;
  children: ReactNode;
  endAction: () => void;
}

export default function Draggable(props: DraggableProps) {
  const { persist, children, endAction } = props;

  const dragControls = useDragControls();
  const controls = useAnimation();
  const panelRef = useRef(null);
  const x = useMotionValue(0);
  const [value, setValue] = useState(true);
  const [x2, setX2] = useState(0);

  const onDragEnd = (ev: Event, info: PanInfo) => {
    const shouldClose =
      info.velocity.x > 20 || (info.velocity.x >= 0 && info.point.x > 100);
    if (shouldClose || persist) {
      controls.start('stage0');
    } else {
      controls.start('stage1');
      endAction();
    }
  };
  const onUpdate = (latest: any) => {
    setX2(latest.x);
  };

  return (
    <motion.div
      drag="x"
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
        stage0: { x: 0 },
        stage1: { x: -window.innerWidth },
      }}
      ref={panelRef}
      dragControls={dragControls}
    >
      {children}
    </motion.div>
  );
}
