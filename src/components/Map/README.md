# Map

## Interface

| Prop                  | Description                               | Type                        | Required | Default                           |
| :-------------------- | :---------------------------------------- | :-------------------------- | :------: | --------------------------------- |
| `position`            | Content for the second panel              | `google.maps.LatLngLiteral` |    Y     |                                   |
| `style`               | Styling for map container                 | `CSSProperties`             |    N     | {width: '100vw', height: '100vh'} |
| `padding`             | Padding for map                           | `google.maps.Padding`       |    N     |                                   |
| `darkModeEnabled`     | Enable map dark mode                      | `boolean`                   |    N     | false                             |
| `routeOverlayEnabled` | Enable route overlay polyline             | `boolean`                   |    N     | false                             |
| `stopMarkersEnabled`  | Enable stop markers on map                | `boolean`                   |    N     | false                             |
| `onMarkerSelect`      | Callback which runs when stop is selected | `Function`                  |    N     |                                   |

## Usage

```js
import Map from 'Map';

function map() {
  return (
    <Map
      style={{ width: '100vw', height: '100vh' }}
      position={{ lat: 50.794236, lng: -1.075 }}
      padding={{ bottom: window.innerHeight / 2 }}
      stopMarkersEnabled={true}
      routeOverlayEnabled={true}
    />
  );
}
```
