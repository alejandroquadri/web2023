import { DateFnsPipe } from './../pipes/date-fns.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { SwiperModule } from 'swiper/angular';
// import { NgxMaskModule } from 'ngx-mask';
import { NgxMaskPipe, NgxMaskDirective, provideNgxMask } from 'ngx-mask';

import {
  FooterComponent,
  HeaderComponent,
  SideMenuComponent,
  MenuListComponent,
  CtaBtnComponent,
  FormComponent,
  QueryComponent,
  InternalLinkComponent,
  FeatureWithImg,
  SubnavComponent,
  ColorZoomComponent,
  ColorsComponent,
  CustomAccItemComponent,
  PricesComponent,
  SizesComponent,
  SpecialPiecesComponent,
  SpecsComponent,
  UsesComponent,
  ThreeFeaturesComponent,
  LangChangeComponent,
  GalleryComponent,
  ProductDetailComponent,
  CartComponent,
  CustomStepperComponent,
} from '../components';
import { MarkdownPipe, SortPipe } from '../pipes';
import { LazyImgDirective } from '../directives';
import { SignupNlComponent } from '../components/signup-nl/signup-nl.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SideMenuComponent,
    MenuListComponent,
    CtaBtnComponent,
    FormComponent,
    InternalLinkComponent,
    QueryComponent,
    FeatureWithImg,
    ThreeFeaturesComponent,
    SubnavComponent,
    ColorsComponent,
    ColorZoomComponent,
    PricesComponent,
    SizesComponent,
    UsesComponent,
    SpecsComponent,
    SpecialPiecesComponent,
    CustomAccItemComponent,
    CustomStepperComponent,
    LangChangeComponent,
    GalleryComponent,
    ProductDetailComponent,
    CartComponent,
    SignupNlComponent,
    SortPipe,
    MarkdownPipe,
    DateFnsPipe,
    LazyImgDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SwiperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    // NgxMaskModule.forRoot(),
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SwiperModule,
    NgxMaskDirective,
    NgxMaskPipe,
    // NgxMaskModule,
    HeaderComponent,
    FooterComponent,
    SideMenuComponent,
    MenuListComponent,
    CtaBtnComponent,
    FormComponent,
    QueryComponent,
    InternalLinkComponent,
    FeatureWithImg,
    ThreeFeaturesComponent,
    SubnavComponent,
    ColorsComponent,
    ColorZoomComponent,
    PricesComponent,
    SizesComponent,
    UsesComponent,
    SpecsComponent,
    SpecialPiecesComponent,
    CustomAccItemComponent,
    CustomStepperComponent,
    LangChangeComponent,
    GalleryComponent,
    ProductDetailComponent,
    CartComponent,
    SignupNlComponent,
    SortPipe,
    DateFnsPipe,
    MarkdownPipe,
    LazyImgDirective,
  ],
  providers: [provideNgxMask()],
})
export class SharedModule {}
