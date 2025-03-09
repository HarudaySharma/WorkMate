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

            CONSTRAINT fk_creator_id FOREIGN KEY (creator_id)
                REFERENCES users(id)
                -- ON DELETE CASCADE -- will use it later
        );
    `;
}

export const createMembersTableQ = () => {
    return `
        CREATE TABLE IF NOT EXISTS members (
            user_id INT,
            workspace_id INT,
            role ENUM('admin', 'user') NOT NULL DEFAULT 'user',

            CONSTRAINT fk_user_id FOREIGN KEY (user_id)
                REFERENCES users(id),
                -- ON DELETE CASCADE -- will use it later

            CONSTRAINT fk_workspace_id FOREIGN KEY (workspace_id)
                REFERENCES workspaces(id)
                -- ON DELETE CASCADE -- will use it later
        );
    `
}
