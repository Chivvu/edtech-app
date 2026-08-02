export class Sanitizer {
  /**
   * Strips dangerous HTML tags and XSS vectors from user input strings
   */
  static sanitizeHtml(input: string): string {
    if (!input) return "";

    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
      .replace(/on\w+="[^"]*"/g, "")
      .replace(/javascript:[^\s"]+/gi, "")
      .trim();
  }

  /**
   * Sanitizes search query inputs to prevent SQL injection and regex vulnerability exploits
   */
  static sanitizeSearchQuery(query: string): string {
    if (!query) return "";
    return query.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();
  }
}
