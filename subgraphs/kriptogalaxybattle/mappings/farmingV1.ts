import { Stake } from "../generated/FarmingV1/FarmingV1";
import { Planet } from "../generated/schema";

export function handleStake(e: Stake): void {
    let planet = Planet.load(e.params.packageId.toString())
    planet.strategy = e.address;
    planet.monsters = e.params.monster.map(m => m.toString())
    planet.robots = e.params.robots.map(m => m.toString())
    planet.save();
}
