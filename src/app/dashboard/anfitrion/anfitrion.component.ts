import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { PartidaService } from '../../core/services/partida.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-anfitrion',
  imports: [CommonModule],
  templateUrl: './anfitrion.component.html',
  styleUrl: './anfitrion.component.css',
})
export class AnfitrionComponent implements OnInit, OnDestroy {
  partidaId: number = 0;
  partida: any;
  mazoRestante: number[] = [];
  cartasGritadas: number[] = [];
  cartaActual: number = 0;
  isLoading: boolean = false;
  errorMsg = '';

  pollingSubscription?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private partidaService: PartidaService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(+id)) {
      this.router.navigate(['/']);
      return;
    }
    this.partidaId = +id;
    this.cargarPartida();

    this.pollingSubscription = interval(3000).subscribe(() => {
      this.cargarPartida(false);
    });
  }

  ngOnDestroy() {
    this.pollingSubscription?.unsubscribe();
  }

  cargarPartida(showLoading: boolean = true) {
    if (showLoading) {
      this.isLoading = true;
    }

    this.partidaService.obtenerJuegoAnfitrion(this.partidaId).subscribe({
      next: (response) => {
        this.partida = response.partida;
        this.cartasGritadas = response.partida.cartasGritadas || [];
        this.cartaActual = response.partida.cartaActual ?? 0;

        this.mazoRestante = this.generarMazoRestante();
        this.isLoading = false;
        this.errorMsg = '';
      },
      error: (error) => {
        this.errorMsg = 'Error cargando la partida';
        this.isLoading = false;
      },
    });
  }

  generarMazoRestante(): number[] {
    const todasCartas = Array.from({ length: 52 }, (_, i) => i + 1);
    return todasCartas.filter(carta => !this.cartasGritadas.includes(carta));
  }

  sacarCarta() {
    if (!this.partida) return;

    if (this.mazoRestante.length === 0) {
      alert('No quedan cartas en el mazo');
      return;
    }

    this.partidaService.gritarCarta(this.partidaId).subscribe({
      next: (response) => {
        this.cartasGritadas.push(response.carta);
        this.mazoRestante = this.generarMazoRestante();
      },
      error: (error) => {
        console.error('Error al gritar carta:', error);
      },
    });
  }

  onImageError(event: any) {
  console.log('Error cargando imagen para carta:', this.cartaActual);
  event.target.src = '/cartas/default.png';
}
}