import { MessageCircle } from "lucide-react";

/**
 * Code-built phone mock-ups for steps 1 and 6 of the StepTracker
 * (per IMAGE-GUIDE.md: booking form and a WhatsApp chat with "Medcare",
 * no real names).
 */
export function BookingFormMock() {
  return (
    <div className="pm" aria-hidden>
      <div className="pm-head">
        <span className="pm-ic">M</span>
        Book an appointment
      </div>
      <div>
        <label>Your name</label>
        <div className="fld">Full name</div>
      </div>
      <div>
        <label>Mobile</label>
        <div className="fld">+91 mobile number</div>
      </div>
      <div>
        <label>Reason for visit</label>
        <div className="fld">Diabetes or high sugar</div>
      </div>
      <div className="pm-btn">Request appointment</div>
      <p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-2)", lineHeight: 1.4 }}>
        We confirm most requests within 30 to 60 minutes during clinic hours.
      </p>
    </div>
  );
}

export function WhatsAppMock({ booking = false }: { booking?: boolean }) {
  return (
    <div className="pm" aria-hidden>
      <div className="pm-head">
        <span className="pm-ic">
          <MessageCircle size={14} aria-hidden />
        </span>
        Medcare
      </div>
      {booking ? (
        <>
          <div className="msg out">Hello Medcare, I would like to book a visit about diabetes.</div>
          <div className="msg in">
            <span className="who">Medcare</span>
            Thank you. We will confirm your time within 30 to 60 minutes.
          </div>
        </>
      ) : (
        <>
          <div className="msg in">
            <span className="who">Medcare</span>
            Your report is ready. Please visit the clinic for a review with Dr.
            Das.
          </div>
          <div className="msg out">Thank you, I will come in.</div>
        </>
      )}
    </div>
  );
}
