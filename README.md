![react-controllable-animation logo](https://raw.githubusercontent.com/CalvinNolan/react-controllable-animation/master/react-controllable-animation-logo.png) 

# react-controllable-animation
Dynamic and controllable animations in React. Check out the [react-controllable-animation-generator](https://github.com/CalvinNolan/react-controllable-animation-generator) to help create the required assets for an animation.

## Demo
Coming soon

## Installation
`npm i react-controllable-animation` to install in your project.

`import ControllableAnimation from 'react-controllable-animation';` to use in your app.

## Usage
Here are the props with their meaning for the `ControllableAnimation` component to control the animation:

- `spritesheet`, Required, String of image URL

  Use [react-controllable-animation-generator](https://github.com/CalvinNolan/react-controllable-animation-generator) to generate spritesheets easily.
  
  A single image structured as a grid of animation frames. The description language describes the order that the frames for each animation should be in.

- `spritesheetDescription`, Required, Object

  Use [react-controllable-animation-generator](https://github.com/CalvinNolan/react-controllable-animation-generator) to generate the description language easily.
  
  The structure of a description should be: 
  ```
  {
    name: String,
    frame_width: Integer,
    frame_height: Integer,
    default_frame_position: Integer,
    animation_description: {
      [animation_name: String]: {
        frames: Integer,
        first_frame_position: Integer,
        climax: Integer
      }
    }
   } 
  ```
  Currently, all frames must be of the same width and height and those dimensions are listed under `frame_width` and `frame_height`.
  Any number of animations can be listed in the `animation_description` object. 
  Only the climax attribute is optional and it represents the frame that triggers the `onAnimationClimax` prop.

- `animation`, Optional, String

  The name of the animation to currently display.
  Defaults to 'default'

- `onLoad`, Optional, Function

  A callback function that triggers once the spritesheet image has loaded meaning the animation is ready to control.
  Defaults to an empty function

- `status`, Optional, One of String \['play', 'pause'\]

  Used to play or pause the current animation.
  Defaults to 'play'

- `speed`, Optional, Float

  Dictates the current speed of the animation, essentially the frames per second.
  0.5 would play it at half speed, 2 would play it at double speed.
  The default of 1 plays an animation at 10 FPS.

- `loops`, Optional, Integer

  Dictates the number of complete loops an animation should make.
  The default value of 0 represents endless looping.

- `onLoopComplete`, Optional, Function

  A callback function that triggers once the animation has completed the loops specified by the `loops` props.
  It does not trigger when `loops` is set to the endless value of 0
  Defaults to an empty function

- `onAnimationClimax`, Optional, Function

  A callback function that triggers on the climax frame for the current animation specified by the description language.
  Defaults to an empty function and does not trigger if a climax frame is not specified.

## Contributing

Check out [the list of issues](https://github.com/CalvinNolan/react-controllable-animation/issues) or create a new one you feel would be useful, assign it to yourself and we'll discuss it there. Get cracking on it, submit a PR and 🚀   
