import { Component, HostListener } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { FinanceService } from '../../../../../core/services/finance.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf, FormsModule],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.scss'],
})
export class Topbar {
  public notificationsOpen = false;
  public userMenuOpen = false;
  public pageTitle = 'Finance Dashboard';

  constructor(public finance: FinanceService, private router: Router) {
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe(() => {
      this.pageTitle = this.finance.getPageTitle(this.getCurrentPageFromUrl(this.router.url));
    });
  }

  private getCurrentPageFromUrl(url: string): string {
    const cleanedUrl = url.split(/[?#]/)[0];
    const segments = cleanedUrl.split('/').filter((segment) => segment.length > 0);
    return segments.pop() || 'dashboard';
  }

  changeDomain(value: string): void {
    this.finance.currentDomain = value;
    this.finance.saveToLocalStorage();
  }

  goToProfile(): void {
    this.router.navigate(['/profile']);
    this.userMenuOpen = false;
  }

  goToSettings(): void {
    this.router.navigate(['/settings']);
    this.userMenuOpen = false;
  }

  goToChangePassword(): void {
    this.router.navigate(['/change-password']);
    this.userMenuOpen = false;
  }

  logout(): void {
    this.router.navigate(['/dashboard']);
    this.finance.logout().subscribe();
    this.userMenuOpen = false;
  }

  toggleNotifications(event: Event): void {
    event.stopPropagation();
    this.notificationsOpen = !this.notificationsOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-profile')) {
      this.userMenuOpen = false;
    }
    if (!target.closest('.notification')) {
      this.notificationsOpen = false;
    }
  }
}

