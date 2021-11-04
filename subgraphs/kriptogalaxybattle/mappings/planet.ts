import { Created, Transfer } from "../generated/PlanetCore/PlanetCore";
import { Planet } from "../generated/schema";

export function handleCreate(args: Created): void {
    let planet = new Planet(args.params.planetId.toString())
    planet.cardId = args.params.cardId;
    planet.size = args.params.size;
    planet.rarity = args.params.rarity;
    planet.owner = args.params.owner;
    planet.save()
}

export function handleTransfer(args: Transfer): void {
    let m = Planet.load(args.params.tokenId.toString());
    if (m) {
      m.owner = args.params.to;
      m.save();
    }
  }
  