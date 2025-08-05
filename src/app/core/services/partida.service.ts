import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearPartidaRequest,
  CrearPartidaResponse,
  Partida,
  PartidaAnfitrionResponse,
  PartidaAnfitrion,
  EstadoPartidaResponse,
  GritarCartaResponse,
  ResponseListaPartidas,
  unirsePartidaResponse,
  cartaResponse,
  colocarFichaResponse,
  colocarFichaRequest,
} from '../../core/types/partida';

@Injectable({
  providedIn: 'root',
})
export class PartidaService {
  private apiUrl = environment.apiUrl;
  private partidasUrl = `${this.apiUrl}/partidas`;

  constructor(private http: HttpClient) {}

  crearPartida(data: CrearPartidaRequest): Observable<CrearPartidaResponse> {
    return this.http.post<CrearPartidaResponse>(`${this.partidasUrl}`, data);
  }

  obtenerPartidas(): Observable<ResponseListaPartidas> {
    return this.http
      .get<ResponseListaPartidas>(`${this.apiUrl}/partidas`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener lista de partidas:', error);
          return throwError(() => error);
        })
      );
  }

  obtenerPartida(partidaId: number): Observable<PartidaAnfitrionResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }

    return this.http
      .get<PartidaAnfitrionResponse>(
        `${this.apiUrl}/partida/anfitrion/${partidaId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener partida:', error);
          return throwError(() => error);
        })
      );
  }

  obtenerPartidaJugador(partidaId: number): Observable<PartidaAnfitrionResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }
    return this.http
      .get<PartidaAnfitrionResponse>(
        `${this.apiUrl}/partida/jugador/${partidaId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener partida:', error);
          return throwError(() => error);
        })
      );
  }

  obtenerJuegoAnfitrion(partidaId: number): Observable<PartidaAnfitrionResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }
    return this.http
      .get<PartidaAnfitrionResponse>(
        `${this.apiUrl}/juego/anfitrion/${partidaId}`
      )
      .pipe(
        catchError((error) => {
          console.error('Error al obtener juego de la partida:', error);
          return throwError(() => error);
        })
      );
  }

  verificarEstado(partidaId: number): Observable<EstadoPartidaResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }

    return this.http
      .get<EstadoPartidaResponse>(`${this.apiUrl}/partida/verificar-estado/${partidaId}`)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener estado de la partida:', error);
          return throwError(() => error);
        })
      );
  }

  gritarCarta(partidaId: number): Observable<GritarCartaResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }

    return this.http
      .post<GritarCartaResponse>(`${this.apiUrl}/gritar-carta/${partidaId}`, {})
      .pipe(
        catchError((error) => {
          console.error('Error al gritar carta:', error);
          return throwError(() => error);
        })
      );
  }
  unirsePartida(partidaId: number): Observable<unirsePartidaResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }

    return this.http
      .post<unirsePartidaResponse>(`${this.apiUrl}/partidas/${partidaId}/unirse`, {})
      .pipe(
        catchError((error) => {
          console.error('Error al unirse a la partida:', error);
          return throwError(() => error);
        })
      );
  }

  cargarCarta(partidaId: number, carta: number[]): Observable<cartaResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }

    return this.http
      .get<cartaResponse>(`${this.apiUrl}/juego/${partidaId}/carta`)
      .pipe(
        catchError((error) => {
          console.error('Error al cargar carta:', error);
          return throwError(() => error);
        })
      );
  }

  colocarFicha(partidaId: number, posicion: number): Observable<colocarFichaResponse> {
    if (!partidaId || isNaN(partidaId)) {
      return throwError(() => new Error('ID de partida inválido'));
    }

    return this.http
      .post<colocarFichaResponse>(`${this.apiUrl}/juego/${partidaId}/ficha`, { posicion })
      .pipe(
        catchError((error) => {
          console.error('Error al colocar ficha:', error);
          return throwError(() => error);
        })
      );
  }
}
