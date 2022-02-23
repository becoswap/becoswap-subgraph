import { Bytes } from "@graphprotocol/graph-ts";
import { CreateTeam, DestroyTeam, Transfer } from "../generated/BattleTeam/BattleTeam";
import { Team } from "../generated/schema";

export function handleCreateTeam(e: CreateTeam): void {
  let team = new Team(e.params.teamId.toString());
  team.robots = e.params.robots.map<string>((robot) => {
    return robot.toString();
  });

  team.monsters = e.params.monsters.map<string>((monster) => {
    return monster.toString();
  });

  team.owner = e.params.user.toHex();

  team.save();
}

export function handleDestroyTeam(e: DestroyTeam): void {
  let team = new Team(e.params.teamId.toString());
  team.owner = "0x0000000000000000000000000000000000000000";
  team.save();
}

export function handleTransfer(args: Transfer): void {
  let m = Team.load(args.params.tokenId.toString());
  if (m) {
    m.owner = args.params.to.toHex();
    m.save();
  }
}
