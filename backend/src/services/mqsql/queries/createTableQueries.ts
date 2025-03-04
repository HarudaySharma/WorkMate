export const createUserTable = () => {
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

