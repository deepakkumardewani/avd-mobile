import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioDetailPage } from './audio-detail.page';

describe('AudioDetailPage', () => {
  let component: AudioDetailPage;
  let fixture: ComponentFixture<AudioDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
