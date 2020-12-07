import { isIOS } from 'react-device-detect';

interface VideoProps {
  src: string;
  specific: boolean;
}

export default function VideoComponent(props: VideoProps) {
  const { src, specific } = props;

  return (
    <video autoPlay={true} loop={true} muted={true}>
      <source src={isIOS && specific ? src[0] : src[1]} type="video/webm" />
    </video>
  );
}
