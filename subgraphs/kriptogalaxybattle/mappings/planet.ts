import { Address } from "@graphprotocol/graph-ts";
import { Created, Transfer } from "../generated/PlanetCore/PlanetCore";
import { Planet } from "../generated/schema";

const strategies: Array<string> = ["0xe5a0646e86f7382c6577b9e71a4f9937f1aa3442"];

function isStratery(addr: Address): boolean {
  for (let i = 0; i < strategies.length; i++) {
    if (strategies[i] == addr.toHex()) {
      return true;
    }
  }

  return false;
}

export function handleCreate(args: Created): void {
  let planet = new Planet(args.params.planetId.toString());
  planet.cardId = args.params.cardId;
  planet.size = args.params.size;
  planet.rarity = args.params.rarity;
  planet.owner = args.params.owner;
  planet.robots = [];
  planet.monsters = [];
  planet.strategy = null;
  planet.save();
}

export function handleTransfer(args: Transfer): void {
  if (isStratery(args.params.to)) return;
  let m = Planet.load(args.params.tokenId.toString());
  if (m) {
    m.owner = args.params.to;
    m.robots = [];
    m.monsters = [];
    m.strategy = null;
    m.save();
  }
}
