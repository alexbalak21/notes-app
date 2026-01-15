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
