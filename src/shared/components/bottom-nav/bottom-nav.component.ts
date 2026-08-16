import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.scss',
})
export class BottomNavComponent {
  private router = inject(Router);

  readonly items = [
    {
      label: 'Home',
      icon: '⌂',
      route: '/subjects',
    },
    {
      label: 'Bookmarks',
      icon: '★',
      route: '/bookmarks',
    },
    {
      label: 'Statistics',
      icon: '▥',
      route: '/statistics',
    },
    {
      label: 'Settings',
      icon: '⚙',
      route: '/settings',
    },
  ];

  get visible(): boolean {
    const url = this.router.url.split('?')[0];

    return (
      url === '/subjects' ||
      url === '/bookmarks' ||
      url === '/statistics' ||
      url === '/settings'
    );
  }
}
