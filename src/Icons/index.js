import Class from './class-unselected.png';
import ClassSelected from './class-selected.png';
import Battle from './battle-unselected.png';
import BattleSelected from './battle-selected.png';
import Lab from './lab-unselected.png';
import LabSelected from './lab-selected.png';
import Default from './unknown-unselected.png';
import DefaultSelected from './unknown-selected.png';

const trainImage = new Image(50, 50);
trainImage.src = Class;
const trainImageSelected = new Image(50, 50);
trainImageSelected.src = ClassSelected;

const battleImage = new Image(50, 50);
battleImage.src = Battle;
const battleImageSelected = new Image(50, 50);
battleImageSelected.src = BattleSelected;

const labImage = new Image(50, 50);
labImage.src = Lab;
const labImageSelected = new Image(50, 50);
labImageSelected.src = LabSelected;

const defaultImage = new Image(50, 50);
defaultImage.src = Default;
const defaultImageSelected = new Image(50, 50);
defaultImageSelected.src = DefaultSelected;

export {
    trainImage,
    trainImageSelected,
    battleImage,
    battleImageSelected,
    labImage,
    labImageSelected,
    defaultImage,
    defaultImageSelected,
};
