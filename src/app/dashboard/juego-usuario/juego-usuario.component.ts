import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartidaService } from '../../core/services/partida.service';
import { CommonModule } from '@angular/common';
import { CartaComponent } from '../components/carta/carta.component';

@Component({
  selector: 'app-juego-usuario',
  imports: [CommonModule, CartaComponent],
  templateUrl: './juego-usuario.component.html',
  styleUrl: './juego-usuario.component.css',
})
export class JuegoUsuarioComponent implements OnInit {
  partidaId!: number;
  carta: number[] = [];
  posicionesMarcadas: number[] = [];
  maxFichas: number = 16;
  esGanador: boolean = false;
  mensajeResultado: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private partidaService: PartidaService
  ) {}

  ngOnInit(): void {
    const partidaId = this.route.snapshot.params['id'];
    this.partidaId = +partidaId;
    this.cargarCarta();
  }

  cargarCarta(): void {
    this.partidaService.cargarCarta(this.partidaId, this.carta).subscribe({
      next: (response) => {
        this.carta = response.cartas;
        this.posicionesMarcadas = response.posiciones;
      },
      error: (error) => {
        console.error('Error al cargar la carta:', error);
      },
    });
  }

  colocarFicha(posicion: number): void {
    if (this.posicionesMarcadas.includes(posicion)) return;

    if (this.posicionesMarcadas.length >= this.maxFichas) return;

    this.partidaService.colocarFicha(this.partidaId, posicion).subscribe({
      next: (response) => {
        this.posicionesMarcadas.push(posicion);

        if (this.posicionesMarcadas.length === this.maxFichas) {
          this.validarCarta();
        }
      },
      error: (error) => {
        console.error('Error al colocar ficha:', error);
      },
    });
  }

  validarCarta(): void {
    this.partidaService.validarCarta(this.partidaId).subscribe({
      next: (response) => {
        if (response.ganador) {
          this.esGanador = true;
          this.mensajeResultado = '¡Felicidades! ¡Has ganado!';
          console.log('¡Ganador!');
        } else {
          this.esGanador = false;
          this.mensajeResultado = 'No hay línea ganadora. ¡Intenta de nuevo!';
        }
      },
      error: (error) => {
        console.error('Error al validar carta:', error);
        this.mensajeResultado = 'Error al validar la carta';
      },
    });
  }

  estaMarcada(posicion: number): boolean {
    return this.posicionesMarcadas.includes(posicion);
  }
}
