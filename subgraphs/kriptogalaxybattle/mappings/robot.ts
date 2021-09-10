import { BigInt } from "@graphprotocol/graph-ts";
import { RobotCreated, Pregnant } from "../generated/RobotCore/RobotCore";
import { Robot } from "../generated/schema";
import { fetchGeneTraits, getRobotStats } from "./util";

export function handlePregnant(args: Pregnant): void {
  let robot = new Robot(args.params.matronId.toString());
  robot.siringWithId = args.params.sireId;
  robot.cooldownEndBlock = args.params.cooldownEndBlock;
  robot.save();
}

export function handleCreate(args: RobotCreated): void {
  let robot = new Robot(args.params._robotId.toString());
  robot.owner = args.params._owner;
  robot.cooldownEndBlock = new BigInt(0);
  robot.matronId = args.params.matronId;
  robot.sireId = args.params.sireId;
  robot.genes = args.params._genes;
  robot.siringWithId = new BigInt(0);

  if (!robot.matronId.isZero()) {
    let matron = Robot.load(robot.matronId.toString());
    matron.cooldownEndBlock = new BigInt(0);
    matron.siringWithId = new BigInt(0);
    matron.save();
  }

  let traits = fetchGeneTraits(args.params._genes);
  let stats = getRobotStats(traits);

  robot.classId = BigInt.fromI32(traits[42]);
  robot.rarity = BigInt.fromI32(traits[41]);
  robot.cardId = BigInt.fromI32(traits[40]);

  robot.hp = stats[0];
  robot.speed = stats[1];
  robot.strength = stats[2];

  robot.anten = BigInt.fromI32(traits[0]);
  robot.head = BigInt.fromI32(traits[4]);
  robot.eye = BigInt.fromI32(traits[8]);
  robot.lShouder = BigInt.fromI32(traits[12]);
  robot.rShouder = BigInt.fromI32(traits[16]);
  robot.lArm = BigInt.fromI32(traits[20]);
  robot.rArm = BigInt.fromI32(traits[24]);
  robot.lHand = BigInt.fromI32(traits[28]);
  robot.rHand = BigInt.fromI32(traits[32]);

  robot.mouth = robot.lShouder;
  robot.hand = robot.rShouder;
  robot.arm = robot.lArm;

  robot.onSale = false;

  robot.save();
}
