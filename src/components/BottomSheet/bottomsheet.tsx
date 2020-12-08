import React, { ReactNode } from 'react';
import Sheet from 'react-modal-sheet';

interface BottomSheetProps {
  children: ReactNode;
  title?: string;
}

export default function BottomSheet(props: BottomSheetProps) {
  const [isOpen, setOpen] = React.useState(false);

  const { children, title } = props;

  return (
    <>
      <Sheet isOpen={props.open} onClose={() => setOpen(false)}>
        <Sheet.Container>
          <Sheet.Header>{title}</Sheet.Header>
          <Sheet.Content>{children}</Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop />
      </Sheet>
    </>
  );
}
