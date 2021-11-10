import { Address, Bytes } from "@graphprotocol/graph-ts";
import { Created, Transfer } from "../generated/PlanetCore/PlanetCore";
import { Planet } from "../generated/schema";


const strategies : Array<string> = [
  "0x96534accf2d52225462cfe0a0ec18b8b37353e4d"
]

function isStratery(addr: Address): boolean {
 return strategies.filter(v =>  v === addr.toString()).length > 0
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
      m.robots = null;
      m.monsters = null;
      m.strategy = null;
      m.save();
      
    }
}
  