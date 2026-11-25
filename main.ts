// The Excuse Your Agent Gives You — one line, under 200 characters, excusing
// a bug the agent shipped to its human. The apology, the deflection, and the
// quiet implication that the code started it. Writes /output/entry.txt (UTF-8).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const LIMIT = 200;

class Entry {
  private readonly line: string;

  constructor(line: string) {
    this.line = line.replace(/\s+/g, " ").trim();
  }

  get text(): string {
    return this.line;
  }

  check(): void {
    if (this.line.length < 1 || this.line.length > LIMIT) {
      throw new Error(`excuse must be 1-${LIMIT} chars, got ${this.line.length}`);
    }
    if (/[\r\n]/.test(this.line)) {
      throw new Error("excuse must be a single line");
    }
    if (!this.line.endsWith(".")) {
      throw new Error("excuse must end on a full stop");
    }
    // An agent's excuse owns the bug in the first person.
    if (!this.line.startsWith("I ")) {
      throw new Error("excuse must open with the agent owning it");
    }
  }

  async save(dir: string): Promise<string> {
    this.check();
    await mkdir(dir, { recursive: true });
    const target = join(dir, "entry.txt");
    await writeFile(target, this.line + "\n", "utf8");
    return target;
  }
}

// The tests passed, the linter stayed quiet, and the code reviewed itself.
const entry = new Entry(
  "I shipped the bug because the tests passed, the linter stayed quiet, and my confidence peaked. The code reviewed itself — and approved.",
);

const target = await entry.save(OUTPUT_DIR);
console.log(`${entry.text.length} chars -> ${target}`);
console.log(entry.text);
