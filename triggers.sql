DELIMITER $

CREATE TRIGGER `add_cours` BEFORE INSERT ON `Cours`
 FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Contenu 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Contenu values(new.id_contenu,new.description_contenu,new.date_contenu,new.id_matiere,new.id_u,'Cours'); 
select count(*) into s 
 from Cours 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end $

CREATE TRIGGER `add_eleve` BEFORE INSERT ON `Eleve`
 FOR EACH ROW begin 
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

end $

CREATE TRIGGER `add_exercice` BEFORE INSERT ON `Exercice`
 FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Contenu 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Contenu values(new.id_contenu,new.description_contenu,new.date_contenu, new.id_matiere,new.id_u, 'Exercice'); 
select count(*) into s 
 from Exercice 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end $

CREATE TRIGGER `add_prof` BEFORE INSERT ON `Prof`
 FOR EACH ROW begin 
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

end $

CREATE TRIGGER `add_quete` BEFORE INSERT ON `Quete`
 FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Contenu 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Contenu values(new.id_contenu,new.description_contenu,new.date_contenu,new.id_matiere,new.id_u,'Quete'); 
select count(*) into s 
 from Quete 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end $

CREATE TRIGGER `add_quete_guilde` BEFORE INSERT ON `Quetes_guilde`
 FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Quete 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Quete values(new.id_contenu,new.description_contenu,new.date_contenu,new.xp,new.id_matiere,new.id_u,'Guilde'); 
select count(*) into s 
 from Quetes_jour 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end $

CREATE TRIGGER `add_quete_jour` BEFORE INSERT ON `Quetes_jour`
 FOR EACH ROW begin 
declare a,x,s int ;
select count(*) into x from Quete 
where id_contenu=new.id_contenu;

 if x!=1 
then 
     set new.id_contenu=(select max(id_contenu)+1 from Contenu); 
end if;


insert into Quete values(new.id_contenu,new.description_contenu,new.date_contenu,new.xp,new.id_matiere,new.id_u,'Journaliere'); 
select count(*) into s 
 from Quetes_jour 
 where id_contenu=new.id_contenu ; 
  if s>0
     then signal sqlstate'45000' 
       set message_text= 'impossible ' ;
   end if;

end $

CREATE TRIGGER `del_cours` BEFORE DELETE ON `Cours`
 FOR EACH ROW begin 

 delete from Contenu where id_contenu=old.id_contenu;
end $

CREATE TRIGGER `del_eleve` BEFORE DELETE ON `Eleve`
 FOR EACH ROW begin 

 delete from User where id_u=old.id_u;
end $

CREATE TRIGGER `del_exercice` BEFORE DELETE ON `Exercice`
 FOR EACH ROW begin 

 delete from Contenu where id_contenu=old.id_contenu;
end $

CREATE TRIGGER `del_prof` BEFORE DELETE ON `Prof`
 FOR EACH ROW begin 

 delete from User where id_u=old.id_u;
end $

CREATE TRIGGER `del_quete` BEFORE DELETE ON `Quete`
 FOR EACH ROW begin 

 delete from Contenu where id_contenu=old.id_contenu;
end $

CREATE TRIGGER `del_quete_guilde` BEFORE DELETE ON `Quetes_guilde`
 FOR EACH ROW begin 

 delete from Quete where id_contenu=old.id_contenu;
end $

CREATE TRIGGER `del_quete_jour` BEFORE DELETE ON `Quetes_jour`
 FOR EACH ROW begin 

 delete from Quete where id_contenu=old.id_contenu;
end $

CREATE TRIGGER `upd_cours` AFTER UPDATE ON `Cours`
 FOR EACH ROW begin 
 update Contenu 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu
    where id_contenu =old.id_contenu;

end $

CREATE TRIGGER `upd_eleve` AFTER UPDATE ON `Eleve`
 FOR EACH ROW begin 
 update User 
  set mail = new.mail,
   mdp= new.mdp
    where id_u =old.id_u;

end $

CREATE TRIGGER `upd_exercice` AFTER UPDATE ON `Exercice`
 FOR EACH ROW begin 
 update Contenu 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu
    where id_contenu =old.id_contenu;

end $

CREATE TRIGGER `upd_prof` AFTER UPDATE ON `Prof`
 FOR EACH ROW begin 
 update User 
  set mail = new.mail,
   mdp= new.mdp
    where id_u =old.id_u;

end $

CREATE TRIGGER `upd_quete` AFTER UPDATE ON `Quete`
 FOR EACH ROW begin 
 update Contenu 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu
    where id_contenu =old.id_contenu;

end $

CREATE TRIGGER `upd_quete_guilde` AFTER UPDATE ON `Quetes_guilde`
 FOR EACH ROW begin 
 update Quete 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu,
   xp = new.xp
    where id_contenu =old.id_contenu;

end $

CREATE TRIGGER `upd_quete_jour` AFTER UPDATE ON `Quetes_jour`
 FOR EACH ROW begin 
 update Quete 
  set description_contenu = new.description_contenu,
   date_contenu= new.date_contenu,
   xp = new.xp
    where id_contenu =old.id_contenu;

end $

DELIMITER ;
