import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DarshanGalleryPage } from './darshan-gallery.page';

describe('DarshanGalleryPage', () => {
  let component: DarshanGalleryPage;
  let fixture: ComponentFixture<DarshanGalleryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DarshanGalleryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DarshanGalleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
