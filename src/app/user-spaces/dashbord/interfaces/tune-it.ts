export interface TuneIt<T> {
  idProduit: Array<T>;
}

export interface TuneItVlaue {
  itemPropery: {
    edit_spelling: string;
    synonymize: string;
    edit_synonyms: string;
    schematic_scope: string;
  };
}
// idProject: array<
//   itemPropery: {
//     edit_spelling: string;
//     synonymize: string;
//     edit_synonyms: string;
//     schematic_scope: string;
//   }
// >

// // Tableau contenue info item
// [
//   // valuer Id produit: valuer id produit
//   idProdui: {
//     //Nom item selectionner; Soit "ITEM TYPE" soit "PROPERY VALUE"
//     nomItem : {
//         edit_spelling: 'value' | vide
//         synonymize: 'value' | vide
//         edit_synonyms: 'value' | vide
//         schematic_scope: 'value' | vide
//     }
//   }
// ]
