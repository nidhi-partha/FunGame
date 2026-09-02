interface StatementRevealProps {
  promptText: string;
  statementText: string;
}

/** GamePhase: REVEAL. The whole group sees one anonymous statement before voting opens. */
export function StatementReveal({ promptText, statementText }: StatementRevealProps) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p className="text-sm text-pink-500">{promptText}</p>
      <p className="text-2xl font-semibold">&ldquo;{statementText}&rdquo;</p>
    </div>
  );
}
