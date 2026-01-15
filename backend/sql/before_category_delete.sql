CREATE TRIGGER before_category_delete
BEFORE DELETE ON category
FOR EACH ROW
BEGIN
    UPDATE note SET category = 1 WHERE category = OLD.id;
END;


