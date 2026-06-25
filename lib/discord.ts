export async function getDiscordUser(accessToken: string) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.json();
}

export async function getDiscordGuildMember(accessToken: string, guildId: string) {
  const res = await fetch(
    `https://discord.com/api/users/@me/guilds/${guildId}/member`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return res.json();
}