# Data Box

## Interface

| Prop             | Description                  | Type   | Required | Default |
| :--------------- | :--------------------------- | :----- | :------: | ------- |
| `panel1Children` | Content for the first panel  | `node` |    N     |         |
| `panel2Children` | Content for the second panel | `node` |    N     |         |

## Usage

```js
import NewPanel from 'NewPanel';

function newpanel() {
  return (
    <NewPanel
      panel1Children={<div>Panel 1 content</div>}
      panel2Children={<div>Panel 2 content</div>}
    />
  );
}
```

## Description

New panel component which has 2 panels that you swipe between.
