import { GeneScience } from "../generated/RobotCore/GeneScience";
import { Address, BigInt } from "@graphprotocol/graph-ts";

let geneScienceAddr = "0x972598c226fcFB1C98B0Fe1A5176734739e6bba8";

export function fetchGeneTraits(genes: BigInt): Array<i32> {
  let contract = GeneScience.bind(Address.fromString(geneScienceAddr));
  let res = contract.try_decode(genes);
  if (res.reverted) {
    return new Array(43);
  }

  return res.value;
}

export function getRobotStats(traits: Array<i32>): Array<BigInt> {
  let stats = baseStats[traits[40]];
  let bodyPartNum = 9;
  if (traits[42] == 1) {
    bodyPartNum = 6;
  }

  for (var i = 0; i < bodyPartNum; i++) {
    stats[0] += bodyStatMaps[i * 4][0];
    stats[1] += bodyStatMaps[i * 4][1];
    stats[2] += bodyStatMaps[i * 4][2];
  }
  return [BigInt.fromI32(stats[0]), BigInt.fromI32(stats[1]), BigInt.fromI32(stats[2])];
}

const baseStats: Array<Array<i32>> = [
  [30, 44, 26],
  [44, 33, 86],
  [78, 12, 68],
  [23, 67, 12],
  [11, 86, 12],
  [124, 67, 32],
];

const bodyStatMaps: Array<Array<i32>> = [
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 1],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 1],
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 1],
  [0, 1, 0],
  [1, 1, 0],
];
