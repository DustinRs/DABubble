import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelPeopleComponent } from './channel-people.component';

describe('ChannelPeopleComponent', () => {
  let component: ChannelPeopleComponent;
  let fixture: ComponentFixture<ChannelPeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChannelPeopleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChannelPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
