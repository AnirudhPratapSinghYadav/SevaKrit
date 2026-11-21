type DocumentChecklistProps = {
  documents: string[];
};

/** Documents the official source lists. Shown as a plain list; nothing is uploaded or stored. */
export default function DocumentChecklist({ documents }: DocumentChecklistProps) {
  if (documents.length === 0) {
    return <p className="text-sm">The official documents list is still being verified.</p>;
  }
  return (
    <ul className="list-disc pl-6">
      {documents.map((document) => (
        <li key={document}>{document}</li>
      ))}
    </ul>
  );
}
