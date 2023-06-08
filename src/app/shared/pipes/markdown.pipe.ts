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
      // estas opciones de abajo ademas del content, son para que no salgan advertencias
      const htmlContent: string = marked(content, {
        mangle: false,
        headerIds: false,
      });
      return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
    } else {
      return '';
    }
  }
}
