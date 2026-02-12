import {Groupe} from "./Groupe";
import {Table} from "./Table";

export interface Classe { // Equivalent d'une interface Java "Eleve"
  eleves: Groupe;
  tables: Table[];
  id: number;
  nom: string;
}