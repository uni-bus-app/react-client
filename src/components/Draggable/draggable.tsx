import { ReactNode, useRef, useState, useEffect } from 'react';
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimation,
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
  const [width, setWidth] = useState(null);
  const x = useMotionValue(0);
  const [value, setValue] = useState(true);
  const [x2, setX2] = useState(0);

  const onDragEnd = (ev, info) => {
    const shouldClose =
      info.velocity.x > 20 || (info.velocity.x >= 0 && info.point.x > 100);
    if (shouldClose || persist) {
      controls.start('stage0');
    } else {
      controls.start('stage1');
      endAction();
    }
  };
  const onUpdate = (latest) => {
    setX2(latest.x);
  };

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

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
        stage1: { x: -width },
      }}
      ref={panelRef}
      dragControls={dragControls}
    >
      {children}
    </motion.div>
  );
}
