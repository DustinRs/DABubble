import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilefriendComponent } from './profilefriend.component';

describe('ProfilefriendComponent', () => {
  let component: ProfilefriendComponent;
  let fixture: ComponentFixture<ProfilefriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilefriendComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfilefriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
