import Card from '@mui/material/Card';
import { createRef, TouchEvent, useRef, useState } from 'react';
import styles from './styles.module.css';

interface CarouselProps {
  items: any;
  onStart: (index: number) => void;
  onMove: (index: number, value: any) => void;
  onEnd: (index: number, back?: boolean) => void;
}

const getNextIndex = (index: number, array: any[]) => {
  if (index === array.length - 1) {
    return 0;
  } else {
    return index + 1;
  }
};

const getPrevIndex = (index: number, array: any[]) => {
  if (index === 0) {
    return array.length - 1;
  } else {
    return index - 1;
  }
};

const Carousel = (props: CarouselProps) => {
  const { items, onStart, onMove, onEnd } = props;
  const [index, setIndex] = useState<number>(0);
  const prevCard = createRef<HTMLDivElement>();
  const activeCard = createRef<HTMLDivElement>();
  const nextCard = createRef<HTMLDivElement>();

  const startPos = useRef<number>(0);
  const startTime = useRef<number>(0);
  const lastEvTime = useRef<number>(0);

  const animate = (
    element: HTMLDivElement | null,
    pos: number,
    duration: number,
    composite: CompositeOperation = 'replace',
    easing?: any,
    start?: number | null
  ): Animation | undefined => {
    const animation = element?.animate(
      { transform: `translateX(${pos}px)` },
      {
        duration,
        fill: 'forwards',
        composite,
        easing,
      }
    );
    if (animation && start) {
      animation.ready.then((value) => {
        value.startTime = start;
      });
    }
    return animation;
  };

  const animateCards = async (
    pos: number,
    duration: number,
    easing?: any,
    composite?: CompositeOperation
  ) => {
    const start = document.timeline.currentTime;
    const prevCardAnimation = animate(
      prevCard.current,
      duration === 300 ? pos - window.innerWidth : pos,
      duration,
      composite,
      easing,
      start
    );
    const activeCardAnimation = animate(
      activeCard.current,
      pos,
      duration,
      composite,
      easing,
      start
    );
    if (activeCardAnimation && prevCardAnimation) {
      activeCardAnimation.startTime = prevCardAnimation.startTime;
    }
    const nextCardAnimation = animate(
      nextCard.current,
      duration === 300 ? pos + window.innerWidth : pos,
      duration,
      composite,
      easing,
      start
    );
    if (nextCardAnimation && activeCardAnimation) {
      nextCardAnimation.startTime = activeCardAnimation.startTime;
    }
    if (prevCardAnimation && activeCardAnimation && nextCardAnimation) {
      return Promise.all([
        prevCardAnimation.finished,
        activeCardAnimation.finished,
        nextCardAnimation.finished,
      ]);
    }
  };

  const touchStart = (e: TouchEvent<HTMLDivElement>) => {
    const { clientX } = e.touches[0];
    startPos.current = clientX;
    onStart(index);
    startTime.current = e.timeStamp;
  };

  const touchMove = (e: TouchEvent<HTMLDivElement>) => {
    const { clientX } = e.touches[0];
    const position = clientX - startPos.current;
    const thing = -position / window.innerWidth;
    animateCards(position, 0, undefined, 'add');
    onMove(index, thing);
    lastEvTime.current = e.timeStamp;
  };

  const touchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const { changedTouches, timeStamp } = e;
    const { clientX } = changedTouches[0];
    const position = clientX - startPos.current;
    const speed = Math.abs(position) / (timeStamp - startTime.current);
    const value = speed > 0.2;
    const diffPercentage = -position / window.innerWidth;
    if (diffPercentage > 0.3) {
      animateCards(-window.innerWidth, 300, 'ease-out').then((values) => {
        setIndex(getNextIndex(index, items));
      });
      onEnd(getNextIndex(index, items), false);
    } else if (diffPercentage < -0.3) {
      animateCards(window.innerWidth, 300, 'ease-out').then((values) => {
        setIndex(getPrevIndex(index, items));
      });
      onEnd(getPrevIndex(index, items), true);
    } else if (value) {
      if (diffPercentage > 0) {
        animateCards(-window.innerWidth, 300, 'ease-out').then((values) => {
          setIndex(getNextIndex(index, items));
        });
        onEnd(getNextIndex(index, items), false);
      } else {
        animateCards(window.innerWidth, 300, 'ease-out').then((values) => {
          setIndex(getPrevIndex(index, items));
        });
        onEnd(getPrevIndex(index, items), true);
      }
    } else {
      animateCards(0, 300, 'ease-out');
      onEnd(index);
    }
  };

  return items.map((item: any, i: number) => {
    if (i === getPrevIndex(index, items)) {
      return (
        <Card ref={prevCard} className={`${styles.item} ${styles.prevCard}`}>
          {item}
        </Card>
      );
    } else if (i === index) {
      return (
        <Card
          ref={activeCard}
          className={styles.item}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
        >
          {items[index]}
        </Card>
      );
    } else if (i === getNextIndex(index, items)) {
      return (
        <Card ref={nextCard} className={`${styles.item} ${styles.nextCard}`}>
          {item}
        </Card>
      );
    }
  });
};

export default Carousel;
