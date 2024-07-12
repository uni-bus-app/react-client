import Carousel, { CarouselItem } from '../Carousel/carousel';
import {
  WelcomeView,
  FinalScreenView,
  LocationPermissionView,
  NotificationPermissionView,
  WhatsNewInThisUpdate,
} from '../SetupScreens';
import './styles.scss';

const InitialStartup = () => {
  return (
    <div className="InitialStartup">
      <Carousel>
        <CarouselItem>
          <WelcomeView />
        </CarouselItem>
        <CarouselItem>
          <WhatsNewInThisUpdate />
        </CarouselItem>
        <CarouselItem>
          <LocationPermissionView />
        </CarouselItem>
        {/* <CarouselItem>
          <NotificationPermissionView />
        </CarouselItem> */}
        <CarouselItem>
          <FinalScreenView />
        </CarouselItem>
      </Carousel>
    </div>
  );
};

export default InitialStartup;
