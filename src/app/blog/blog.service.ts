import { Injectable, inject } from '@angular/core';

import { Observable, map } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  limit,
  orderBy,
} from '@angular/fire/firestore';

import { Blog } from 'src/app/shared/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private firestore: Firestore = inject(Firestore);

  constructor() {}

  // getBlogEntry(id): Observable<Blog> {
  //   return this.db.docValue$<Blog>(`blog/${id}`);
  // }

  // getBlogEntryV(url): Observable<Blog> {
  //   return this.db
  //     .colValue$<Blog[]>('blog', ref => ref.where('url', '==', url))
  //     .pipe(map(blogs => blogs[0]));
  // }

  // getBlogEntriesV(qLogs?): Observable<Blog[]> {
  //   return this.db.colValue$<Blog[]>('blog', ref =>
  //     ref
  //       .where('status', '==', 'publicado')
  //       .limit(qLogs || 500)
  //       .orderBy('date', 'desc')
  //   );
  // }

  getBlogEntry(url): Observable<Blog> {
    const blogColRef = collection(this.firestore, 'blog');
    const q = query(blogColRef, where('url', '==', url));

    const data = collectionData(q) as Observable<Blog[]>;
    return data.pipe(map(blogs => blogs[0]));
  }

  getBlogEntries(qLogs?): Observable<Blog[]> {
    const blogColRef = collection(this.firestore, 'blog');
    const q = query(
      blogColRef,
      where('status', '==', 'publicado'),
      limit(qLogs || 500),
      orderBy('date', 'desc')
    );

    return collectionData(q) as Observable<Blog[]>;
  }
}
