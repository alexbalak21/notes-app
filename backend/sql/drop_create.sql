DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS category;

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL
);

CREATE TABLE note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category INT NOT NULL,
    title VARCHAR(200) NOT NULL DEFAULT '',
    description TEXT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_note_category
        FOREIGN KEY (category)
        REFERENCES category(id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
