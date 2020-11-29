# Speed Dial

## Interface

| Prop | Description | Type | Required | Default |
| :--- | :---------- | :--- | :------: | ------- |
|      |             |      |          |         |

## Usage

```js
import SpeedDials from 'SpeedDial';
function Dial() {
  return (
    <SpeedDials
      actions={[
        { icon: <Settings />, name: 'Settings' },
        { icon: <Home />, name: 'Home' },
        { icon: <School />, name: 'University' },
        { icon: <ShoppingCart />, name: 'Tesco' },
        { icon: <Favorite />, name: 'Friends House' },
      ]}
    />
  );
}
```

## Description

Speed Dial that has multiple buttons available by tapping the main FAB
