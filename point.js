import { Coordinate } from "./coordinate";

/**
 * Cette classe permet de stocker l'ensemble des données retournées par les trois capteurs au même endroit
 * Pour chaque "point", on aura 3 jeux de données: des valeurs pour l'accéleromètre, le gyroscope et le magnétomètre
 */
export class Point{
    constructor(){
        this.accelero = new Coordinate();
        this.gyro = new Coordinate();
        this.magneto = new Coordinate();
    }
}