import { MeshStandardMaterial, MeshBasicMaterial } from 'three';

const black = new MeshStandardMaterial({ color: 'black', metalness: 1 });
const lightBlue = new MeshBasicMaterial({ color: 'lightblue' });
const white = new MeshBasicMaterial({ color: 'white' });
const teal = new MeshBasicMaterial({ color: 'teal' });

const shipMaterial = {
  'Renault_(S,_T1)_0': black,
  'Renault_(S,_T1)_1': black,
  'Renault_(S,_T1)_2': black,
  'Renault_(S,_T1)_3': lightBlue,
  'Renault_(S,_T1)_4': white,
  'Renault_(S,_T1)_5': teal,
};

export default shipMaterial;
