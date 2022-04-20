import { User } from "../generated/schema";
import { Buy } from "../generated/PvPTicket/PvPTicket";

export function handleBuy(args: Buy): void {
    let userId = args.params._account.toHex();
    let user = User.load(userId)
    if (!user) {
        user = new User(userId)
        user.pvpTicket = args.params._tickets;
    } else {
        user.pvpTicket = user.pvpTicket.plus(args.params._tickets)
    }
    user.save();
}