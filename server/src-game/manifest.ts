export class Item {
    name: string;
    description: string;
    icon: string;
    color: string;
    energyDelta: number;
    matter: number;
    gold: number;
    // Combat
    damage: number; // Negative number: damage; positive number: heals
    energyCost: number;
    effects: Array<any>;

    constructor(name: string, description: string, icon: string, color: string = "cyberyellow",
                energyDelta: number = 0, matter: number= 0, gold: number=0,
                damage: number = 0, energyCost: number = 0, effects=[]) {
        this.name = name
        this.description = description
        this.icon = icon
        this.color = color
        this.energyDelta = energyDelta
        this.matter = matter
        this.gold = gold
        this.damage = damage
        this.energyCost = energyCost
        this.effects = effects
    }
}

export class Tile {
    name: any;
    description: any;
    icon: any;
    energyDelta: number;

    constructor(name: string, description: string, icon: string=null, energyDelta: number=0) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.energyDelta = energyDelta;
    }
}

export const MANIFEST = {
    "items": {
        "oxygen": new Item("Oxygen", "Restores Oxygen", "o")
    },
    "tiles": {
        "exit": new Tile("Exit", "You need to activate the switches first!", "O"),
        "exitopen": new Tile("Open exit", "Whoever reaches this first wins", "Q"),
        "oxygen": new Item("Oxygen", "Restores Oxygen", "o"),
        "startplayer0": new Tile("Start Player 0", "Starting point of player 0", "0"),
        "startplayer1": new Tile("Start Player 1", "Starting point of player 1", "1"),
        "startplayer2": new Tile("Start Player 2", "Starting point of player 2", "2"),
        "startplayer3": new Tile("Start Player 3", "Starting point of player 3", "3"),
        "startplayer4": new Tile("Start Player 4", "Starting point of player 4", "4"),
        "startplayer5": new Tile("Start Player 5", "Starting point of player 5", "5"),
        "startplayer6": new Tile("Start Player 6", "Starting point of player 6", "6"),
        "startplayer7": new Tile("Start Player 7", "Starting point of player 7", "7"),
        "switchA": new Tile("Switch A", "Switch to unlock the exit", "A"),
        "switchB": new Tile("Switch B", "Switch to unlock the exit", "B"),
        "switchC": new Tile("Switch C", "Switch to unlock the exit", "C"),
        "switchD": new Tile("Switch D", "Switch to unlock the exit", "D"),
        "switcha": new Tile("Activated Switch A", "Activated switch", "a"),
        "switchb": new Tile("Activated Switch B", "Activated switch", "b"),
        "switchc": new Tile("Activated Switch C", "Activated switch", "c"),
        "switchd": new Tile("Activated Switch D", "Activated switch", "d"),
        "wall": new Tile("Wall", "Blocks movement", "#"),
        "water": new Tile("Water", "Drains Oxygen", ".")
    }
}