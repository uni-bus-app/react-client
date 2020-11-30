# VideoComponent

## Interface

| Prop       | Description                                         | Type            | Required | Default |
| :--------- | :-------------------------------------------------- | :-------------- | :------: | :-----: |
| `src`      | Source for the video                                | `Array<string>` |    Y     |         |
| `specific` | Whether or not the video is a device specific video | `Boolean`       |    N     |  False  |

## Usage

```js
import VideoComponent from 'video';
import video1 from './video.webm';
import video2 from './video2.webm';

function VideoComponent() {
  return (
    <VideoComponent
      src={[video1, video2]
      specific={true}
    />
  );
}
```

## Description

A video player that autoplays video on a loop with no audio, will automatically detect between iOS and Android if required.

If the video is device specific, you should put the 2 videos in an array (with iOS being in array position 0 and Android being array position 1)
You must also set the specific prop to true
