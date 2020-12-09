import React, { ReactNode } from 'react';
import Sheet from 'react-modal-sheet';

interface BottomSheetProps {
  children: ReactNode;
  title?: string;
  open: boolean;
}

export default function BottomSheet(props: BottomSheetProps) {
  const { children, title, open } = props;

  const [isOpen, setOpen] = React.useState(open);

  return (
    <>
      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header>{title}</Sheet.Header>
          <Sheet.Content>{children}</Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}
