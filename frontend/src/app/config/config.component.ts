import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-config",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./config.component.html",
  styleUrls: ["./config.component.css"],
})
export class ConfigComponent implements OnInit {
  userName = "";
  userEmail = "";
  userInitials = "";

  theme = "dark";
  language = "es";
  currency = "Q";

  notifyEmail = true;
  notifyPush = true;
  notifyWeekly = false;

  savedMessage = "";
  saveError = "";

  private settingsKey = "app_settings";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.nombre || "";
      this.userEmail = user.email || "";
      this.userInitials = this.userName.substring(0, 2).toUpperCase();
    }
    this.loadSettings();
  }

  private loadSettings(): void {
    try {
      const raw = localStorage.getItem(this.settingsKey);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.theme) this.theme = s.theme;
      if (s.language) this.language = s.language;
      if (s.currency) this.currency = s.currency;
      if (typeof s.notifyEmail === "boolean") this.notifyEmail = s.notifyEmail;
      if (typeof s.notifyPush === "boolean") this.notifyPush = s.notifyPush;
      if (typeof s.notifyWeekly === "boolean") this.notifyWeekly = s.notifyWeekly;
    } catch {
      this.persist();
    }
  }

  private persist(): void {
    localStorage.setItem(this.settingsKey, JSON.stringify({
      theme: this.theme,
      language: this.language,
      currency: this.currency,
      notifyEmail: this.notifyEmail,
      notifyPush: this.notifyPush,
      notifyWeekly: this.notifyWeekly,
    }));
  }

  saveProfile(): void {
    const name = this.userName.trim();
    const email = this.userEmail.trim();
    if (!name) {
      this.saveError = "El nombre no puede estar vacío.";
      this.showSaved("");
      setTimeout(() => (this.saveError = ""), 3000);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.saveError = "Ingresa un correo electrónico válido.";
      this.showSaved("");
      setTimeout(() => (this.saveError = ""), 3000);
      return;
    }
    this.userInitials = name.substring(0, 2).toUpperCase();
    this.authService.updateProfile(name, email);
    this.saveError = "";
    this.showSaved("Perfil actualizado correctamente");
  }

  savePreferences(): void {
    this.persist();
    this.saveError = "";
    this.showSaved("Preferencias guardadas");
  }

  saveNotifications(): void {
    this.persist();
    this.saveError = "";
    this.showSaved("Notificaciones actualizadas");
  }

  resetSettings(): void {
    this.theme = "dark";
    this.language = "es";
    this.currency = "Q";
    this.notifyEmail = true;
    this.notifyPush = true;
    this.notifyWeekly = false;
    this.persist();
    this.saveError = "";
    this.showSaved("Configuración restablecida");
  }

  private showSaved(msg: string): void {
    this.savedMessage = msg;
    if (msg) {
      setTimeout(() => {
        if (this.savedMessage === msg) this.savedMessage = "";
      }, 3000);
    }
  }
}