import { BigInt } from "@graphprotocol/graph-ts";
import { RobotCreated, Pregnant, Transfer } from "../generated/RobotCore/RobotCore";
import { Robot } from "../generated/schema";
import { cooldowns, fetchGeneTraits, getRobotImage, ONE_BI, TWO_BI, ZERO_BI } from "./util";

let MAX_COOLDOWN_INDEX = BigInt.fromI32(13);
let SECONDS_PER_BLOCK = BigInt.fromI32(5);

export function handlePregnant(args: Pregnant): void {
  let matron = Robot.load(args.params.matronId.toString());
  // Mark the matron as pregnant, keeping track of who the sire is.
  matron.siringWithId = args.params.sireId;
  matron.save();

  _triggerCooldown(args, args.params.matronId.toString());
  _triggerCooldown(args, args.params.sireId.toString());
}

function _triggerCooldown(args: Pregnant, robotId: string): void {
  let robot = Robot.load(robotId);
  robot.cooldownEndBlock = cooldowns[robot.cooldownIndex.toI32()].div(SECONDS_PER_BLOCK).plus(args.block.number);
  if (robot.cooldownIndex.lt(MAX_COOLDOWN_INDEX)) {
    robot.cooldownIndex = robot.cooldownIndex.plus(ONE_BI);
  }
  robot.save();
}

export function handleCreate(args: RobotCreated): void {
  let robot = new Robot(args.params._robotId.toString());
  robot.owner = args.params._owner;
  robot.cooldownEndBlock = ZERO_BI;
  robot.matronId = args.params.matronId;
  robot.sireId = args.params.sireId;
  robot.genes = args.params._genes.toHex();
  robot.siringWithId = ZERO_BI;
  robot.generation = ZERO_BI;
  robot.cooldownIndex = ZERO_BI;
  robot.name = "KABA Robot #" + robot.id;

  if (!robot.matronId.isZero()) {
    let matron = Robot.load(robot.matronId.toString());
    matron.siringWithId = ZERO_BI;
    matron.save();

    let sire = Robot.load(robot.sireId.toString());

    robot.generation = matron.generation;
    if (sire.generation > matron.generation) {
      robot.generation = sire.generation;
    }
    robot.generation = robot.generation.plus(ONE_BI);

    robot.cooldownIndex = robot.generation.div(TWO_BI);
    if (robot.cooldownIndex.gt(MAX_COOLDOWN_INDEX)) {
      robot.cooldownIndex = MAX_COOLDOWN_INDEX;
    }
  }

  let traits = fetchGeneTraits(args.params._genes);
  robot.gen0Rarity = BigInt.fromI32(1);
  robot.image = getRobotImage(traits);
  robot.save();
}

export function handleTransfer(args: Transfer): void {
  let robot = Robot.load(args.params.tokenId.toString());
  if (robot) {
    robot.owner = args.params.to;
    robot.save();
  }
}
