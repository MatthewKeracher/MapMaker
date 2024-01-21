// Import the necessary module
import Edit from "./edit.js";
import Array from "./array.js";
import Ref from "./ref.js";
import Items from "./items.js";
import Monsters from "./monsters.js";
import Spells from "./spells.js";
import Events from "./events.js";
import Storyteller from "./storyteller.js";
import NPCs from "./npcs.js";

// classes.js

class NPCbuild {

abilityScoreTable = [
{ range: { min: 3, max: 3 }, bonus: -3 },
{ range: { min: 4, max: 5 }, bonus: -2 },
{ range: { min: 6, max: 8 }, bonus: -1 },
{ range: { min: 9, max: 12 }, bonus: 0 },
{ range: { min: 13, max: 15 }, bonus: 1 },
{ range: { min: 16, max: 17 }, bonus: 2 },
{ range: { min: 18, max: 18 }, bonus: 3 },
// Add more ranges as needed
];


//Magic User
magicUserTable = [
{ level: 1, exp: 0, hitDice: '1d4', spells: [1, 0, 0, 0, 0, 0], attackBonus: 1},
{ level: 2, exp: 2500, hitDice: '2d4', spells: [2, 0, 0, 0, 0, 0], attackBonus: 1},
{ level: 3, exp: 5000, hitDice: '3d4', spells: [2, 1, 0, 0, 0, 0], attackBonus: 1},
{ level: 4, exp: 10000, hitDice: '4d4', spells: [2, 2, 0, 0, 0, 0], attackBonus: 2},
{ level: 5, exp: 20000, hitDice: '5d4', spells: [2, 2, 1, 0, 0, 0], attackBonus: 2},
{ level: 6, exp: 40000, hitDice: '6d4', spells: [3, 2, 2, 0, 0, 0], attackBonus: 3},
{ level: 7, exp: 80000, hitDice: '7d4', spells: [3, 2, 2, 1, 0, 0], attackBonus: 3},
{ level: 8, exp: 150000, hitDice: '8d4', spells: [3, 3, 2, 2, 0, 0], attackBonus: 3},
{ level: 9, exp: 300000, hitDice: '9d4', spells: [3, 3, 2, 2, 1, 0], attackBonus: 4},
{ level: 10, exp: 450000, hitDice: '9d4+1', spells: [4, 3, 3, 2, 2, 0], attackBonus: 4},
{ level: 11, exp: 600000, hitDice: '9d4+2', spells: [4, 4, 3, 2, 2, 1], attackBonus: 4},
{ level: 12, exp: 750000, hitDice: '9d4+3', spells: [4, 4, 3, 3, 2, 2], attackBonus: 4},
{ level: 13, exp: 900000, hitDice: '9d4+4', spells: [4, 4, 4, 3, 2, 2], attackBonus: 5},
{ level: 14, exp: 1050000, hitDice: '9d4+5', spells: [4, 4, 4, 3, 3, 2], attackBonus: 5},
{ level: 15, exp: 1200000, hitDice: '9d4+6', spells: [5, 4, 4, 3, 3, 2], attackBonus: 5},
{ level: 16, exp: 1350000, hitDice: '9d4+7', spells: [5, 5, 4, 3, 3, 2], attackBonus: 6},
{ level: 17, exp: 1500000, hitDice: '9d4+8', spells: [5, 5, 4, 4, 3, 3], attackBonus: 6},
{ level: 18, exp: 1650000, hitDice: '9d4+9', spells: [6, 5, 4, 4, 3, 3], attackBonus: 6},
{ level: 19, exp: 1800000, hitDice: '9d4+10', spells: [6, 5, 5, 4, 3, 3], attackBonus: 7},
{ level: 20, exp: 1950000, hitDice: '9d4+11', spells: [6, 5, 5, 4, 4, 3], attackBonus: 7},
];

// Magic-User Saving Throws
magicUserSavingThrowTable = [
  { level: 1, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 16, spells: 15 },
  { level: 2, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
  { level: 3, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
  { level: 4, deathRay: 12, magicWands: 13, paralysisPetrify: 12, dragonBreath: 15, spells: 13 },
  { level: 5, deathRay: 12, magicWands: 12, paralysisPetrify: 11, dragonBreath: 14, spells: 13 },
  { level: 6, deathRay: 11, magicWands: 11, paralysisPetrify: 10, dragonBreath: 14, spells: 12 },
  { level: 7, deathRay: 11, magicWands: 11, paralysisPetrify: 10, dragonBreath: 13, spells: 12 },
  { level: 8, deathRay: 10, magicWands: 10, paralysisPetrify: 9, dragonBreath: 13, spells: 11 },
  { level: 9, deathRay: 10, magicWands: 9, paralysisPetrify: 9, dragonBreath: 13, spells: 11 },
  { level: 10, deathRay: 9, magicWands: 9, paralysisPetrify: 8, dragonBreath: 12, spells: 10 },
  { level: 11, deathRay: 9, magicWands: 8, paralysisPetrify: 7, dragonBreath: 12, spells: 11 },
  { level: 12, deathRay: 8, magicWands: 7, paralysisPetrify: 6, dragonBreath: 11, spells: 11 },
  { level: 13, deathRay: 8, magicWands: 7, paralysisPetrify: 6, dragonBreath: 11, spells: 10 },
  { level: 14, deathRay: 7, magicWands: 6, paralysisPetrify: 5, dragonBreath: 10, spells: 10 },
  { level: 15, deathRay: 7, magicWands: 6, paralysisPetrify: 5, dragonBreath: 10, spells: 9 },
  { level: 16, deathRay: 6, magicWands: 5, paralysisPetrify: 4, dragonBreath: 9, spells: 9 },
  { level: 17, deathRay: 6, magicWands: 5, paralysisPetrify: 4, dragonBreath: 9, spells: 8 },
  { level: 18, deathRay: 5, magicWands: 4, paralysisPetrify: 3, dragonBreath: 8, spells: 8 },
  { level: 19, deathRay: 5, magicWands: 4, paralysisPetrify: 3, dragonBreath: 8, spells: 7 },
  { level: 20, deathRay: 4, magicWands: 3, paralysisPetrify: 2, dragonBreath: 7, spells: 6 },
  // Add more levels as needed
];


//Thief General
thiefTable = [
{ level: 1, exp: 0, hitDice: '1d4' , attackBonus: 1, attackBonus: 1},
{ level: 2, exp: 1250, hitDice: '2d4' , attackBonus: 1},
{ level: 3, exp: 2500, hitDice: '3d4' , attackBonus: 2},
{ level: 4, exp: 5000, hitDice: '4d4' , attackBonus: 2},
{ level: 5, exp: 10000, hitDice: '5d4' , attackBonus: 3},
{ level: 6, exp: 20000, hitDice: '6d4' , attackBonus: 3},
{ level: 7, exp: 40000, hitDice: '7d4' , attackBonus: 4},
{ level: 8, exp: 75000, hitDice: '8d4' , attackBonus: 4},
{ level: 9, exp: 150000, hitDice: '9d4' , attackBonus: 5},
{ level: 10, exp: 225000, hitDice: '9d4+2' , attackBonus: 5},
{ level: 11, exp: 300000, hitDice: '9d4+4' , attackBonus: 5},
{ level: 12, exp: 375000, hitDice: '9d4+6' , attackBonus: 6},
{ level: 13, exp: 450000, hitDice: '9d4+8' , attackBonus: 6},
{ level: 14, exp: 525000, hitDice: '9d4+10' , attackBonus: 6},
{ level: 15, exp: 600000, hitDice: '9d4+12' , attackBonus: 7},
{ level: 16, exp: 675000, hitDice: '9d4+14' , attackBonus: 7},
{ level: 17, exp: 750000, hitDice: '9d4+16' , attackBonus: 7},
{ level: 18, exp: 825000, hitDice: '9d4+18' , attackBonus: 8},
{ level: 19, exp: 900000, hitDice: '9d4+20' , attackBonus: 8},
{ level: 20, exp: 975000, hitDice: '9d4+22' , attackBonus: 8},
];

//Thief Skills Table
thiefSkillsTable = [
{ level: 1, openLocks: 25, removeTraps: 20, pickPockets: 30, moveSilently: 25, climbWalls: 80, hide: 10, listen: 30 },
{ level: 2, openLocks: 30, removeTraps: 25, pickPockets: 35, moveSilently: 30, climbWalls: 81, hide: 15, listen: 34 },
{ level: 3, openLocks: 35, removeTraps: 30, pickPockets: 40, moveSilently: 35, climbWalls: 82, hide: 20, listen: 38 },
{ level: 4, openLocks: 40, removeTraps: 35, pickPockets: 45, moveSilently: 40, climbWalls: 83, hide: 25, listen: 42 },
{ level: 5, openLocks: 45, removeTraps: 40, pickPockets: 50, moveSilently: 45, climbWalls: 84, hide: 30, listen: 46 },
{ level: 6, openLocks: 50, removeTraps: 45, pickPockets: 55, moveSilently: 50, climbWalls: 85, hide: 35, listen: 50 },
{ level: 7, openLocks: 55, removeTraps: 50, pickPockets: 60, moveSilently: 55, climbWalls: 86, hide: 40, listen: 54 },
{ level: 8, openLocks: 60, removeTraps: 55, pickPockets: 65, moveSilently: 60, climbWalls: 87, hide: 45, listen: 58 },
{ level: 9, openLocks: 65, removeTraps: 60, pickPockets: 70, moveSilently: 65, climbWalls: 88, hide: 50, listen: 62 },
{ level: 10, openLocks: 68, removeTraps: 63, pickPockets: 74, moveSilently: 68, climbWalls: 89, hide: 53, listen: 65 },
{ level: 11, openLocks: 71, removeTraps: 66, pickPockets: 78, moveSilently: 71, climbWalls: 90, hide: 56, listen: 68 },
{ level: 12, openLocks: 74, removeTraps: 69, pickPockets: 82, moveSilently: 74, climbWalls: 91, hide: 59, listen: 71 },
{ level: 13, openLocks: 77, removeTraps: 72, pickPockets: 86, moveSilently: 77, climbWalls: 92, hide: 62, listen: 74 },
{ level: 14, openLocks: 80, removeTraps: 75, pickPockets: 90, moveSilently: 80, climbWalls: 93, hide: 65, listen: 77 },
{ level: 15, openLocks: 83, removeTraps: 78, pickPockets: 94, moveSilently: 83, climbWalls: 94, hide: 68, listen: 80 },
{ level: 16, openLocks: 84, removeTraps: 79, pickPockets: 95, moveSilently: 85, climbWalls: 95, hide: 69, listen: 83 },
{ level: 17, openLocks: 85, removeTraps: 80, pickPockets: 96, moveSilently: 87, climbWalls: 96, hide: 70, listen: 86 },
{ level: 18, openLocks: 86, removeTraps: 81, pickPockets: 97, moveSilently: 89, climbWalls: 97, hide: 71, listen: 89 },
{ level: 19, openLocks: 87, removeTraps: 82, pickPockets: 98, moveSilently: 91, climbWalls: 98, hide: 72, listen: 92 },
{ level: 20, openLocks: 88, removeTraps: 83, pickPockets: 99, moveSilently: 93, climbWalls: 99, hide: 73, listen: 95 },
];

// Thief Saving Throw Progression
thiefSavingThrowTable = [
  { level: 1, deathRay: 13, magicWands: 14, paralysisPetrify: 13, dragonBreath: 16, spells: 15 },
  { level: 2, deathRay: 12, magicWands: 14, paralysisPetrify: 12, dragonBreath: 15, spells: 14 },
  { level: 3, deathRay: 12, magicWands: 14, paralysisPetrify: 12, dragonBreath: 15, spells: 14 },
  { level: 4, deathRay: 11, magicWands: 13, paralysisPetrify: 12, dragonBreath: 14, spells: 13 },
  { level: 5, deathRay: 11, magicWands: 13, paralysisPetrify: 11, dragonBreath: 13, spells: 13 },
  { level: 6, deathRay: 10, magicWands: 12, paralysisPetrify: 11, dragonBreath: 12, spells: 12 },
  { level: 7, deathRay: 10, magicWands: 12, paralysisPetrify: 11, dragonBreath: 12, spells: 12 },
  { level: 8, deathRay: 9, magicWands: 12, paralysisPetrify: 10, dragonBreath: 11, spells: 11 },
  { level: 9, deathRay: 9, magicWands: 10, paralysisPetrify: 10, dragonBreath: 10, spells: 11 },
  { level: 10, deathRay: 8, magicWands: 10, paralysisPetrify: 9, dragonBreath: 9, spells: 10 },
  { level: 11, deathRay: 7, magicWands: 9, paralysisPetrify: 9, dragonBreath: 8, spells: 9 },
  { level: 12, deathRay: 7, magicWands: 9, paralysisPetrify: 8, dragonBreath: 7, spells: 9 },
  { level: 13, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 14, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 15, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 16, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 17, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 18, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 19, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
  { level: 20, deathRay: 6, magicWands: 8, paralysisPetrify: 8, dragonBreath: 6, spells: 8 },
];


//Fighter
fighterTable = [
{ level: 1, expPoints: 0, hitDice: '1d8' , attackBonus: 1},
{ level: 2, expPoints: 2000, hitDice: '2d8' , attackBonus: 2},
{ level: 3, expPoints: 4000, hitDice: '3d8' , attackBonus: 2},
{ level: 4, expPoints: 8000, hitDice: '4d8' , attackBonus: 3},
{ level: 5, expPoints: 16000, hitDice: '5d8' , attackBonus: 4},
{ level: 6, expPoints: 32000, hitDice: '6d8' , attackBonus: 4},
{ level: 7, expPoints: 64000, hitDice: '7d8' , attackBonus: 5},
{ level: 8, expPoints: 120000, hitDice: '8d8' , attackBonus: 6},
{ level: 9, expPoints: 240000, hitDice: '9d8' , attackBonus: 6},
{ level: 10, expPoints: 360000, hitDice: '9d8+2' , attackBonus: 6},
{ level: 11, expPoints: 480000, hitDice: '9d8+4' , attackBonus: 7},
{ level: 12, expPoints: 600000, hitDice: '9d8+6' , attackBonus: 7},
{ level: 13, expPoints: 720000, hitDice: '9d8+8' , attackBonus: 8},
{ level: 14, expPoints: 840000, hitDice: '9d8+10' , attackBonus: 8},
{ level: 15, expPoints: 960000, hitDice: '9d8+12' , attackBonus: 8},
{ level: 16, expPoints: 1080000, hitDice: '9d8+14' , attackBonus: 9},
{ level: 17, expPoints: 1200000, hitDice: '9d8+16' , attackBonus: 9},
{ level: 18, expPoints: 1320000, hitDice: '9d8+18' , attackBonus: 10},
{ level: 19, expPoints: 1440000, hitDice: '9d8+20' , attackBonus: 10},
{ level: 20, expPoints: 1560000, hitDice: '9d8+22' , attackBonus: 10},
];

// Fighter Saving Throw Progression
fighterSavingThrowTable = [
  { level: 0, deathRay: 13, magicWands: 14, paralysisPetrify: 15, dragonBreath: 16, spells: 18 },
  { level: 1, deathRay: 12, magicWands: 13, paralysisPetrify: 14, dragonBreath: 15, spells: 17 },
  { level: 2, deathRay: 11, magicWands: 12, paralysisPetrify: 14, dragonBreath: 15, spells: 16 },
  { level: 3, deathRay: 11, magicWands: 11, paralysisPetrify: 13, dragonBreath: 14, spells: 15 },
  { level: 4, deathRay: 10, magicWands: 11, paralysisPetrify: 12, dragonBreath: 14, spells: 15 },
  { level: 5, deathRay: 10, magicWands: 10, paralysisPetrify: 11, dragonBreath: 13, spells: 14 },
  { level: 6, deathRay: 9, magicWands: 9, paralysisPetrify: 10, dragonBreath: 12, spells: 14 },
  { level: 7, deathRay: 9, magicWands: 9, paralysisPetrify: 10, dragonBreath: 12, spells: 14 },
  { level: 8, deathRay: 8, magicWands: 8, paralysisPetrify: 9, dragonBreath: 13, spells: 13 },
  { level: 9, deathRay: 8, magicWands: 8, paralysisPetrify: 9, dragonBreath: 13, spells: 13 },
  { level: 10, deathRay: 7, magicWands: 7, paralysisPetrify: 8, dragonBreath: 12, spells: 12 },
  { level: 11, deathRay: 7, magicWands: 7, paralysisPetrify: 8, dragonBreath: 12, spells: 12 },
  { level: 12, deathRay: 6, magicWands: 6, paralysisPetrify: 7, dragonBreath: 11, spells: 11 },
  { level: 13, deathRay: 6, magicWands: 6, paralysisPetrify: 7, dragonBreath: 11, spells: 11 },
  { level: 14, deathRay: 5, magicWands: 5, paralysisPetrify: 6, dragonBreath: 10, spells: 10 },
  { level: 15, deathRay: 5, magicWands: 5, paralysisPetrify: 6, dragonBreath: 10, spells: 10 },
  { level: 16, deathRay: 4, magicWands: 4, paralysisPetrify: 5, dragonBreath: 9, spells: 9 },
  { level: 17, deathRay: 4, magicWands: 4, paralysisPetrify: 5, dragonBreath: 9, spells: 9 },
  { level: 18, deathRay: 3, magicWands: 3, paralysisPetrify: 4, dragonBreath: 8, spells: 8 },
  { level: 19, deathRay: 3, magicWands: 3, paralysisPetrify: 4, dragonBreath: 8, spells: 8 },
  { level: 20, deathRay: 2, magicWands: 2, paralysisPetrify: 3, dragonBreath: 7, spells: 7 },
  // Add more levels as needed
];


//Cleric
clericTable = [
{ level: 1, expPoints: 0, hitDice: '1d6', spells: [0, 0, 0, 0, 0, 0] , attackBonus: 1},
{ level: 2, expPoints: 1500, hitDice: '2d6', spells: [1, 0, 0, 0, 0, 0] , attackBonus: 1},
{ level: 3, expPoints: 3000, hitDice: '3d6', spells: [2, 0, 0, 0, 0, 0] , attackBonus: 2},
{ level: 4, expPoints: 6000, hitDice: '4d6', spells: [2, 1, 0, 0, 0, 0] , attackBonus: 2},
{ level: 5, expPoints: 12000, hitDice: '5d6', spells: [2, 2, 0, 0, 0, 0] , attackBonus: 3},
{ level: 6, expPoints: 24000, hitDice: '6d6', spells: [2, 2, 1, 0, 0, 0] , attackBonus: 3},
{ level: 7, expPoints: 48000, hitDice: '7d6', spells: [3, 2, 2, 0, 0, 0] , attackBonus: 4},
{ level: 8, expPoints: 90000, hitDice: '8d6', spells: [3, 2, 2, 1, 0, 0] , attackBonus: 4},
{ level: 9, expPoints: 180000, hitDice: '9d6', spells: [3, 3, 2, 2, 0, 0] , attackBonus: 5},
{ level: 10, expPoints: 270000, hitDice: '9d6+1', spells: [3, 3, 2, 2, 1, 0] , attackBonus: 5},
{ level: 11, expPoints: 360000, hitDice: '9d6+2', spells: [4, 3, 3, 2, 2, 0] , attackBonus: 5},
{ level: 12, expPoints: 450000, hitDice: '9d6+3', spells: [4, 4, 3, 2, 2, 1] , attackBonus: 6},
{ level: 13, expPoints: 540000, hitDice: '9d6+4', spells: [4, 4, 3, 3, 2, 2] , attackBonus: 6},
{ level: 14, expPoints: 630000, hitDice: '9d6+5', spells: [4, 4, 4, 3, 2, 2] , attackBonus: 6},
{ level: 15, expPoints: 720000, hitDice: '9d6+6', spells: [4, 4, 4, 3, 3, 2] , attackBonus: 7},
{ level: 16, expPoints: 810000, hitDice: '9d6+7', spells: [5, 4, 4, 3, 3, 2] , attackBonus: 7},
{ level: 17, expPoints: 900000, hitDice: '9d6+8', spells: [5, 5, 4, 3, 3, 2] , attackBonus: 7},
{ level: 18, expPoints: 990000, hitDice: '9d6+9', spells: [5, 5, 4, 4, 3, 3] , attackBonus: 8},
{ level: 19, expPoints: 1080000, hitDice: '9d6+10', spells: [6, 5, 4, 4, 3, 3] , attackBonus: 8},
{ level: 20, expPoints: 1170000, hitDice: '9d6+11', spells: [6, 5, 5, 4, 3, 3] , attackBonus: 8},
];

//Cleric Turn Undead
clericsVsUndeadTable = [
{ level: 1, Skeleton: 13, Zombie: 17, Ghoul: 19, Wight: 'No', Wraith: 'No', Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 2, Skeleton: 11, Zombie: 15, Ghoul: 18, Wight: 20, Wraith: 'No', Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 3, Skeleton: 9, Zombie: 13, Ghoul: 17, Wight: 19, Wraith: 'No', Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 4, Skeleton: 7, Zombie: 11, Ghoul: 15, Wight: 18, Wraith: 20, Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 5, Skeleton: 5, Zombie: 9, Ghoul: 13, Wight: 17, Wraith: 19, Mummy: 'No', Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 6, Skeleton: 3, Zombie: 7, Ghoul: 11, Wight: 15, Wraith: 18, Mummy: 20, Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 7, Skeleton: 2, Zombie: 5, Ghoul: 9, Wight: 13, Wraith: 17, Mummy: 19, Spectre: 'No', Vampire: 'No', Ghost: 'No' },
{ level: 8, Skeleton: 'Automatic', Zombie: 3, Ghoul: 7, Wight: 11, Wraith: 15, Mummy: 18, Spectre: 20, Vampire: 'No', Ghost: 'No' },
{ level: 9, Skeleton: 'Automatic', Zombie: 2, Ghoul: 5, Wight: 9, Wraith: 13, Mummy: 17, Spectre: 19, Vampire: 'No', Ghost: 'No' },
{ level: 10, Skeleton: 'Automatic', Zombie: 'Automatic', Ghoul: 3, Wight: 7, Wraith: 11, Mummy: 15, Spectre: 18, Vampire: 20, Ghost: 'No' },
{ level: 11, Skeleton: 'Damaged', Zombie: 'Automatic', Ghoul: 2, Wight: 5, Wraith: 9, Mummy: 13, Spectre: 17, Vampire: 19, Ghost: 'No' },
{ level: 12, Skeleton: 'Damaged', Zombie: 'Automatic', Ghoul: 'Automatic', Wight: 3, Wraith: 7, Mummy: 11, Spectre: 15, Vampire: 18, Ghost: 20 },
{ level: 13, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Automatic', Wight: 2, Wraith: 5, Mummy: 9, Spectre: 13, Vampire: 17, Ghost: 19 },
{ level: 14, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Automatic', Wight: 'Automatic', Wraith: 3, Mummy: 7, Spectre: 11, Vampire: 15, Ghost: 18 },
{ level: 15, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Automatic', Wraith: 2, Mummy: 5, Spectre: 9, Vampire: 13, Ghost: 17 },
{ level: 16, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Automatic', Wraith: 'Automatic', Mummy: 3, Spectre: 7, Vampire: 11, Ghost: 15 },
{ level: 17, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Automatic', Mummy: 2, Spectre: 5, Vampire: 9, Ghost: 13 },
{ level: 18, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Automatic', Mummy: 'Automatic', Spectre: 3, Vampire: 7, Ghost: 11 },
{ level: 19, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Damaged', Mummy: 'Automatic', Spectre: 2, Vampire: 5, Ghost: 9 },
{ level: 20, Skeleton: 'Damaged', Zombie: 'Damaged', Ghoul: 'Damaged', Wight: 'Damaged', Wraith: 'Damaged', Mummy: 'Automatic', Spectre: 'Automatic', Vampire: 3, Ghost: 7 },
];

//Cleric Saving Throwns
clericSavingThrowTable = [
  { level: 1, deathRay: 11, magicWands: 12, paralysisPetrify: 14, dragonBreath: 16, spells: 15 },
  { level: 2, deathRay: 10, magicWands: 11, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
  { level: 3, deathRay: 9, magicWands: 10, paralysisPetrify: 13, dragonBreath: 15, spells: 14 },
  { level: 4, deathRay: 9, magicWands: 10, paralysisPetrify: 12, dragonBreath: 14, spells: 13 },
  { level: 5, deathRay: 8, magicWands: 9, paralysisPetrify: 12, dragonBreath: 14, spells: 13 },
  { level: 6, deathRay: 8, magicWands: 9, paralysisPetrify: 11, dragonBreath: 13, spells: 12 },
  { level: 7, deathRay: 7, magicWands: 8, paralysisPetrify: 11, dragonBreath: 13, spells: 12 },
  { level: 8, deathRay: 7, magicWands: 8, paralysisPetrify: 10, dragonBreath: 12, spells: 11 },
  { level: 9, deathRay: 6, magicWands: 7, paralysisPetrify: 10, dragonBreath: 12, spells: 11 },
  { level: 10, deathRay: 6, magicWands: 7, paralysisPetrify: 9, dragonBreath: 11, spells: 10 },
  { level: 11, deathRay: 5, magicWands: 6, paralysisPetrify: 9, dragonBreath: 11, spells: 10 },
  { level: 12, deathRay: 5, magicWands: 6, paralysisPetrify: 8, dragonBreath: 10, spells: 9 },
  { level: 13, deathRay: 4, magicWands: 5, paralysisPetrify: 8, dragonBreath: 10, spells: 9 },
  { level: 14, deathRay: 4, magicWands: 5, paralysisPetrify: 7, dragonBreath: 9, spells: 8 },
  { level: 15, deathRay: 3, magicWands: 4, paralysisPetrify: 7, dragonBreath: 9, spells: 8 },
  { level: 16, deathRay: 3, magicWands: 4, paralysisPetrify: 6, dragonBreath: 8, spells: 7 },
  { level: 17, deathRay: 2, magicWands: 3, paralysisPetrify: 6, dragonBreath: 8, spells: 7 },
  { level: 18, deathRay: 2, magicWands: 3, paralysisPetrify: 5, dragonBreath: 7, spells: 6 },
  { level: 19, deathRay: 1, magicWands: 2, paralysisPetrify: 5, dragonBreath: 7, spells: 6 },
  { level: 20, deathRay: 1, magicWands: 2, paralysisPetrify: 4, dragonBreath: 6, spells: 5 },
  // Add more levels as needed
];

// Ranger
rangerTable = [
{ level: 1, expPoints: 0, hitDice: '1d8' },
{ level: 2, expPoints: 2200, hitDice: '2d8' },
{ level: 3, expPoints: 4400, hitDice: '3d8' },
{ level: 4, expPoints: 8800, hitDice: '4d8' },
{ level: 5, expPoints: 17600, hitDice: '5d8' },
{ level: 6, expPoints: 35200, hitDice: '6d8' },
{ level: 7, expPoints: 70400, hitDice: '7d8' },
{ level: 8, expPoints: 132000, hitDice: '8d8' },
{ level: 9, expPoints: 264000, hitDice: '9d8' },
{ level: 10, expPoints: 396000, hitDice: '9d8+2' },
{ level: 11, expPoints: 528000, hitDice: '9d8+4' },
{ level: 12, expPoints: 660000, hitDice: '9d8+6' },
{ level: 13, expPoints: 792000, hitDice: '9d8+8' },
{ level: 14, expPoints: 924000, hitDice: '9d8+10' },
{ level: 15, expPoints: 1056000, hitDice: '9d8+12' },
{ level: 16, expPoints: 1188000, hitDice: '9d8+14' },
{ level: 17, expPoints: 1320000, hitDice: '9d8+16' },
{ level: 18, expPoints: 1452000, hitDice: '9d8+18' },
{ level: 19, expPoints: 1584000, hitDice: '9d8+20' },
{ level: 20, expPoints: 1716000, hitDice: '9d8+22' },
// Add more levels as needed
];

//Ranger Skills
rangerSkillsTable = [
{ level: 1, moveSilently: 25, hide: 10, tracking: 40 },
{ level: 2, moveSilently: 30, hide: 15, tracking: 44 },
{ level: 3, moveSilently: 35, hide: 20, tracking: 48 },
{ level: 4, moveSilently: 40, hide: 25, tracking: 52 },
{ level: 5, moveSilently: 45, hide: 30, tracking: 56 },
{ level: 6, moveSilently: 50, hide: 35, tracking: 60 },
{ level: 7, moveSilently: 55, hide: 40, tracking: 64 },
{ level: 8, moveSilently: 60, hide: 45, tracking: 68 },
{ level: 9, moveSilently: 65, hide: 50, tracking: 72 },
{ level: 10, moveSilently: 68, hide: 53, tracking: 75 },
{ level: 11, moveSilently: 71, hide: 56, tracking: 78 },
{ level: 12, moveSilently: 74, hide: 59, tracking: 81 },
{ level: 13, moveSilently: 77, hide: 62, tracking: 84 },
{ level: 14, moveSilently: 80, hide: 65, tracking: 87 },
{ level: 15, moveSilently: 83, hide: 68, tracking: 90 },
{ level: 16, moveSilently: 85, hide: 69, tracking: 91 },
{ level: 17, moveSilently: 87, hide: 70, tracking: 92 },
{ level: 18, moveSilently: 89, hide: 71, tracking: 93 },
{ level: 19, moveSilently: 91, hide: 72, tracking: 94 },
{ level: 20, moveSilently: 93, hide: 73, tracking: 95 },
// Add more levels as needed
];

//Assassin
assassinTable = [
{ level: 1, expPoints: 0, hitDice: '1d4' },
{ level: 2, expPoints: 1375, hitDice: '2d4' },
{ level: 3, expPoints: 2750, hitDice: '3d4' },
{ level: 4, expPoints: 5500, hitDice: '4d4' },
{ level: 5, expPoints: 11000, hitDice: '5d4' },
{ level: 6, expPoints: 22000, hitDice: '6d4' },
{ level: 7, expPoints: 44000, hitDice: '7d4' },
{ level: 8, expPoints: 82500, hitDice: '8d4' },
{ level: 9, expPoints: 165000, hitDice: '9d4' },
{ level: 10, expPoints: 247500, hitDice: '9d4+2' },
{ level: 11, expPoints: 330000, hitDice: '9d4+4' },
{ level: 12, expPoints: 412500, hitDice: '9d4+6' },
{ level: 13, expPoints: 495000, hitDice: '9d4+8' },
{ level: 14, expPoints: 577500, hitDice: '9d4+10' },
{ level: 15, expPoints: 660000, hitDice: '9d4+12' },
{ level: 16, expPoints: 742500, hitDice: '9d4+14' },
{ level: 17, expPoints: 825000, hitDice: '9d4+16' },
{ level: 18, expPoints: 907500, hitDice: '9d4+18' },
{ level: 19, expPoints: 990000, hitDice: '9d4+20' },
{ level: 20, expPoints: 1072500, hitDice: '9d4+22' },
// Add more levels as needed
];

// Assassin Abilities
assassinSkillsTable = [
{ level: 1, openLocks: 15, pickPockets: 20, moveSilently: 20, climbWalls: 70, hide: 5, listen: 25, poison: 25 },
{ level: 2, openLocks: 19, pickPockets: 25, moveSilently: 25, climbWalls: 72, hide: 10, listen: 29, poison: 30 },
{ level: 3, openLocks: 23, pickPockets: 30, moveSilently: 30, climbWalls: 74, hide: 15, listen: 33, poison: 35 },
{ level: 4, openLocks: 27, pickPockets: 35, moveSilently: 35, climbWalls: 76, hide: 20, listen: 37, poison: 40 },
{ level: 5, openLocks: 31, pickPockets: 40, moveSilently: 40, climbWalls: 78, hide: 25, listen: 41, poison: 45 },
{ level: 6, openLocks: 35, pickPockets: 45, moveSilently: 45, climbWalls: 80, hide: 30, listen: 45, poison: 50 },
{ level: 7, openLocks: 39, pickPockets: 50, moveSilently: 50, climbWalls: 82, hide: 35, listen: 49, poison: 55 },
{ level: 8, openLocks: 43, pickPockets: 55, moveSilently: 55, climbWalls: 84, hide: 40, listen: 53, poison: 60 },
{ level: 9, openLocks: 47, pickPockets: 60, moveSilently: 60, climbWalls: 86, hide: 45, listen: 57, poison: 65 },
{ level: 10, openLocks: 50, pickPockets: 63, moveSilently: 63, climbWalls: 87, hide: 48, listen: 60, poison: 69 },
{ level: 11, openLocks: 53, pickPockets: 66, moveSilently: 66, climbWalls: 88, hide: 51, listen: 63, poison: 73 },
{ level: 12, openLocks: 56, pickPockets: 69, moveSilently: 69, climbWalls: 89, hide: 54, listen: 66, poison: 77 },
{ level: 13, openLocks: 59, pickPockets: 72, moveSilently: 72, climbWalls: 90, hide: 57, listen: 69, poison: 81 },
{ level: 14, openLocks: 62, pickPockets: 75, moveSilently: 75, climbWalls: 91, hide: 60, listen: 72, poison: 85 },
{ level: 15, openLocks: 65, pickPockets: 78, moveSilently: 78, climbWalls: 92, hide: 63, listen: 75, poison: 89 },
{ level: 16, openLocks: 66, pickPockets: 79, moveSilently: 80, climbWalls: 93, hide: 64, listen: 77, poison: 91 },
{ level: 17, openLocks: 67, pickPockets: 80, moveSilently: 82, climbWalls: 94, hide: 65, listen: 79, poison: 93 },
{ level: 18, openLocks: 68, pickPockets: 81, moveSilently: 84, climbWalls: 95, hide: 66, listen: 81, poison: 95 },
{ level: 19, openLocks: 69, pickPockets: 82, moveSilently: 86, climbWalls: 96, hide: 67, listen: 83, poison: 97 },
{ level: 20, openLocks: 70, pickPockets: 83, moveSilently: 88, climbWalls: 97, hide: 68, listen: 85, poison: 99 },
// Add more levels as needed

];



constructor(data) {


//Character Sheet

this.name = data.name;
this.occupation = data.occupation;

this.level = data.level || 0;
this.class = data.class || 'Peasant';

this.str = data.str || this.rollScore(); 
this.dex = data.dex || this.rollScore();
this.int = data.int || this.rollScore();
this.wis = data.wis || this.rollScore();
this.con = data.con || this.rollScore();
this.cha = data.cha || this.rollScore();

this.getModifiers();

this.Backstory = data.Backstory;
this.getHitPoints(this.class, this.level);
this.getMagic(this.class, this.level);
this.getCharacterSkills(this.class, this.level);
this.getInventory(this.class, this.occupation, this.name);
this.getSavingThrows(this.class,this.level);
this.getAttackBonus(this.class,this.level);

}

getModifiers() {
  // Array of ability scores
  const abilityScores = [this.str, this.dex, this.int, this.wis, this.con, this.cha];

  // Calculate modifiers for each ability score
  const modifiers = abilityScores.map(score => {
    const modifierEntry = this.abilityScoreTable.find(entry => score >= entry.range.min && score <= entry.range.max);
    return modifierEntry ? modifierEntry.bonus : 0;
  });

  // Assign modifiers back to the respective properties
  [this.strMod, this.dexMod, this.intMod, this.wisMod, this.conMod, this.chaMod] = modifiers;

  this.Modifiers = modifiers;
}


rollScore() {
return Math.floor(Math.random() * (18 - 3 + 1)) + 3;
}

getCharacterSkills(characterClass, characterLevel) {
  let skillTable;
  let level = parseInt(characterLevel, 10);
  let skills = {};

  // Determine the skill table based on character class
  switch (characterClass) {
    case 'Ranger':
      skillTable = this.rangerSkillsTable;
      skills = this.mapSkills(skillTable, level, ['tracking', 'moveSilently', 'hide']);
      break;
    case 'Thief':
      skillTable = this.thiefSkillsTable;
      skills = this.mapSkills(skillTable, level, ['openLocks', 'removeTraps', 'pickPockets', 'moveSilently', 'climbWalls', 'hide', 'listen']);
      break;
    case 'Assassin':
      skillTable = this.assassinSkillsTable;
      skills = this.mapSkills(skillTable, level, ['openLocks', 'pickPockets', 'moveSilently', 'climbWalls', 'hide', 'listen', 'poison']);
    break;
    case 'Cleric':
      skillTable = this.clericsVsUndeadTable;
      skills = this.mapSkills(skillTable, level, ['Skeleton', 'Zombie', 'Ghoul', 'Wight', 'Wraith', 'Mummy', 'Spectre', 'Vampire', 'Ghost']);
      break;
    default:
      // Return null or handle the case where the class is not supported
      return null;
  }

  // Assign the skills object to the corresponding property
  this.Skills = skills;
}

mapSkills(skillTable, level, skillNames) {
  const levelEntry = skillTable.find(entry => entry.level === level);
  const skills = {};

  if (levelEntry) {
    // Populate the skills object based on the provided skill names
    skillNames.forEach(skillName => {
      skills[skillName] = levelEntry[skillName];
    });
  }

  return skills;
}

getSavingThrows(characterClass, characterLevel) {
  let skillTable;
  let level = parseInt(characterLevel, 10);
  let savingThrows = {};

  switch (characterClass) {
      case 'Fighter':
      skillTable = this.fighterSavingThrowTable;
      
      break;
      case 'Ranger':
      skillTable = this.fighterSavingThrowTable;
      
      break;
      case 'Thief':
      skillTable = this.thiefSavingThrowTable;
      
      break;
      case 'Assassin':
      skillTable = this.thiefSavingThrowTable;
      
      break;
      case 'Cleric':
      skillTable = this.clericSavingThrowTable;
      
      break;
      case 'Magic User':
      skillTable = this.magicUserSavingThrowTable;
      
      break;
      default:
      return null;
  }

  savingThrows = this.mapSkills(skillTable, level, ['deathRay', 'magicWands', 'paralysisPetrify','dragonBreath',  'spells']);
  this.savingThrows = savingThrows;
}

getAttackBonus(characterClass, characterLevel){

let Table;
let level = parseInt(characterLevel, 10);

switch (characterClass) {
  case 'Fighter':
    Table = this.fighterTable;
    
    break;
    case 'Ranger':
    Table = this.fighterTable;
    
    break;
    case 'Thief':
    Table = this.thiefTable;
    
    break;
    case 'Assassin':
    Table = this.thiefTable;
    
    break;
    case 'Cleric':
    Table = this.clericTable;
    
    break;
    case 'Magic User':
    Table = this.magicUserTable;
    break;
  
    default:
    return null;
}

  let tableReturn = this.mapSkills(Table, level, ['attackBonus']);
  this.attackBonus = tableReturn.attackBonus;
}

getMagic(characterClass, characterLevel) {
let classTable;
let level = parseInt(characterLevel, 10);

if (characterClass === 'Magic User') {
classTable = this.magicUserTable;
} else if (characterClass === 'Cleric') {
classTable = this.clericTable;
}

if (classTable) {
// Find spellSlots for NPC's Level
const levelEntry = classTable.find(entry => entry.level === level);
const spellBook = Spells.spellsArray.filter(spell => spell.Class === characterClass);
this.magic =  `${characterClass === 'Cleric' ? `<span class="expandable cyan" data-content-type="rule" divId="Orsons">Orsons:</span>`:
`<span class="expandable cyan" data-content-type="rule" divId="Spellcasting">Spells:</span>`}<br><br>`

// Start at Level 1
let levelCheck = 0;

// Loop through spellSlots, assigning spells.
for (let levelIndex = 0; levelIndex < level; levelIndex++) {
const spellCount = levelEntry.spells[levelIndex];
const levelSpells = spellBook.filter(spell => spell.Level === (levelIndex + 1).toString());

// Loop through spellCount, choose random spells.
for (let spellSlot = 0; spellSlot < spellCount; spellSlot++) {
const randomIndex = Math.floor(Math.random() * levelSpells.length);
const chosenSpell = levelSpells[randomIndex];
levelSpells.splice(randomIndex, 1);

// Check for End of Loop
if (levelCheck < chosenSpell.Level) {
this.magic += `LEVEL ${levelIndex + 1} SPELLS <br>`;
//Bug here if Character is over level 15?
levelCheck = chosenSpell.Level;
}

this.magic += `~${chosenSpell.Name}~<br>`;

}
}
}
}

rollHitDice(hitDice) {
const regex = /(\d+)d(\d+)([+-]\d+)?/; // Regular expression to match dice notation
const match = hitDice.match(regex);

if (!match) {
throw new Error('Invalid hit dice notation');
}

const numDice = parseInt(match[1], 10);
const diceType = parseInt(match[2], 10);
const modifier = match[3] ? parseInt(match[3], 10) : 0;

let total = 0;

for (let i = 0; i < numDice; i++) {
total += Math.floor(Math.random() * diceType) + 1;
}

total += modifier;
return total;
}

getHitPoints(characterClass, characterLevel) {
let classTable;
let level = parseInt(characterLevel, 10);

if (characterClass === 'Magic User') {
classTable = this.magicUserTable;
} else if (characterClass === 'Cleric') {
classTable = this.clericTable;
} else if (characterClass === 'Fighter') {
classTable = this.fighterTable;
} else if (characterClass === 'Thief') {
classTable = this.thiefTable;
} else if (characterClass === 'Ranger') {
classTable = this.rangerTable;
} else if (characterClass === 'Assassin') {
classTable = this.assassinTable;
} else {
this.hitPoints = Math.floor(Math.random() * (5 - 1 + 1));
}

if(classTable){

let levelEntry = classTable.find(entry => entry.level === level);
let hitDice = levelEntry.hitDice;

// Calculate hit points using the rollHitDice function
this.hitPoints = this.rollHitDice(hitDice); 
}

}

getInventory(characterClass, occupation, characterName) {
  // Filter itemsArray based on characterClass and occupation
  const filteredItems = Items.itemsArray.filter(item => {
  const itemTags = item.Tags ? item.Tags.split(',').map(tag => tag.trim()) : [];

  // Check if the item matches the criteria
  return (
  (characterClass === '' || itemTags.includes(characterClass) || itemTags.includes(characterName)) ||
  (occupation && occupation.split(',').map(tag => tag.trim()).some(tag => itemTags.includes(tag)))
  );
  });

  // Format each item and add to this.inventory
this.inventory = filteredItems.map(item => ({
  Name: item.Name,
  Tag: item.Tags ? item.Tags.split(',').map(tag => tag.trim()).find(tag => 
    tag === characterClass || 
    tag === characterName  ||
    (occupation && occupation.split(',').map(tag => tag.trim()).some(occTag => occTag === tag))
  ) : ''
}));

// Sort the inventory alphabetically by item.Tag
this.inventory.sort((a, b) => (a.Tag > b.Tag) ? 1 : -1);

//console.log(this.inventory);

  // Log the names of the items
  //console.log(this.inventory.length !== 0 ? "Character Inventory:" + JSON.stringify(this.inventory) : '');
}

}

export default NPCbuild;



