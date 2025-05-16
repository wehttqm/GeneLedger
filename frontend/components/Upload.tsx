import { SetMerkle } from "./SetMerkle";

export const Upload = () => {
  return (
    <div>
      <SetMerkle />

      <div className="absolute flex flex-col left-0 bottom-0 p-2">
        <span>Notes</span>
        <span>
          1) File upload expects a specific format. You can download an example{" "}
          <a href="/test_dna.txt" download="test_dna.txt" className="underline">
            here
          </a>
        </span>
      </div>
    </div>
  );
};
