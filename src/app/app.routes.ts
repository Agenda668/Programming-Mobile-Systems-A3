import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'tabs/list',
    pathMatch: 'full',
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs/tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./pages/inventory-list/list-page.page').then((m) => m.ListPagePage),
      },
      {
        path: 'add',
        loadComponent: () => import('./pages/add-featured/add-page.page').then((m) => m.AddPagePage),
      },
      {
        path: 'edit',
        loadComponent: () => import('./pages/edit-delete/edit-page.page').then((m) => m.EditPagePage),
      },
      {
        path: 'privacy',
        loadComponent: () => import('./pages/privacy-security/privacy-page.page').then((m) => m.PrivacyPagePage),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];
