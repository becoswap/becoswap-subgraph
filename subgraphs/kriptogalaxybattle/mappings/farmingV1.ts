import { Stake } from "../generated/FarmingV1/FarmingV1";
import { Planet } from "../generated/schema";

export function handleStake(e: Stake): void {
  let planet = Planet.load(e.params.packageId.toString());
  if (!planet) return;

  planet.strategy = e.address;

  planet.robots = e.params.robots.map<string>((robot) => {
    return robot.toString();
  });

  planet.monsters = e.params.monster.map<string>((monster) => {
    return monster.toString();
  });

  planet.save();
}
