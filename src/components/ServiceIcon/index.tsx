import styles from './styles.module.css';

const ServiceIcon = ({ darkTheme }: { darkTheme: boolean }) => {
  return (
    <div
      className={`${styles.u1ServiceIcon} ${
        darkTheme ? styles.darkServiceIcon : ''
      }`}
    >
      U1
    </div>
  );
};

export default ServiceIcon;
