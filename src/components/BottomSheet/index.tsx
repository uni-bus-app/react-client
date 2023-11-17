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
  disableBackdrop?: boolean;
  zIndex?: number;
  minHeight?: number;
}

const BottomSheet = (props: BottomSheetProps) => {
  const {
    open,
    setOpen,
    disableSwipe,
    children,
    disableBackdrop = false,
    zIndex,
    minHeight,
  } = props;

  return disableSwipe ? (
    <Drawer anchor={'bottom'} open={open} onClose={() => setOpen(false)}>
      {children}
    </Drawer>
  ) : (
    <SwipeableDrawer
      sx={{ zIndex: zIndex || 10000000000000 }}
      anchor={'bottom'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
      BackdropProps={{ invisible: disableBackdrop }}
      PaperProps={{
        sx: {
          minHeight: minHeight || 0,
        },
      }}
    >
      {children}
    </SwipeableDrawer>
  );
};

export default BottomSheet;
