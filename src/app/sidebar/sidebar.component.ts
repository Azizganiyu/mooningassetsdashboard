import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
    { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',       class: '' },
    { path: '/user',          title: 'User Profile',      icon:'nc-single-02',  class: '' },
    { path: '/fund',         title: 'Funds',             icon:'nc-credit-card',    class: '' },
    { path: '/notifications', title: 'Notifications',     icon:'nc-chat-33',    class: '' },
    { path: '/cash-out',         title: 'Request Cash Out',        icon:'nc-money-coins',    class: '' },
    { path: '/settings',         title: 'Settings',        icon:'nc-settings-gear-65',    class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
