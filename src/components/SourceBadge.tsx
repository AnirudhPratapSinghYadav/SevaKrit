type SourceBadgeProps = {
  publisher: string;
  url: string;
  checkedAt: string;
};

export default function SourceBadge({ publisher, url, checkedAt }: SourceBadgeProps) {
  const notChecked = checkedAt === "not-yet-checked";

  return (
    <div className="flex flex-col gap-1 rounded-md border border-sage bg-canvas px-3 py-2 text-sm">
      <p>
        <span className="font-semibold text-ink">{publisher}</span>{" "}
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-terracotta-text underline underline-offset-4"
        >
          Official source
        </a>
      </p>
      <p>{notChecked ? "Not yet checked" : `Last checked: ${checkedAt}`}</p>
    </div>
  );
}

