# Map

## Interface

| Prop                  | Description                  | Type                        | Required | Default                           |
| :-------------------- | :--------------------------- | :-------------------------- | :------: | --------------------------------- |
| `position`            | Content for the second panel | `google.maps.LatLngLiteral` |    Y     |                                   |
| `style`               | Styling for map container    | `CSSProperties`             |    N     | {width: '100vw', height: '100vh'} |
| `darkModeEnabled`     | Content for the first panel  | `boolean`                   |    N     | false                             |
| `routeOverlayEnabled` | Content for the second panel | `boolean`                   |    N     | false                             |
| `stopMarkersEnabled`  | Content for the second panel | `boolean`                   |    N     | false                             |

## Usage

```js
import Map from 'Map';

function map() {
  return (
    <Map
      style={{ width: '100vw', height: '100vh' }}
      position={{ lat: 50.767688, lng: -1.077812 }}
      stopMarkersEnabled={true}
      routeOverlayEnabled={true}
    />
  );
}
```
