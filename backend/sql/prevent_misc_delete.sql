CREATE TRIGGER prevent_misc_delete
BEFORE DELETE ON category
FOR EACH ROW
BEGIN
    IF OLD.id = 1 THEN
        SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'Cannot delete the default Misc category (id = 1)';
    END IF;
END;
