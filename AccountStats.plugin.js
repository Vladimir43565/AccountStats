/**
 * @name AccountStats
 * @version 1.6.2
 * @author Me
 * @description Displays join date, Discord ID, discriminator, bots in friends list, servers joined, owned servers, account age, and more. Displays a banner with a color or GIF if available.
 */

const { React } = BdApi;

module.exports = class AccountStats {
  getName() { return "AccountStats"; }
  getDescription() { return "Displays join date, Discord ID, discriminator, bots in friends list, servers joined, owned servers, account age, and more."; }
  getVersion() { return "1.6.2"; }
  getAuthor() { return "Me"; }

  start() {}
  stop() {}

  getSettingsPanel() {
    const userModule = BdApi.findModuleByProps("getCurrentUser");
    const relationships = BdApi.findModuleByProps("getRelationships");
    const guildsModule = BdApi.findModuleByProps("getGuilds");
    const PresenceStore = BdApi.findModuleByProps("getStatus");  // Added PresenceStore to get status

    const currentUser = userModule.getCurrentUser();
    const creationDate = new Date(currentUser.createdAt || currentUser.createdTimestamp || 0);
    const joinDate = creationDate.toLocaleString();  // Full date and time

    const friendRelations = relationships.getRelationships();
    const allUsers = BdApi.findModuleByProps("getUsers").getUsers();
    const botCount = Object.entries(friendRelations)
      .filter(([id, type]) => type === 1 && allUsers[id]?.bot).length;

    const allGuilds = guildsModule.getGuilds();
    const totalGuilds = Object.keys(allGuilds).length;

    // Debugging: Check what guilds you have
    console.log("All guilds:", allGuilds);
    
    // Filtering owned guilds
    const ownedGuilds = Object.values(allGuilds)
      .filter(guild => guild.ownerId === currentUser.id).length;

    // Additional Information
    const discordId = currentUser.id;
    const discriminator = currentUser.discriminator;
    const username = currentUser.username;
    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${currentUser.avatar}.png`; // Avatar URL
    const status = currentUser.presence?.status || "Unknown";  // User status (online, idle, etc.)
    const totalFriends = Object.values(friendRelations).filter(type => type === 1).length; // Total friends count
    const bannerUrl = currentUser.banner ? `https://cdn.discordapp.com/banners/${discordId}/${currentUser.banner}.png` : "No banner"; // Banner URL
    const premiumType = currentUser.premiumType === 1 ? "Nitro Classic" : currentUser.premiumType === 2 ? "Nitro" : "None"; // Nitro subscription type

    // Account Age Calculation
    const ageInMs = Date.now() - creationDate.getTime();
    const ageInDays = Math.floor(ageInMs / (1000 * 60 * 60 * 24));
    const ageInYears = Math.floor(ageInDays / 365);
    const remainingMonths = Math.floor((ageInDays % 365) / 30);
    const remainingDays = ageInDays % 30;

    // Badges (just a few examples here)
    const badges = currentUser.publicFlags || 0;
    const badgeList = [];
    if (badges & 1) badgeList.push("Early Supporter");
    if (badges & 4) badgeList.push("Verified Bot Developer");
    if (badges & 8) badgeList.push("HypeSquad");
    if (badges & 64) badgeList.push("Bug Hunter");
    const userBadges = badgeList.length > 0 ? badgeList.join(", ") : "No badges";

    // Get the user status (online, idle, dnd, offline)
    const statusEmojis = {
      online: "🟢 Online",
      idle: "🌙 Idle",
      dnd: "⛔ Do Not Disturb",
      offline: "⚫ Offline",
    };
    const userStatus = PresenceStore.getStatus(currentUser.id) || "unknown";  // Default to "unknown" if not found
    const userStatusText = statusEmojis[userStatus] || "❔ Unknown"; // Display status with emoji

    // Determine if the banner is a GIF or static image
    let bannerDisplay = null;
    if (currentUser.banner) {
      if (currentUser.banner.startsWith("a_")) {
        // It's a GIF
        bannerDisplay = React.createElement("a", { href: bannerUrl, target: "_blank", style: { color: "white" } }, `🎥 GIF Banner: ${bannerUrl}`);
      } else {
        // Static image
        bannerDisplay = React.createElement("img", { src: bannerUrl, alt: "Banner", style: { width: "100%", height: "150px", borderRadius: "8px" } });
      }
    } else {
      bannerDisplay = "No banner available.";
    }

    return React.createElement("div", { style: { padding: "20px", backgroundColor: "#2f3136", color: "white", borderRadius: "8px" } },
      React.createElement("h2", { style: { color: "#7289da" } }, "📊 Account Stats"),
      React.createElement("div", null, `🗓️ Joined Discord: ${joinDate}`),
      React.createElement("div", null, `💳 Your Discord ID: ${discordId}`),
      React.createElement("div", null, `🔢 Your Discriminator: #${discriminator}`),
      React.createElement("div", null, `💬 Username: ${username}`),
      React.createElement("div", null, `🤖 Bots You're Friends With: ${botCount}`),
      React.createElement("div", null, `🛡️ Servers You Own: ${ownedGuilds}`),
      React.createElement("div", null, `🌐 Servers You're In: ${totalGuilds}`),
      React.createElement("div", null, `🖼️ Avatar:`, React.createElement("img", { src: avatarUrl, alt: "Avatar", style: { width: "50px", height: "50px", borderRadius: "50%" } })),
      React.createElement("div", null, `💬 Status: ${userStatusText}`),
      React.createElement("div", null, `👥 Total Friends: ${totalFriends}`),
      React.createElement("div", null, `🖼️ Banner: ${bannerDisplay}`),  // Added dynamic banner display
      React.createElement("div", null, `🔥 Nitro Subscription: ${premiumType}`),
      React.createElement("div", null, `⏳ Account Age: ${ageInYears} years, ${remainingMonths} months, and ${remainingDays} days`),
      React.createElement("div", null, `🏅 User Badges: ${userBadges}`)
    );
  }
};
