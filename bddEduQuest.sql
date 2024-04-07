-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : dim. 07 avr. 2024 à 20:50
-- Version du serveur : 8.3.0
-- Version de PHP : 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `bddEduQuest`
--

-- --------------------------------------------------------

--
-- Structure de la table `Commentaire`
--

CREATE TABLE `Commentaire` (
  `id_com` int NOT NULL,
  `contenu_com` text,
  `date_com` date DEFAULT NULL,
  `id_post` int DEFAULT NULL,
  `id_u` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Concerner`
--

CREATE TABLE `Concerner` (
  `id_u` int NOT NULL,
  `id_matiere` int NOT NULL,
  `lvl` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Consulter`
--

CREATE TABLE `Consulter` (
  `id_u` int NOT NULL,
  `id_contenu` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Contenu`
--

CREATE TABLE `Contenu` (
  `id_contenu` int NOT NULL,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `id_matiere` int DEFAULT NULL,
  `type_contenu` enum('Exercice','Quete','Cours') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Contenu`
--

INSERT INTO `Contenu` (`id_contenu`, `description_contenu`, `date_contenu`, `id_matiere`, `type_contenu`) VALUES
(1, 'QCM sur le subjonctif', '2024-04-07', 1, 'Exercice'),
(2, 'Cours sur les fonctions affines', '2024-04-07', 2, 'Cours'),
(3, 'Trouve la traduction de ces mots anglais', '2024-04-07', 5, 'Quete'),
(4, 'La quete infini de Mr Long', '2024-04-07', 3, 'Quete');

-- --------------------------------------------------------

--
-- Structure de la table `Cours`
--

CREATE TABLE `Cours` (
  `id_contenu` int NOT NULL,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `id_matiere` int DEFAULT NULL,
  `nom_fichier` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Cours`
--

INSERT INTO `Cours` (`id_contenu`, `description_contenu`, `date_contenu`, `id_matiere`, `nom_fichier`) VALUES
(2, 'Cours sur les fonctions affines', '2024-04-07', 2, 'cours_math_fonctions');

--
-- Déclencheurs `Cours`
--
DELIMITER $$
CREATE TRIGGER `add_cours` BEFORE INSERT ON `Cours` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Contenu 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Contenu values(new.id_contenu,new.description_contenu,new.date_contenu,new.id_matiere,'Cours'); 
select count(*) into s 
 from Cours 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_cours` BEFORE DELETE ON `Cours` FOR EACH ROW begin 

 delete from Contenu where id_contenu=old.id_contenu;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_cours` AFTER UPDATE ON `Cours` FOR EACH ROW begin 
 update Contenu 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu
    where id_contenu =old.id_contenu;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Eleve`
--

CREATE TABLE `Eleve` (
  `id_u` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `mdp` varchar(255) DEFAULT NULL,
  `niveau_etude` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Eleve`
--

INSERT INTO `Eleve` (`id_u`, `nom`, `prenom`, `mail`, `mdp`, `niveau_etude`) VALUES
(1, 'test', 'test', 'test', 'test', 6);

--
-- Déclencheurs `Eleve`
--
DELIMITER $$
CREATE TRIGGER `add_eleve` BEFORE INSERT ON `Eleve` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from User 
where id_u=new.id_u;

 if x!=1 
then 
     set new.id_u=(select max(id_u)+1 from User); 
end if;


insert into User values(new.id_u,new.mail,new.mdp,'Eleve'); 
select count(*) into s 
 from Eleve 
 where id_u=new.id_u ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_eleve` BEFORE DELETE ON `Eleve` FOR EACH ROW begin 

 delete from User where id_u=old.id_u;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_eleve` AFTER UPDATE ON `Eleve` FOR EACH ROW begin 
 update User 
  set mail = new.mail,
   mdp= new.mdp
    where id_u =old.id_u;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Exercice`
--

CREATE TABLE `Exercice` (
  `id_contenu` int NOT NULL,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `id_matiere` int DEFAULT NULL,
  `type_exercice` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Exercice`
--

INSERT INTO `Exercice` (`id_contenu`, `description_contenu`, `date_contenu`, `id_matiere`, `type_exercice`) VALUES
(1, 'QCM sur le subjonctif', '2024-04-07', 1, 'QCM');

--
-- Déclencheurs `Exercice`
--
DELIMITER $$
CREATE TRIGGER `add_exercice` BEFORE INSERT ON `Exercice` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Contenu 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Contenu values(new.id_contenu,new.description_contenu,new.date_contenu, new.id_matiere, 'Exercice'); 
select count(*) into s 
 from Exercice 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_exercice` BEFORE DELETE ON `Exercice` FOR EACH ROW begin 

 delete from Contenu where id_contenu=old.id_contenu;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_exercice` AFTER UPDATE ON `Exercice` FOR EACH ROW begin 
 update Contenu 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu
    where id_contenu =old.id_contenu;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Guilde`
--

CREATE TABLE `Guilde` (
  `id_guilde` int NOT NULL,
  `nom_guilde` varchar(255) DEFAULT NULL,
  `description_guilde` text,
  `id_prof` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Guilde`
--

INSERT INTO `Guilde` (`id_guilde`, `nom_guilde`, `description_guilde`, `id_prof`) VALUES
(1, 'Long Guilde', 'La guilde de Mr Long', 2);

-- --------------------------------------------------------

--
-- Structure de la table `Matiere`
--

CREATE TABLE `Matiere` (
  `id_matiere` int NOT NULL,
  `libelle_matiere` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Matiere`
--

INSERT INTO `Matiere` (`id_matiere`, `libelle_matiere`) VALUES
(1, 'Francais'),
(2, 'Maths'),
(3, 'Histoire'),
(4, 'Geographie'),
(5, 'Anglais');

-- --------------------------------------------------------

--
-- Structure de la table `Noter`
--

CREATE TABLE `Noter` (
  `id_u` int NOT NULL,
  `id_contenu` int NOT NULL,
  `note` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `PostForum`
--

CREATE TABLE `PostForum` (
  `id_post` int NOT NULL,
  `contenu_post` text,
  `date_post` date DEFAULT NULL,
  `id_u` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Prof`
--

CREATE TABLE `Prof` (
  `id_u` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `mdp` varchar(255) DEFAULT NULL,
  `diplome` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Prof`
--

INSERT INTO `Prof` (`id_u`, `nom`, `prenom`, `mail`, `mdp`, `diplome`) VALUES
(2, 'Long', 'Thomas', 'thomas.long@mail.com', 'mdp', 'licence prof');

--
-- Déclencheurs `Prof`
--
DELIMITER $$
CREATE TRIGGER `add_prof` BEFORE INSERT ON `Prof` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from User 
where id_u=new.id_u;

 if x!=1 
then 
     set new.id_u=(select max(id_u)+1 from User); 
end if;


insert into User values(new.id_u,new.mail,new.mdp,'Prof'); 
select count(*) into s 
 from Prof 
 where id_u=new.id_u ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_prof` BEFORE DELETE ON `Prof` FOR EACH ROW begin 

 delete from User where id_u=old.id_u;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_prof` AFTER UPDATE ON `Prof` FOR EACH ROW begin 
 update User 
  set mail = new.mail,
   mdp= new.mdp
    where id_u =old.id_u;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Quete`
--

CREATE TABLE `Quete` (
  `id_contenu` int NOT NULL,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `xp` int DEFAULT NULL,
  `id_matiere` int DEFAULT NULL,
  `type_quete` enum('Journaliere','Guilde') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Quete`
--

INSERT INTO `Quete` (`id_contenu`, `description_contenu`, `date_contenu`, `xp`, `id_matiere`, `type_quete`) VALUES
(3, 'Trouve la traduction de ces mots anglais', '2024-04-07', 25, 5, 'Journaliere'),
(4, 'La quete infini de Mr Long', '2024-04-07', 40, 3, 'Guilde');

--
-- Déclencheurs `Quete`
--
DELIMITER $$
CREATE TRIGGER `add_quete` BEFORE INSERT ON `Quete` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Contenu 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Contenu values(new.id_contenu,new.description_contenu,new.date_contenu,new.id_matiere,'Quete'); 
select count(*) into s 
 from Quete 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_quete` BEFORE DELETE ON `Quete` FOR EACH ROW begin 

 delete from Contenu where id_contenu=old.id_contenu;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_quete` AFTER UPDATE ON `Quete` FOR EACH ROW begin 
 update Contenu 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu
    where id_contenu =old.id_contenu;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Quetes_guilde`
--

CREATE TABLE `Quetes_guilde` (
  `id_contenu` int NOT NULL,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `xp` int DEFAULT NULL,
  `id_matiere` int DEFAULT NULL,
  `id_guilde` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Quetes_guilde`
--

INSERT INTO `Quetes_guilde` (`id_contenu`, `description_contenu`, `date_contenu`, `xp`, `id_matiere`, `id_guilde`) VALUES
(4, 'La quete infini de Mr Long', '2024-04-07', 40, 3, 1);

--
-- Déclencheurs `Quetes_guilde`
--
DELIMITER $$
CREATE TRIGGER `add_quete_guilde` BEFORE INSERT ON `Quetes_guilde` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Quete 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Quete values(new.id_contenu,new.description_contenu,new.date_contenu,new.xp,new.id_matiere,'Guilde'); 
select count(*) into s 
 from Quetes_jour 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_quete_guilde` BEFORE DELETE ON `Quetes_guilde` FOR EACH ROW begin 

 delete from Quete where id_contenu=old.id_contenu;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_quete_guilde` AFTER UPDATE ON `Quetes_guilde` FOR EACH ROW begin 
 update Quete 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu,
   xp = new.xp
    where id_contenu =old.id_contenu;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Quetes_jour`
--

CREATE TABLE `Quetes_jour` (
  `id_contenu` int NOT NULL,
  `description_contenu` text,
  `date_contenu` date DEFAULT NULL,
  `xp` int DEFAULT NULL,
  `id_matiere` int DEFAULT NULL,
  `difficulte` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Quetes_jour`
--

INSERT INTO `Quetes_jour` (`id_contenu`, `description_contenu`, `date_contenu`, `xp`, `id_matiere`, `difficulte`) VALUES
(3, 'Trouve la traduction de ces mots anglais', '2024-04-07', 25, 5, 3);

--
-- Déclencheurs `Quetes_jour`
--
DELIMITER $$
CREATE TRIGGER `add_quete_jour` BEFORE INSERT ON `Quetes_jour` FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Quete 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Quete values(new.id_contenu,new.description_contenu,new.date_contenu,new.xp,new.id_matiere,'Journaliere'); 
select count(*) into s 
 from Quetes_jour 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `del_quete_jour` BEFORE DELETE ON `Quetes_jour` FOR EACH ROW begin 

 delete from Quete where id_contenu=old.id_contenu;
end
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `upd_quete_jour` AFTER UPDATE ON `Quetes_jour` FOR EACH ROW begin 
 update Quete 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu,
   xp = new.xp
    where id_contenu =old.id_contenu;

end
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Structure de la table `Rejoindre`
--

CREATE TABLE `Rejoindre` (
  `id_u` int NOT NULL,
  `id_guilde` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `Rejoindre`
--

INSERT INTO `Rejoindre` (`id_u`, `id_guilde`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id_u` int NOT NULL,
  `mail` varchar(255) DEFAULT NULL,
  `mdp` varchar(255) DEFAULT NULL,
  `type` enum('Admin','Eleve','Prof') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id_u`, `mail`, `mdp`, `type`) VALUES
(1, 'test', 'test', 'Eleve'),
(2, 'thomas.long@mail.com', 'mdp', 'Prof');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
  ADD PRIMARY KEY (`id_com`),
  ADD KEY `id_post` (`id_post`),
  ADD KEY `id_u` (`id_u`);

--
-- Index pour la table `Concerner`
--
ALTER TABLE `Concerner`
  ADD PRIMARY KEY (`id_u`,`id_matiere`),
  ADD KEY `id_matiere` (`id_matiere`);

--
-- Index pour la table `Consulter`
--
ALTER TABLE `Consulter`
  ADD PRIMARY KEY (`id_u`,`id_contenu`),
  ADD KEY `id_contenu` (`id_contenu`);

--
-- Index pour la table `Contenu`
--
ALTER TABLE `Contenu`
  ADD PRIMARY KEY (`id_contenu`),
  ADD KEY `id_matiere` (`id_matiere`);

--
-- Index pour la table `Cours`
--
ALTER TABLE `Cours`
  ADD PRIMARY KEY (`id_contenu`);

--
-- Index pour la table `Eleve`
--
ALTER TABLE `Eleve`
  ADD PRIMARY KEY (`id_u`);

--
-- Index pour la table `Exercice`
--
ALTER TABLE `Exercice`
  ADD PRIMARY KEY (`id_contenu`);

--
-- Index pour la table `Guilde`
--
ALTER TABLE `Guilde`
  ADD PRIMARY KEY (`id_guilde`),
  ADD KEY `id_prof` (`id_prof`);

--
-- Index pour la table `Matiere`
--
ALTER TABLE `Matiere`
  ADD PRIMARY KEY (`id_matiere`);

--
-- Index pour la table `Noter`
--
ALTER TABLE `Noter`
  ADD PRIMARY KEY (`id_u`,`id_contenu`),
  ADD KEY `id_contenu` (`id_contenu`);

--
-- Index pour la table `PostForum`
--
ALTER TABLE `PostForum`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `id_u` (`id_u`);

--
-- Index pour la table `Prof`
--
ALTER TABLE `Prof`
  ADD PRIMARY KEY (`id_u`);

--
-- Index pour la table `Quete`
--
ALTER TABLE `Quete`
  ADD PRIMARY KEY (`id_contenu`);

--
-- Index pour la table `Quetes_guilde`
--
ALTER TABLE `Quetes_guilde`
  ADD PRIMARY KEY (`id_contenu`),
  ADD KEY `id_guilde` (`id_guilde`);

--
-- Index pour la table `Quetes_jour`
--
ALTER TABLE `Quetes_jour`
  ADD PRIMARY KEY (`id_contenu`);

--
-- Index pour la table `Rejoindre`
--
ALTER TABLE `Rejoindre`
  ADD PRIMARY KEY (`id_u`,`id_guilde`),
  ADD KEY `id_guilde` (`id_guilde`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id_u`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
  MODIFY `id_com` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Contenu`
--
ALTER TABLE `Contenu`
  MODIFY `id_contenu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `Cours`
--
ALTER TABLE `Cours`
  MODIFY `id_contenu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Eleve`
--
ALTER TABLE `Eleve`
  MODIFY `id_u` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Exercice`
--
ALTER TABLE `Exercice`
  MODIFY `id_contenu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Guilde`
--
ALTER TABLE `Guilde`
  MODIFY `id_guilde` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `Matiere`
--
ALTER TABLE `Matiere`
  MODIFY `id_matiere` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `PostForum`
--
ALTER TABLE `PostForum`
  MODIFY `id_post` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `Prof`
--
ALTER TABLE `Prof`
  MODIFY `id_u` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `Quete`
--
ALTER TABLE `Quete`
  MODIFY `id_contenu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `Quetes_guilde`
--
ALTER TABLE `Quetes_guilde`
  MODIFY `id_contenu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `Quetes_jour`
--
ALTER TABLE `Quetes_jour`
  MODIFY `id_contenu` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id_u` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Commentaire`
--
ALTER TABLE `Commentaire`
  ADD CONSTRAINT `Commentaire_ibfk_1` FOREIGN KEY (`id_post`) REFERENCES `PostForum` (`id_post`) ON DELETE CASCADE,
  ADD CONSTRAINT `Commentaire_ibfk_2` FOREIGN KEY (`id_u`) REFERENCES `User` (`id_u`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Concerner`
--
ALTER TABLE `Concerner`
  ADD CONSTRAINT `Concerner_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `Eleve` (`id_u`) ON DELETE CASCADE,
  ADD CONSTRAINT `Concerner_ibfk_2` FOREIGN KEY (`id_matiere`) REFERENCES `Matiere` (`id_matiere`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Consulter`
--
ALTER TABLE `Consulter`
  ADD CONSTRAINT `Consulter_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `Eleve` (`id_u`) ON DELETE CASCADE,
  ADD CONSTRAINT `Consulter_ibfk_2` FOREIGN KEY (`id_contenu`) REFERENCES `Contenu` (`id_contenu`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Contenu`
--
ALTER TABLE `Contenu`
  ADD CONSTRAINT `Contenu_ibfk_1` FOREIGN KEY (`id_matiere`) REFERENCES `Matiere` (`id_matiere`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Cours`
--
ALTER TABLE `Cours`
  ADD CONSTRAINT `Cours_ibfk_1` FOREIGN KEY (`id_contenu`) REFERENCES `Contenu` (`id_contenu`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Eleve`
--
ALTER TABLE `Eleve`
  ADD CONSTRAINT `Eleve_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `User` (`id_u`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Exercice`
--
ALTER TABLE `Exercice`
  ADD CONSTRAINT `Exercice_ibfk_1` FOREIGN KEY (`id_contenu`) REFERENCES `Contenu` (`id_contenu`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Guilde`
--
ALTER TABLE `Guilde`
  ADD CONSTRAINT `Guilde_ibfk_1` FOREIGN KEY (`id_prof`) REFERENCES `Prof` (`id_u`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Noter`
--
ALTER TABLE `Noter`
  ADD CONSTRAINT `Noter_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `Eleve` (`id_u`) ON DELETE CASCADE,
  ADD CONSTRAINT `Noter_ibfk_2` FOREIGN KEY (`id_contenu`) REFERENCES `Exercice` (`id_contenu`) ON DELETE CASCADE;

--
-- Contraintes pour la table `PostForum`
--
ALTER TABLE `PostForum`
  ADD CONSTRAINT `PostForum_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `User` (`id_u`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Prof`
--
ALTER TABLE `Prof`
  ADD CONSTRAINT `Prof_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `User` (`id_u`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Quete`
--
ALTER TABLE `Quete`
  ADD CONSTRAINT `Quete_ibfk_1` FOREIGN KEY (`id_contenu`) REFERENCES `Contenu` (`id_contenu`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Quetes_guilde`
--
ALTER TABLE `Quetes_guilde`
  ADD CONSTRAINT `Quetes_guilde_ibfk_1` FOREIGN KEY (`id_contenu`) REFERENCES `Quete` (`id_contenu`) ON DELETE CASCADE,
  ADD CONSTRAINT `Quetes_guilde_ibfk_2` FOREIGN KEY (`id_guilde`) REFERENCES `Guilde` (`id_guilde`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Quetes_jour`
--
ALTER TABLE `Quetes_jour`
  ADD CONSTRAINT `Quetes_jour_ibfk_1` FOREIGN KEY (`id_contenu`) REFERENCES `Quete` (`id_contenu`) ON DELETE CASCADE;

--
-- Contraintes pour la table `Rejoindre`
--
ALTER TABLE `Rejoindre`
  ADD CONSTRAINT `Rejoindre_ibfk_1` FOREIGN KEY (`id_u`) REFERENCES `Eleve` (`id_u`) ON DELETE CASCADE,
  ADD CONSTRAINT `Rejoindre_ibfk_2` FOREIGN KEY (`id_guilde`) REFERENCES `Guilde` (`id_guilde`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
