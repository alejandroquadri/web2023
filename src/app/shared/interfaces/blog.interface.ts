export interface Blog {
  id?: string;
  date: string;
  author: string;
  title: string;
  url: string;
  language: string;
  featureImg: string;
  content: string;
  preview: string;
  tags: Array<string>;
  status: 'publicado' | 'borrador' | 'eliminado';
}
