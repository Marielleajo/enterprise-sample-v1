import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { SIGN_OUT } from "../../APIs/Common";
import { useDispatch } from "react-redux";
import { SetMenus } from "../../Redux/New/Redux/Reducers/Menus";
import { SignOut } from "../../Redux/New/Redux/Reducers/Authentication";
const InactivityTracker = ({ timeout = 300000 }) => {
  // Timeout is in milliseconds (default: 5 minutes)
  const navigate = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    let inactivityTimer;

    // Reset inactivity timer on user activity
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(handleSignOut, timeout);
    };

    // Handle logout
    const handleSignOut = async () => {
      try {
        let response = await SIGN_OUT({});
        if (response?.data?.success) {
          dispatch(SetMenus([]));
          dispatch(SignOut());
          window.location.href = "/";
        }
      } catch (e) {
        console.log(e);
        dispatch(SetMenus([]));
        dispatch(SignOut());
        window.location.href = "/";
      }
    };

    // List of events to track user activity
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];

    // Attach event listeners
    events.forEach((event) => window.addEventListener(event, resetTimer));

    // Set the initial inactivity timer
    resetTimer();

    // Cleanup on unmount
    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [timeout, navigate]);

  return null; // No UI needed for this component
};

export default InactivityTracker;
