
	use bddEduQuest;

CREATE TABLE `User` (
  `id_u` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `mdp` varchar(255) DEFAULT NULL,
  `etablissement` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `niveau_etude` int DEFAULT NULL,
  `type` enum('Admin','Eleve','Prof') DEFAULT NULL,
  PRIMARY KEY (`id_u`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `User` (`id_u`, `nom`, `prenom`, `mail`, `mdp`, `etablissement`, `niveau_etude`, `type`) VALUES
(1, 'Admin', 'Admin', 'admin@mail.com', '6593d31a65175d624afc703a4070db550d4c7b91c795e431da9a69e52c1f313e', NULL, NULL, 'Admin'),
(2, 'Prof', 'Thomas', 'thomas.prof@mail.com', 'ecfa0c25f6ad24a4fe594ea4835fb352e39ce8dab049a80382a26d979f08f888', 'ESIEE-IT', NULL, 'Prof'),
(3, 'Eleve', 'Marine', 'marin.eleve@mail.com', '2579fabbc2c6bfa559d4c94b2bb72b295076cd00f4a0699d9b56cbfa60f3b3e0', NULL, 6, 'Eleve');

CREATE TABLE `Matiere` (
  `id_matiere` int NOT NULL AUTO_INCREMENT,
  `libelle_matiere` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id_matiere`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


INSERT INTO `Matiere` (`id_matiere`, `libelle_matiere`) VALUES
(1, 'Francais'),
(2, 'Maths'),
(3, 'Histoire'),
(4, 'Geographie'),
(5, 'Anglais');


CREATE TABLE `Contenu` (
  `id_contenu` int NOT NULL AUTO_INCREMENT,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `id_matiere` int NOT NULL,
  `id_u` int NOT NULL,
  `id_guilde` int DEFAULT NULL,
  `nom_fichier`varchar(255) DEFAULT NULL,
  `type_contenu` enum('Exercice','Cours') DEFAULT NULL,
   PRIMARY KEY (`id_contenu`),
   CONSTRAINT `fk_contenu_user` FOREIGN KEY (`id_u`) REFERENCES `User`(`id_u`) ON DELETE CASCADE,
   CONSTRAINT `fk_contenu_matiere` FOREIGN KEY (`id_matiere`) REFERENCES `Matiere`(`id_matiere`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `PostForum` (
  `id_post` int NOT NULL AUTO_INCREMENT,
  `contenu_post` text,
  `date_post` date DEFAULT NULL,
  `id_u` int DEFAULT NULL,
  PRIMARY KEY (`id_post`),
  CONSTRAINT `fk_postforum_user` FOREIGN KEY (`id_u`) REFERENCES `User`(`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `Commentaire` (
  `id_com` int NOT NULL AUTO_INCREMENT,
  `contenu_com` text,
  `date_com` date DEFAULT NULL,
  `id_post` int DEFAULT NULL,
  `id_u` int DEFAULT NULL,
  PRIMARY KEY (`id_com`),
  CONSTRAINT `fk_commentaire_postforum` FOREIGN KEY (`id_post`) REFERENCES `PostForum` (`id_post`) ON DELETE CASCADE,
  CONSTRAINT `fk_commentaire_user` FOREIGN KEY (`id_u`) REFERENCES `User`(`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Concerner` (
  `id_u` int NOT NULL,
  `id_matiere` int NOT NULL,
  `lvl` int DEFAULT NULL,
  PRIMARY KEY (`id_u`, `id_matiere`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `Concerner` (`id_u`, `id_matiere`, `lvl`) VALUES
(3, 1, 0),
(3, 2, 0),
(3, 3, 0),
(3, 4, 0),
(3, 5, 0);

CREATE TABLE `Consulter` (
  `id_u` int NOT NULL,
  `id_contenu` int NOT NULL,
  PRIMARY KEY (`id_u`, `id_contenu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `Guilde` (
  `id_guilde` int NOT NULL AUTO_INCREMENT,
  `nom_guilde` varchar(255) DEFAULT NULL,
  `description_guilde` text,
  `id_prof` int DEFAULT NULL,
   PRIMARY KEY (`id_guilde`),
   CONSTRAINT `fk_guilde_user` FOREIGN KEY (`id_prof`) REFERENCES `User`(`id_u`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



CREATE TABLE `Noter` (
  `id_u` int NOT NULL,
  `id_contenu` int NOT NULL,
  `note` float DEFAULT NULL,
  `date_note` date DEFAULT NULL,
  PRIMARY KEY (`id_u`, `id_contenu`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `Question` (
  `id_question` int NOT NULL AUTO_INCREMENT,
  `intitule` text NOT NULL,
  `reponse` enum('vrai','faux') NOT NULL,
  `id_contenu` int NOT NULL,
  PRIMARY KEY (`id_question`),
  CONSTRAINT `fk_question_contenu` FOREIGN KEY (`id_contenu`) REFERENCES `Contenu`(`id_contenu`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `Rejoindre` (
  `id_u` int NOT NULL,
  `id_guilde` int NOT NULL,
  PRIMARY KEY (`id_u`, `id_guilde`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


DELIMITER //

CREATE TRIGGER after_insert_user
AFTER INSERT ON User
FOR EACH ROW
BEGIN
    IF NEW.type = 'Eleve' THEN
        INSERT INTO Concerner (id_u, id_matiere, lvl)
        SELECT NEW.id_u, id_matiere, 0
        FROM Matiere;
    END IF;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE supprimerNotesEleveGuilde(IN eleveId INT, IN guildeId INT)
BEGIN
    DELETE n 
    FROM Noten
    JOIN Contenu c ON n.id_contenu = c.id_contenu
r     WHERE n.id_u = eleveId AND c.id_guilde = guildeId;
END //

DELIMITER ;

DELIMITER //

CREATE TRIGGER after_delete_rejoindre
AFTER DELETE ON Rejoindre
FOR EACH ROW
BEGIN
    CALL supprimerNotesEleveGuilde(OLD.id_u, OLD.id_guilde);
END //

DELIMITER ;
