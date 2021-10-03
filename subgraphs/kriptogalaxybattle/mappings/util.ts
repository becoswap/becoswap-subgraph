import { GeneScience } from "../generated/RobotCore/GeneScience";
import { Address, BigInt } from "@graphprotocol/graph-ts";

let geneScienceAddr = "0x8604793d4135c39787E209Aa791CAB258808861b";
let robotImageURL = "https://images.kriptogaming.com/robot/";
let monsterImageURL = "https://images.kriptogaming.com/monster/";

export let ZERO_BI = BigInt.fromI32(0);
export let ONE_BI = BigInt.fromI32(1);
export let TWO_BI = BigInt.fromI32(2);

export function fetchGeneTraits(genes: BigInt): Array<i32> {
  let contract = GeneScience.bind(Address.fromString(geneScienceAddr));
  let res = contract.try_decode(genes);
  if (res.reverted) {
    return new Array(41);
  }

  return res.value;
}

export function getRobotImage(genes: Array<i32>): string {
  let parts: Array<i32> = [
    (genes[0] % 6) + 1,
    genes[8] + 1,
    genes[4] + 1,
    genes[16] + 1,
    genes[32] + 1,
    genes[24] + 1,
    genes[36] + 1,
    genes[28] + 1,
    (genes[12] % 6) + 1,
    (genes[20] % 6) + 1,
  ];

  return robotImageURL + parts.join("-") + ".png";
}

export function getMonsterImage(genes: Array<i32>): string {
  let parts: Array<i32> = [
    (genes[0] % 6) + 1,
    genes[8] + 1,
    genes[4] + 1,
    genes[16] + 1,
    genes[32] + 1,
    genes[24] + 1,
    genes[36] + 1,
    (genes[12] % 6) + 1,
    (genes[20] % 6) + 1,
  ];

  return monsterImageURL + parts.join("-") + ".png";
}

export let cooldowns: Array<BigInt> = [
  BigInt.fromI32(60 * 5),
  BigInt.fromI32(60 * 10),
  BigInt.fromI32(60 * 15),
  BigInt.fromI32(60 * 30),
  BigInt.fromI32(60 * 45),
  BigInt.fromI32(60 * 60 * 60),
  BigInt.fromI32(60 * 60 * 2),
  BigInt.fromI32(60 * 60 * 4),
  BigInt.fromI32(60 * 60 * 8),
  BigInt.fromI32(60 * 60 * 12),
  BigInt.fromI32(60 * 60 * 24),
  BigInt.fromI32(60 * 60 * 24 * 2),
  BigInt.fromI32(60 * 60 * 24 * 4),
  BigInt.fromI32(60 * 60 * 24 * 7),
];
