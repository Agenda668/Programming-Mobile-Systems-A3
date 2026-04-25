import { Routes } from '@angular/router';

export const tabsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./tabs.page').then((m) => m.TabsPage),
    children: [
      {
        path: 'list',
        loadComponent: () => import('../pages/list-page/list-page.page').then((m) => m.ListPagePage),
      },
      {
        path: 'add',
        loadComponent: () => import('../pages/add-page/add-page.page').then((m) => m.AddPagePage),
      },
      {
        path: 'edit',
        loadComponent: () => import('../pages/edit-page/edit-page.page').then((m) => m.EditPagePage),
      },
      {
        path: 'privacy',
        loadComponent: () => import('../pages/privacy-page/privacy-page.page').then((m) => m.PrivacyPagePage),
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];
