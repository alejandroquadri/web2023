import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(content: string): SafeHtml | string {
    if (content) {
      const htmlContent: string = marked(content);
      return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    } else {
      return '';
    }
  }
}
