/**
 * @name AccountStats
 * @version 1.9.1
 * @author Vladimir43565
 * @description Stylish profile stats viewer with sleek UI, vibrant colors, motivational messages, and badge/banner display.
 */

const { React } = BdApi;

module.exports = class AccountStats {
  getName() { return "AccountStats"; }
  getDescription() { return "Stylish profile stats viewer with sleek UI, vibrant colors, motivational messages, and badge/banner display."; }
  getVersion() { return "1.9.1"; }
  getAuthor() { return "Vladimir43565"; }

  start() {}
  stop() {}

  getSettingsPanel() {
    const userModule = BdApi.findModuleByProps("getCurrentUser");
    const relationships = BdApi.findModuleByProps("getRelationships");
    const guildsModule = BdApi.findModuleByProps("getGuilds");
    const PresenceStore = BdApi.findModuleByProps("getStatus");

    const currentUser = userModule.getCurrentUser();
    const creationDate = new Date(currentUser.createdAt || currentUser.createdTimestamp || 0);
    const joinDate = creationDate.toLocaleString();

    const friendRelations = relationships.getRelationships();
    const allUsers = BdApi.findModuleByProps("getUsers").getUsers();
    const botCount = Object.entries(friendRelations)
      .filter(([id, type]) => type === 1 && allUsers[id]?.bot).length;

    const allGuilds = guildsModule.getGuilds();
    const totalGuilds = Object.keys(allGuilds).length;
    const ownedGuilds = Object.values(allGuilds)
      .filter(guild => guild.ownerId === currentUser.id).length;

    const discordId = currentUser.id;
    const discriminator = currentUser.discriminator;
    const username = currentUser.username;
    const avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${currentUser.avatar}.png`;
    const status = PresenceStore.getStatus(currentUser.id) || "unknown";
    const statusMap = {
      online: "🟢 Online",
      idle: "🌙 Idle",
      dnd: "⛔ Do Not Disturb",
      offline: "⚫ Offline",
      unknown: "❔ Unknown"
    };
    const userStatusText = statusMap[status] || "❔ Unknown";
    const totalFriends = Object.values(friendRelations).filter(type => type === 1).length;

    const premiumType = currentUser.premiumType === 1 ? "Nitro Classic" :
                        currentUser.premiumType === 2 ? "Nitro" : "None";

    const badgeFlags = currentUser.publicFlags || 0;
    const badgeList = [];
    if (badgeFlags & 1) badgeList.push("🏅 Early Supporter");
    if (badgeFlags & 2) badgeList.push("👨‍💻 Staff");
    if (badgeFlags & 4) badgeList.push("👾 Partner");
    if (badgeFlags & 8) badgeList.push("🎉 HypeSquad");
    if (badgeFlags & 64) badgeList.push("🐞 Bug Hunter");
    if (badgeFlags & 128) badgeList.push("🏠 Bravery");
    if (badgeFlags & 256) badgeList.push("💡 Brilliance");
    if (badgeFlags & 512) badgeList.push("💥 Balance");
    if (badgeFlags & 16384) badgeList.push("🤖 Bot Dev");
    const userBadges = badgeList.length ? badgeList.join(", ") : "No badges";

    let bannerDisplay = "No banner available.";
    if (currentUser.banner) {
      const bannerUrl = `https://cdn.discordapp.com/banners/${discordId}/${currentUser.banner}.png`;
      if (currentUser.banner.startsWith("a_")) {
        bannerDisplay = React.createElement("a", { href: bannerUrl, target: "_blank", style: { color: "white" } }, `🎥 GIF Banner: ${bannerUrl}`);
      } else {
        bannerDisplay = React.createElement("img", {
          src: bannerUrl,
          alt: "Banner",
          style: {
            width: "100%",
            height: "150px",
            borderRadius: "12px",
            marginBottom: "10px"
          }
        });
      }
    } else if (currentUser.bannerColor) {
      bannerDisplay = React.createElement("div", {
        style: {
          backgroundColor: currentUser.bannerColor,
          width: "100%",
          height: "150px",
          borderRadius: "12px",
          marginBottom: "10px"
        }
      });
    }

    const messages = [
      "🌟 You look amazing today!", "🚀 Keep reaching for the stars!", "💪 You’re stronger than you think.",
      "😄 Smile, you’re doing great!", "🔥 You're on fire today!", "🎯 Stay focused and crush it!",
      "🌈 Good things are coming.", "🎉 You make a difference.", "💖 You matter more than you know.",
      "👑 Walk like the legend you are.", "💼 You're built for success!", "📈 Keep leveling up!",
      "😎 You’ve got this!", "🍀 Today’s your lucky day!", "✨ Shine bright!", "🌻 Keep blooming!",
      "🎯 Stay persistent, success is near.", "💡 Every day is a new chance to be amazing.",
      "🌟 Embrace the journey, it’s worth it.", "🚀 The best is yet to come!", "🛠️ You’re building something great.",
      "💫 You’ve got everything it takes to succeed.", "💪 Strength doesn’t come from what you can do, it comes from overcoming what you thought you couldn’t.",
      "🌟 Believe in yourself and all that you are.", "🔑 The only limit is your mind.",
      "⚡ Every setback is a setup for a comeback.", "🌱 Growth takes time, but it’s happening.",
      "💥 Your potential is limitless.", "🌊 Keep pushing, even when it feels tough.",
      "🕊️ Peace comes from within. Keep your calm!", "🔥 Don’t stop until you’re proud.",
      "👟 You’re one step closer to your goal.", "🎉 Keep shining, the world needs your light.",
      "💖 The best is yet to come, keep going!", "🎯 Stay focused. Stay hungry. Stay humble.",
      "✨ You are one decision away from a totally different life."
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    return React.createElement("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        backgroundColor: "#2f3136",
        color: "#ffffff",
        borderRadius: "12px",
        fontFamily: "Arial, sans-serif",
        width: "100%",
        maxWidth: "500px",
        margin: "auto",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        transition: "transform 0.3s ease-in-out"
      }
    },
      React.createElement("h2", {
        style: {
          color: "#7289da",
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center"
        }
      }, "📊 Account Stats"),
      React.createElement("p", {
        style: {
          fontStyle: "italic",
          fontSize: "16px",
          color: "#b9bbbe",
          marginBottom: "20px",
          textAlign: "center"
        }
      }, randomMessage),
      bannerDisplay,
      React.createElement("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "12px",
          width: "100%",
          textAlign: "left",
          marginBottom: "20px"
        }
      },
        React.createElement("div", null, `🗓️ Joined Discord: ${joinDate}`),
        React.createElement("div", null, `💬 Username: ${username}#${discriminator}`),
        React.createElement("div", null, `🆔 ID: ${discordId}`),
        React.createElement("div", null, `💬 Status: ${userStatusText}`),
        React.createElement("div", null, `👥 Total Friends: ${totalFriends}`),
        React.createElement("div", null, `🤖 Bot Friends: ${botCount}`),
        React.createElement("div", null, `🛡️ Servers Owned: ${ownedGuilds}`),
        React.createElement("div", null, `🌐 Servers Joined: ${totalGuilds}`),
        React.createElement("div", null, `🔥 Nitro Type: ${premiumType}`),
        React.createElement("div", null, `🏅 Badges: ${userBadges}`)
      ),
      React.createElement("div", {
        style: {
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }
      },
        React.createElement("div", null, "🖼️ Avatar:"),
        React.createElement("img", {
          src: avatarUrl,
          alt: "Avatar",
          style: {
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            marginTop: "10px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)"
          }
        })
      )
    );
  }
};
