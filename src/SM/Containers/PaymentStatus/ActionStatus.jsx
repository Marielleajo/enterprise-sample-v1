import React, { useEffect, useState } from "react";

import paymentSuccessImage from "../../../Assets/paymentSuccess.jpg";
import paymentFailedImage from "../../../Assets/paymentFailed.jpg";
import unSubscribeImage from "../../../Assets/unSubscribe.jpg";
import { Button } from "@mui/material";
import "./ActionStatus";

function PaymentStatus() {
  const [paymentSuccessImageful, setpaymentSuccessImageful] = useState(
    window.location.pathname === "/success"
  );
  const [paymentFailure, setPaymentFail] = useState(
    window.location.pathname === "/failed"
  );
  const [unsubSuccess, setUnsubSuccess] = useState(
    window.location.pathname === "/success-unsub"
  );

  return (
    <div id="action-status">
      <div className="payment-card">
        <img
          src={
            paymentSuccessImageful
              ? paymentSuccessImage
              : paymentFailure
              ? paymentFailedImage
              : unsubSuccess
              ? unSubscribeImage
              : ""
          }
          alt="Action Status"
        />

        <h1 className="mt-5">
          {paymentSuccessImageful
            ? "Payment Successful !"
            : paymentFailure
            ? "Payment Failed !"
            : unsubSuccess
            ? "Unsubscription Successful"
            : ""}
        </h1>

        {unsubSuccess && <h2 className="mt-2">Sorry to see you Go :(</h2>}

        {!unsubSuccess && (
          <Button
            variant="contained"
            className="mui-btn primary filled mt-5"
            href="/dashboard"
          >
            Return to Dashboard
          </Button>
        )}
      </div>
    </div>
  );
}

export default PaymentStatus;
