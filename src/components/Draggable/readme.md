# Draggable

## Interface

| Prop         | Description                                        | Type       | Required | Default             |
| :----------- | :------------------------------------------------- | :--------- | :------: | ------------------- |
| `persistent` | Determines whether the element can be swiped away  | `Boolean`  |    N     | False               |
| `endAction`  | Function to call when element has been swiped away | `Function` |    N     | Deletes the element |

## Usage

```js
import Draggable from 'draggable';
function draggable() {
  return (
    <Draggable
    persistent={true}
    endAction={() => console.log('Element Removed'))}>
      <AnyContent></Anycontent>
    </Draggable>
  );
}
```

## Description

A draggable element (Along the X or Y axis) to attach to any element that requires a touch event to dismiss.

TODO: Add X/Y customisation, add distance customisation
