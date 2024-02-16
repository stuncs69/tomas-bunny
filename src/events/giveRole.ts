import { Events, GuildMember, Role } from "discord.js"
import { _prisma } from "../../lib/prisma"

export const name = Events.GuildMemberAdd
export const once = false
export async function execute(user: GuildMember, ...args: any[]): Promise<void> {
    let x = await _prisma.role.findFirst({
        where: {
            discordId: user.id
        },
        select: {
            roleId: true
        }
    })

    console.log(x)

    if (x !== null) {
        let role = await user.guild.roles.fetch(`${x.roleId}`);
        if (role instanceof Role) {
            user.roles.add(role);
        } else {
            console.error(`Role with ID ${x.roleId} not found.`);
        }
    } else {
        console.error(`No role found for user with ID ${user.id}.`);
    }
}
