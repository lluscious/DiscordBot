
### permissionData.json
- UserPermission_Admin
- UserPermission_ConsoleAccess
- UserPermission_DataAccess
- UserPermission_ConfigAccess
- UserPermission_BlacklistOthers
- UserPermission_UnblacklistOthers

{userID}: [permissions]

### profileData.json
- {userID}_desc: {string}
- {userID}_color: {string}
- {userID}_icon: {string}
- {userID}_url: {string}
- {userID}_footer: {string}
- {userID}_ficon: {string}

### userData.json
- {userID}: {string}

### likesData.json
- {userID}_likes: {integer}
- {userID}_liked: {integer}

### /config/channelConfigData.json
- {guildID}: [
    {object}: {value}
]

### /config/commandConfigData.json
- {guildID}: [
    {command}: {boolean}
]
