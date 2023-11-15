import Carousel, { CarouselItem } from '../Carousel/carousel';
import {
  WelcomeView,
  FinalScreenView,
  LocationPermissionView,
} from '../SetupScreens';

interface InitialStartupProps {
  setSplashScreen: (value: boolean) => void;
}

const InitialStartup = (props: InitialStartupProps) => {
  const { setSplashScreen } = props;
  return (
    <Carousel setSplashScreen={setSplashScreen}>
      <CarouselItem>
        <WelcomeView />
      </CarouselItem>
      <CarouselItem>
        <LocationPermissionView />
      </CarouselItem>

      <CarouselItem>
        <FinalScreenView />
      </CarouselItem>
    </Carousel>
  );
};

export default InitialStartup;
