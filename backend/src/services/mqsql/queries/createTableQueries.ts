export const createUsersTableQ = () => {
    return `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,

            name VARCHAR(100),
            username VARCHAR(100) UNIQUE NOT NULL,

            email VARCHAR(100) UNIQUE NOT NULL,
            email_verified TINYINT(1) DEFAULT 0, -- Boolean field with default value (0 = false)

            hashed_password TEXT NOT NULL,
            hash_salt CHAR(10) NOT NULL, -- custom salt for each user (to be appended after the password provided by user)

            profile_picture VARCHAR(2083) DEFAULT "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y", -- maximum url length is 2083 in most of the browsers

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
    `
}

export const createWorkspacesTableQ = () => {
    return `
     CREATE TABLE IF NOT EXISTS workspaces (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            invite_link VARCHAR(255) UNIQUE,
            creator_id INT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_workspaces_creator_id FOREIGN KEY (creator_id)
                REFERENCES users(id)
                -- ON DELETE CASCADE -- will use it later
        );
    `;
}


export const createWorkspaceMembersTableQ = () => {
    return `
        CREATE TABLE IF NOT EXISTS workspace_members (
            user_id INT,
            workspace_id INT,
            role ENUM('admin', 'member') NOT NULL DEFAULT 'member',

            CONSTRAINT fk_wkspcmbr_user_id FOREIGN KEY (user_id)
                REFERENCES users(id),
                -- ON DELETE CASCADE -- will use it later

            CONSTRAINT fk_wkspcmbr_workspace_id FOREIGN KEY (workspace_id)
                REFERENCES workspaces(id),
                -- ON DELETE CASCADE -- will use it later

             UNIQUE KEY uq_user_workspace (user_id, workspace_id)
        );
    `
}

export const createChatsTableQ = () => {
    return `
     CREATE TABLE IF NOT EXISTS chats (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100),
            type ENUM('group', 'one-one') NOT NULL DEFAULT 'one-one',
            workspace_id INT,

            last_message_at TIMESTAMP,

            CONSTRAINT fk_chats_workspace_id FOREIGN KEY (workspace_id)
                REFERENCES workspaces(id)
                -- ON DELETE CASCADE -- will use it later
        );
    `;
}

export const createChatMembersTableQ = () => {
    return `
        CREATE TABLE IF NOT EXISTS chat_members (
            user_id INT,
            chat_id INT,

            role ENUM('admin', 'member') NOT NULL DEFAULT 'member',

            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT fk_chatsmbr_user_id FOREIGN KEY (user_id)
                REFERENCES users(id),
                -- ON DELETE CASCADE -- will use it later

            CONSTRAINT fk_chatsmbr_chat_id FOREIGN KEY (chat_id)
                REFERENCES chats(id),
                -- ON DELETE CASCADE -- will use it later

             UNIQUE KEY uq_user_chat (user_id, chat_id)
        );
    `
}

export const createMessagesTableQ = () => {
    return `
     CREATE TABLE IF NOT EXISTS messages (
            message_id CHAR(36) PRIMARY KEY NOT NULL,
            sender_id INT NOT NULL,
            chat_id INT NOT NULL,

            type ENUM('text', 'image', 'audio') NOT NULL,

            text TEXT DEFAULT NULL,
            image_url VARCHAR(2083) DEFAULT NULL, -- maximum url length is 2083 in most of the browsers
            audio_url VARCHAR(2083) DEFAULT NULL, -- maximum url length is 2083 in most of the browsers

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            is_deleted TINYINT(1) DEFAULT 0, -- Boolean field with default value (0 = false)

            CONSTRAINT fk_messages_sender_id FOREIGN KEY (sender_id)
                REFERENCES users(id),
                -- ON DELETE CASCADE -- will use it later
            CONSTRAINT fk_messages_chat_id FOREIGN KEY (chat_id)
                REFERENCES chats(id)
                -- ON DELETE CASCADE -- will use it later
        );
    `;
}

export const createMessageRecipientsTableQ = () => {
    return `
     CREATE TABLE IF NOT EXISTS message_recipients (
         message_id CHAR(36) NOT NULL,
         user_id INT NOT NULL,
         is_read TINYINT(1) DEFAULT 0,  -- 0 = unread, 1 = read
         read_at TIMESTAMP NULL DEFAULT NULL, -- When the user read the message

         PRIMARY KEY (message_id, user_id),
         FOREIGN KEY (message_id) REFERENCES messages(message_id) ON DELETE CASCADE,
         FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
     );
    `;
}


