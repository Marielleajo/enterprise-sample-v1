import React, {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";

/**
 * Counter Component - A React component for displaying a countdown timer.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {number} props.initialTime - The initial time in seconds for the countdown timer.
 * @param {Function} [props.onTimeUp] - A callback function to be triggered when the countdown reaches zero.
 * @returns {JSX.Element} - Rendered component.
 *
 * @example
 * // Example usage of Counter component:
 * <Counter initialTime={30} onTimeUp={(timeUp) => console.log("Time's up!", timeUp)} />
 *
 * This will create a countdown timer starting from 30 seconds. When the countdown
 * finishes, it will log "Time's up! true" to the console.
 *
 * @requires React
 * @requires useState
 * @requires useEffect
 * @requires useRef
 * @requires forwardRef
 * @requires useImperativeHandle
 */

const CounterComponent = forwardRef(({ initialTime, onTimeUp }, ref) => {
  const [seconds, setSeconds] = useState(initialTime);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    intervalIdRef.current = setInterval(() => {
      if (seconds > 0) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        clearInterval(intervalIdRef.current);
        if (onTimeUp) {
          onTimeUp(true);
        }
      }
    }, 1000);

    return () => clearInterval(intervalIdRef.current);
  }, [seconds, onTimeUp]);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  const resetTimer = () => {
    clearInterval(intervalIdRef.current);
    setSeconds(initialTime);
  };

  useImperativeHandle(ref, () => ({
    reset: resetTimer,
  }));

  return (
    <div>
      <span>{formatTime(Math.floor(seconds / 60))}</span>:
      <span>{formatTime(seconds % 60)}</span>
    </div>
  );
});

// Add displayName for debugging and readability
CounterComponent.displayName = "CounterComponent";

export default CounterComponent;
