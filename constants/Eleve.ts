import {Remarque} from "./Remarque";

export interface Eleve { // Equivalent d'une interface Java "Eleve"
    id: number;
    nom: string;
    prenom: string;
    classe: string;
    remarques: Remarque[];
}