# BottomSheet Component

## Interface

| Prop    | Description                | Type     | Required | Default |
| :------ | :------------------------- | :------- | :------: | :-----: |
| `title` | Header for the BottomSheet | `string` |    N     |         |

## Usage

```js
import BottomSheet from 'bottomsheet';

function BottomSheet() {
  return (
    <BottomSheet>
      <div>{'Content Here'}</div>
    </BottomSheet>
  );
}
```

## Description

A popup bottom sheet that opens with an action to display any content. Can be slid back down or tapped to close.
