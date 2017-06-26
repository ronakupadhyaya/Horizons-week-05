# Warmup exercise: Component lifecycle: Timer

## Goal

The goal of this exercise is to build a timer by using React
component lifecycle methods.

## Time limit: 15 minutes

## Instructions

1. [Open CodePen for this exercise.](http://codepen.io/moose-horizons/pen/QErWVq?editors=0010)
1. Implement the `update` function. This function should call `this.setState()`
   and update `this.state.secondsLeft` to be `(this.state.end - Date.now()) / 1000`.
1. Implement the `componentDidMount` function. Use `setInterval()` to call
   `this.update` periodically.
   ![](img/setInterval.png)
1. Implement the `componentWillUnmount` function. Use `clearInterval()` to
   cancel the background update process.
1. There are two timers on the page, verify that they count down from 1 and
   5 minutes respectively.
