type StepTimelineProps = {
  steps: string[];
};

/** Ordered steps from the official source. */
export default function StepTimeline({ steps }: StepTimelineProps) {
  if (steps.length === 0) {
    return <p className="text-sm">The official steps are still being verified.</p>;
  }
  return (
    <ol className="list-decimal pl-6">
      {steps.map((step) => (
        <li key={step} className="py-1">
          {step}
        </li>
      ))}
    </ol>
  );
}
