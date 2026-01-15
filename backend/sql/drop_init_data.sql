DROP TABLE IF EXISTS note;
DROP TABLE IF EXISTS category;

CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL
);

CREATE TABLE note (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category INT NULL,
    title VARCHAR(200) NOT NULL DEFAULT '',
    description TEXT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_note_category
        FOREIGN KEY (category)
        REFERENCES category(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS note (
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

INSERT INTO category (name, color) VALUES
('Misc', '#9e9e9e'),
('Work', '#2196f3'),
('Personal', '#4caf50'),
('Ideas', '#9c27b0'),
('Shopping', '#ff9800'),
('Important', '#f44336');

INSERT INTO note (category, title, description, updated_at) VALUES
(1, 'Welcome to Notes App',
 'This is your first note. You can edit or delete it.',
 NOW() - INTERVAL 2 DAY),

(4, 'Project Ideas',
 'Brainstorm ideas for the new project. Consider using React for the frontend.',
 NOW() - INTERVAL 1 DAY - INTERVAL 5 HOUR),

(5, 'Grocery List',
 '- Milk\n- Eggs\n- Bread\n- Fruits',
 NOW() - INTERVAL 1 DAY),

(2, 'Team Meeting Notes',
 'Discussed project timeline and assigned tasks. Next meeting on Friday.',
 NOW() - INTERVAL 12 HOUR),

(3, 'Personal Goals',
 '1. Learn a new programming language\n2. Read 12 books this year\n3. Exercise 3x a week',
 NOW() - INTERVAL 6 HOUR),

(6, 'Important Deadlines',
 '- Project submission: 2025-08-15\n- Team presentation: 2025-08-20\n- Code review: 2025-08-22',
 NOW() - INTERVAL 3 HOUR),

(3, 'Book Recommendations',
 '- Atomic Habits\n- Deep Work\n- The Pragmatic Programmer',
 NOW() - INTERVAL 2 HOUR),

(2, 'Code Refactoring',
 'Need to refactor the authentication module and add error handling.',
 NOW() - INTERVAL 1 HOUR),

(3, 'Weekend Plans',
 '- Hiking on Saturday\n- Movie night\n- Meal prep for next week',
 NOW() - INTERVAL 30 MINUTE),

(4, 'Learning Resources',
 'Check out:\n- freeCodeCamp\n- MDN Web Docs\n- Real Python',
 NOW());

DELIMITER $$

CREATE TRIGGER prevent_misc_delete
BEFORE DELETE ON category
FOR EACH ROW
BEGIN
    IF OLD.id = 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot delete the default Misc category (id = 1)';
    END IF;
END;

DELIMITER ;

DELIMITER $$

CREATE TRIGGER before_category_delete
BEFORE DELETE ON category
FOR EACH ROW
BEGIN
    UPDATE note SET category = 1 WHERE category = OLD.id;
END;

DELIMITER ;
