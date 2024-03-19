class TextStreamProcessor {
  private static splitters = [
    ".",
    ",",
    "?",
    "!",
    ";",
    ":",
    "—",
    "-",
    "(",
    ")",
    "[",
    "]",
    "}",
    " ",
  ];

  static async *textChunker(
    chunks: AsyncIterable<string>,
  ): AsyncIterable<string> {
    let buffer = "";

    for await (const text of chunks) {
      if (this.splitters.includes(buffer[buffer.length - 1] ?? "")) {
        yield buffer + " ";
        buffer = text;
      } else if (text.length > 0 && this.splitters.includes(text[0] ?? "")) {
        yield buffer + text[0] + " ";
        buffer = text.substring(1);
      } else {
        buffer += text;
      }
    }

    if (buffer) {
      yield buffer + " ";
    }
  }
}

export default TextStreamProcessor;
