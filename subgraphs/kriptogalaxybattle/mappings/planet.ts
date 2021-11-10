import { Address } from "@graphprotocol/graph-ts";
import { Created, Transfer } from "../generated/PlanetCore/PlanetCore";
import { Planet } from "../generated/schema";

const strateries = [
]

function isStratery(addr: Address) {
  return strateries.indexOf(addr.toString()) >= 0
}

export function handleCreate(args: Created): void {
    let planet = new Planet(args.params.planetId.toString())
    planet.cardId = args.params.cardId;
    planet.size = args.params.size;
    planet.rarity = args.params.rarity;
    planet.owner = args.params.owner;
    planet.save()
}

export function handleTransfer(args: Transfer): void {
  if (isStratery(args.params.to)) return;
    let m = Planet.load(args.params.tokenId.toString());
    if (m) {
      m.owner = args.params.to;
      delete m.robots;
      delete m.monsters;
      delete m.strategy;
      m.save();
    }
}
  