/* eslint-disable prefer-const */
import { BigDecimal, Address } from "@graphprotocol/graph-ts/index";
import { Pair, Token, Bundle } from "../generated/schema";
import { ZERO_BD, factoryContract, ADDRESS_ZERO, ONE_BD } from "./utils";

const WKAI_ADDRESS = "0xaf984e23eaa3e7967f3c5e007fbe397d8566d23d";
const KUSDT_WKAI_PAIR = "0x7cd3c7afedd16a72fba66ea35b2e2b301d1b7093";
const USDT_WKAI_PAIR = "0x8a5c572ce422da947e2d04a2d8339a2ea7141de9";

export function getKaiPriceInUSD(): BigDecimal {
  // fetch kai prices for each stablecoin
  let kusdtPair = Pair.load(KUSDT_WKAI_PAIR); // usdt is token0
  let usdtPair = Pair.load(USDT_WKAI_PAIR); // usdt is token0

  if (kusdtPair !== null && usdtPair !== null) {
    let totalLiquidityKAI = kusdtPair.reserve1.plus(usdtPair.reserve1);
    if (totalLiquidityKAI.notEqual(ZERO_BD)) {
      let kusdtWeight = kusdtPair.reserve1.div(totalLiquidityKAI);
      let usdtWeight = usdtPair.reserve1.div(totalLiquidityKAI);
      return kusdtPair.token0Price.times(kusdtWeight).plus(usdtPair.token0Price.times(usdtWeight));
    } else {
      return ZERO_BD;
    }
  } else if (kusdtPair !== null) {
    return kusdtPair.token1Price;
  } else if (usdtPair !== null) {
    return usdtPair.token1Price;
  } else {
    return ZERO_BD;
  }
}

// token where amounts should contribute to tracked volume and liquidity
let WHITELIST: string[] = [
  "0xaf984e23eaa3e7967f3c5e007fbe397d8566d23d", // WKAI
  "0x92364ec610efa050d296f1eeb131f2139fb8810e", // KUSD-T
  "0x551a5dcac57c66aa010940c2dcff5da9c53aa53b", // USDT
];

// minimum liquidity for price to get tracked
let MINIMUM_LIQUIDITY_THRESHOLD_KAI = BigDecimal.fromString("10");

/**
 * Search through graph to find derived KAI per token.
 * @todo update to be derived KAI (add stablecoin estimates)
 **/
export function findKaiPerToken(token: Token): BigDecimal {
  if (token.id == WKAI_ADDRESS) {
    return ONE_BD;
  }
  // loop through whitelist and check if paired with any
  for (let i = 0; i < WHITELIST.length; ++i) {
    let pairAddress = factoryContract.getPair(Address.fromString(token.id), Address.fromString(WHITELIST[i]));
    if (pairAddress.toHex() != ADDRESS_ZERO) {
      let pair = Pair.load(pairAddress.toHex());
      if (pair.token0 == token.id && pair.reserveKAI.gt(MINIMUM_LIQUIDITY_THRESHOLD_KAI)) {
        let token1 = Token.load(pair.token1);
        return pair.token1Price.times(token1.derivedKAI as BigDecimal); // return token1 per our token * KAI per token 1
      }
      if (pair.token1 == token.id && pair.reserveKAI.gt(MINIMUM_LIQUIDITY_THRESHOLD_KAI)) {
        let token0 = Token.load(pair.token0);
        return pair.token0Price.times(token0.derivedKAI as BigDecimal); // return token0 per our token * KAI per token 0
      }
    }
  }
  return ZERO_BD; // nothing was found return 0
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD.
 * If both are, return average of two amounts
 * If neither is, return 0
 */
export function getTrackedVolumeUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedKAI.times(bundle.kaiPrice);
  let price1 = token1.derivedKAI.times(bundle.kaiPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1)).div(BigDecimal.fromString("2"));
  }

  // take full value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0);
  }

  // take full value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1);
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}

/**
 * Accepts tokens and amounts, return tracked amount based on token whitelist
 * If one token on whitelist, return amount in that token converted to USD * 2.
 * If both are, return sum of two amounts
 * If neither is, return 0
 */
export function getTrackedLiquidityUSD(
  bundle: Bundle,
  tokenAmount0: BigDecimal,
  token0: Token,
  tokenAmount1: BigDecimal,
  token1: Token
): BigDecimal {
  let price0 = token0.derivedKAI.times(bundle.kaiPrice);
  let price1 = token1.derivedKAI.times(bundle.kaiPrice);

  // both are whitelist tokens, take average of both amounts
  if (WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).plus(tokenAmount1.times(price1));
  }

  // take double value of the whitelisted token amount
  if (WHITELIST.includes(token0.id) && !WHITELIST.includes(token1.id)) {
    return tokenAmount0.times(price0).times(BigDecimal.fromString("2"));
  }

  // take double value of the whitelisted token amount
  if (!WHITELIST.includes(token0.id) && WHITELIST.includes(token1.id)) {
    return tokenAmount1.times(price1).times(BigDecimal.fromString("2"));
  }

  // neither token is on white list, tracked volume is 0
  return ZERO_BD;
}
