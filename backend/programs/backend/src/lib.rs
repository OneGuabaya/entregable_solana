use anchor_lang::prelude::*;

declare_id!("TLx9BAKaDHPT3aeZy3j6EzUmiXCcTsj86Dzv8LYL3a6");

#[program]
pub mod backend {
    use super::*;

    pub fn register_developer(
        ctx: Context<RegisterDeveloper>,
        name: String,
        last_name: String,
        city: String,
        country: String,
        contact: String,
        techs: String,
        hourly_rate: u64,
    ) -> Result<()> {
        let dev_account = &mut ctx.accounts.dev_account;
        dev_account.owner = *ctx.accounts.user.key;
        dev_account.name = name;
        dev_account.last_name = last_name;
        dev_account.city = city;
        dev_account.country = country;
        dev_account.contact = contact;
        dev_account.techs = techs;
        dev_account.hourly_rate = hourly_rate;
        Ok(())
    }

    pub fn delete_developer(_ctx: Context<DeleteDeveloper>) -> Result<()> {
        msg!("Perfil eliminado exitosamente. SOL devuelto al dueño.");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RegisterDeveloper<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 100 + 100 + 100 + 100 + 150 + 200 + 8,
        seeds = [b"developer", user.key().as_ref()],
        bump
    )]
    pub dev_account: Account<'info, DeveloperProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DeleteDeveloper<'info> {
    #[account(
        mut,
        seeds = [b"developer", user.key().as_ref()],
        bump,
        close = user, // Esta instrucción cierra la cuenta y devuelve el SOL al user
        constraint = dev_account.owner == user.key() // Seguridad: Solo el dueño borra
    )]
    pub dev_account: Account<'info, DeveloperProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct DeveloperProfile {
    pub owner: Pubkey,
    pub name: String,
    pub last_name: String,
    pub city: String,
    pub country: String,
    pub contact: String,
    pub techs: String,
    pub hourly_rate: u64,
}