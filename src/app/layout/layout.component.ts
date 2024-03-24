import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
firstLoad = false;

  constructor(private router: Router) {

  }

  ngOnInit(){
    if (sessionStorage.getItem('firstLoad') !== 'loaded') {
      this.router.navigateByUrl('login');
      
    }
  }
}
