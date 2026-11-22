import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { Button } from "@/components/ui/button";
import { verifyPayment } from "@/lib/backend.functions";

export const Route = createFileRoute("/payment-return")({
  validateSearch: (s: Record<string, unknown>): { reference?: string } => {
    const ref = typeof s["reference"] === "string" ? s["reference"] : typeof s["trxref"] === "string" ? s["trxref"] : undefined;
    return ref ? { reference: ref } : {};
  },
  head: () => ({
    meta: [
      { title: "Payment status · SchoolOS" },
      { name: "description", content: "Check the status of your SchoolOS subscription payment." },
      { property: "og:title", content: "Payment status · SchoolOS" },
      { property: "og:description", content: "Check the status of your SchoolOS subscription payment." },
    ],
  }),
  component: PaymentReturn,
});

type State = "checking" | "success" | "pending" | "failed" | "error" | "missing";

function PaymentReturn() {
  const { reference } = Route.useSearch();
  const [state, setState] = useState<State>(reference ? "checking" : "missing");
  const [detail, setDetail] = useState("");

  const check = useCallback(async () => {
    if (!reference) return;
    setState("checking");
    try {
      // The server verifies the transaction with the payment provider. This page never grants access itself.
      const res = (await verifyPayment({ data: { reference } })) as unknown as {
        status?: string;
        result?: { ok?: boolean; reason?: string };
      };
      if (res.status === "succeeded" || res.result?.ok === true) setState("success");
      else if (res.result?.reason === "pending" || res.status === "pending") setState("pending");
      else {
        setDetail(res.result?.reason ?? "The payment was not completed.");
        setState("failed");
      }
    } catch (err) {
      setDetail(err instanceof Error ? err.message : "Verification failed.");
      setState("error");
    }
  }, [reference]);

  useEffect(() => {
    void check();
  }, [check]);

  return (
    <>
      <PublicHeader />
      <main className="mx-auto max-w-lg space-y-5 px-5 py-16" aria-live="polite">
        {state === "checking" && <p role="status" className="text-muted-foreground">Confirming your payment…</p>}
        {state === "missing" && (
          <>
            <h1 className="text-2xl font-semibold">No payment to check</h1>
            <p className="text-muted-foreground">This page needs a payment reference from the payment provider.</p>
            <Button asChild><Link to="/pricing">View plans</Link></Button>
          </>
        )}
        {state === "success" && (
          <>
            <h1 className="text-2xl font-semibold">Payment confirmed</h1>
            <p className="text-muted-foreground">Your subscription is active and your school workspace is ready.</p>
            <Button asChild><Link to="/dashboard">Open my school</Link></Button>
          </>
        )}
        {state === "pending" && (
          <>
            <h1 className="text-2xl font-semibold">Payment still processing</h1>
            <p className="text-muted-foreground">Your bank has not confirmed the payment yet. This can take a minute.</p>
            <Button onClick={() => void check()}>Check again</Button>
          </>
        )}
        {state === "failed" && (
          <>
            <h1 className="text-2xl font-semibold">Payment not completed</h1>
            <p className="break-words text-muted-foreground">{detail} You have not been charged for a failed payment.</p>
            <Button asChild><Link to="/pricing">Choose a plan again</Link></Button>
          </>
        )}
        {state === "error" && (
          <>
            <h1 className="text-2xl font-semibold">We couldn’t confirm the payment</h1>
            <p className="break-words text-muted-foreground">{detail}</p>
            <div className="flex gap-3">
              <Button onClick={() => void check()}>Try again</Button>
              <Button asChild variant="outline"><Link to="/login">Sign in</Link></Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
