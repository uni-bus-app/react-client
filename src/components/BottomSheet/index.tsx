import { Drawer } from '@mui/material';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface BottomSheetProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  disableSwipe?: boolean;
  onBeforeClose?: () => boolean;
  onClose?: () => void;
  children: ReactNode;
}

const BottomSheet = (props: BottomSheetProps) => {
  const { open, setOpen, disableSwipe, children } = props;
  return disableSwipe ? (
    <Drawer anchor={'bottom'} open={open} onClose={() => setOpen(false)}>
      {children}
    </Drawer>
  ) : (
    <SwipeableDrawer
      sx={{ zIndex: 10000000000000 }}
      anchor={'bottom'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
    >
      {children}
    </SwipeableDrawer>
  );
};

export default BottomSheet;
