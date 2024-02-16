import { SlashCommandBuilder, PermissionFlagsBits, Interaction, CommandInteraction, Role, GuildMember } from "discord.js"
import { _prisma } from "../../lib/prisma"

export const data = new SlashCommandBuilder()
                        .setName("add")
                        .setDescription("Deploy a new role-on-join connection")
                        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
                        .addMentionableOption(option =>
                            option.setName("user")
                                .setDescription("User to assign role")
                                .setRequired(true))
                        .addRoleOption(option =>
                            option.setName("role")
                                .setDescription("Role to assign to user")
                                .setRequired(true))

export const execute = async function(interaction: CommandInteraction) {
    try {
        let user = interaction.options.getMember("user") as GuildMember
        //@ts-ignore
        let role = interaction.options.getRole("role") as Role

        let x = await _prisma.role.create({
            data: {
                roleId: role.id,
                discordId: user.id
            }
        })

        await interaction.reply({
            content: `Deployed new record with ID ${x.id}`
        })
    } catch (error) {
        console.error("Error executing command:", error)
        await interaction.reply({
            content: "There was an error while executing the command."
        })
    }
}
