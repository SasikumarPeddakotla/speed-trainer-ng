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
      icon: 'ph-duotone ph-house',
      activeIcon: 'ph-fill ph-house',
      route: '/subjects',
    },
    {
      label: 'Bookmarks',
      icon: 'ph-duotone ph-bookmark-simple',
      activeIcon: 'ph-fill ph-bookmark-simple',
      route: '/bookmarks',
    },
    {
      label: 'Statistics',
      icon: 'ph-duotone ph-chart-bar',
      activeIcon: 'ph-fill ph-chart-bar',
      route: '/statistics',
    },
    {
      label: 'Settings',
      icon: 'ph ph-gear',
      activeIcon: 'ph-fill ph-gear',
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
