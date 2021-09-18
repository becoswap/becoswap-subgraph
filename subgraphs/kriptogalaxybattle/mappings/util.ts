import { GeneScience } from "../generated/RobotCore/GeneScience";
import { Address, BigInt } from "@graphprotocol/graph-ts";

let geneScienceAddr = "0x8604793d4135c39787E209Aa791CAB258808861b";
let robotImageURL = "https://images.kriptogaming.com/robot/";

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

export let cooldowns: Array<BigInt> = [
  new BigInt(60 * 5),
  new BigInt(60 * 10),
  new BigInt(60 * 15),
  new BigInt(60 * 30),
  new BigInt(60 * 45),
  new BigInt(60 * 60),
  new BigInt(60 * 60 * 2),
  new BigInt(60 * 60 * 4),
  new BigInt(60 * 60 * 8),
  new BigInt(60 * 60 * 12),
  new BigInt(60 * 60 * 24),
  new BigInt(60 * 60 * 24 * 2),
  new BigInt(60 * 60 * 24 * 4),
  new BigInt(60 * 60 * 24 * 7),
];
