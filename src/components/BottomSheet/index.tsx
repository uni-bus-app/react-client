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
  borderRadius?: number;
}

const BottomSheet = (props: BottomSheetProps) => {
  const {
    open,
    setOpen,
    disableSwipe,
    children,
    disableBackdrop = false,
    zIndex,
    minHeight = 0,
    borderRadius = 0,
  } = props;

  return disableSwipe ? (
    <Drawer anchor={'bottom'} open={open} onClose={() => setOpen(false)}>
      {children}
    </Drawer>
  ) : (
    <SwipeableDrawer
      sx={{ zIndex: zIndex || 10000000000000, borderRadius: '50%' }}
      anchor={'bottom'}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      disableSwipeToOpen
      BackdropProps={{ invisible: disableBackdrop }}
      PaperProps={{
        sx: {
          minHeight,
          borderTopLeftRadius: `${borderRadius / 2}px`,
          borderTopRightRadius: `${borderRadius / 2}px`,
        },
      }}
    >
      {children}
    </SwipeableDrawer>
  );
};

export default BottomSheet;
