import Alert from '@mui/material/Alert';

interface AlertProps {
  message: string;
  alertSeverity: 'Success' | 'Error' | 'Warning' | 'Info';
  showAlert: boolean;
  setShowAlert: any;
}

const AlertComponent = (props: AlertProps) => {
  const { message, showAlert, setShowAlert } = props;

  const animationDuration = 0.25; // seconds
  const transitionStyles = {
    entering: { opacity: 0, transform: 'translateY(-100%)' },
    entered: { opacity: 1, transform: 'translateY(0)' },
    exiting: { opacity: 0, transform: 'translateY(-100%)' },
    exited: { opacity: 0, transform: 'translateY(-100%)' },
  };

  setTimeout(() => {
    setShowAlert(false);
  }, 5000);

  return (
    <div
      style={{
        position: 'fixed',
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        top: '6px',
        zIndex: 9999,
        transition: `opacity ${animationDuration}s, transform ${animationDuration}s`,
        ...transitionStyles[showAlert ? 'entered' : 'exited'],
      }}
    >
      <Alert sx={{ borderRadius: '8px' }} severity="success">
        {message}
      </Alert>
    </div>
  );
};

export default AlertComponent;
