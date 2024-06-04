import axios from "axios";


// Fonction pour calculer le niveau moyen d'un élève

function calculerNiveauMoyen(notes) {

    // Calcul de la moyenne des notes
    const moyenne = notes.reduce((acc, curr) => acc + curr, 0) / notes.length;

    // Définition des seuils pour chaque niveau
    const seuil1 = 40;
    const seuil2 = 60;
    const seuil3 = 80;
    const seuil4 = 90;

    // Calcul du niveau en fonction de la moyenne

    if (moyenne < seuil1) {

        return 1;

    } else if (moyenne < seuil2) {

        return 2;

    } else if (moyenne < seuil3) {

        return 3;

    } else if (moyenne < seuil4) {

        return 4;

    } else {

        return 5;

    }
}

function updateLevel(id_matiere, id, lvl) {
    const nouveauNiveau = {
        id_u: id,
        id_matiere: id_matiere,
        lvl: lvl
    };
    return axios.put(`http://localhost:3001/eleves/lvl`, nouveauNiveau, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function calculerNiveau(id_matiere, id) {
    try {
        const response = await axios.get(`http://localhost:3001/eleves/notes/${id_matiere}/${id}`);
        const notes = response.data.map(note => note.note);
        const lvl = calculerNiveauMoyen(notes);
        // Vérifier si la mise à jour du niveau est nécessaire
        const responseNiveauActuel = await axios.get(`http://localhost:3001/eleves/lvl/${id_matiere}/${id}`);
        const niveauActuel = responseNiveauActuel.data.lvl;
        if (niveauActuel !== lvl) {
            await updateLevel(id_matiere, id, lvl);
        }
        return lvl;
    } catch (error) {
        console.error(error);
        return null;
    }
}


export function updateProfil(updatedProfil) {
    return axios.put(`http://localhost:3001/profils/update`, updatedProfil, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

export async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }


  export const verifierAccesGuildeEleve = async (idu, guildeId) => {

    const router = useRouter();
    
    try {
      const response = await axios.get(`http://localhost:3001/guildes/all/eleve/${idu}`);
      const guildes = response.data;

  
      return guildes.some((guilde) => { 
        return guilde.id == guildeId;
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification des accès :', error);
      router.push('/guilde');
      return false;
    }
  };


  export const verifierAccesGuildeProf = async (idu, guildeId) => {

    const router = useRouter();
    
    try {
      const response = await axios.get(`http://localhost:3001/guildes/all/prof/${idu}`);
      const guildes = response.data;

      
      return guildes.some((guilde) => { 
        return guilde.id == guildeId;
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification des accès :', error);
      router.push('/guilde');
      return false;
    }
  };

  export const verifierAccesContenuEleve = async (idu, contenuId) => {

    const router = useRouter();
    
    try {
      const response = await axios.get(`http://localhost:3001/contenus/all/eleve/${idu}`);
      const contenus = response.data;

      
      return contenus.some((contenu) => { 
        return contenu.id == contenuId;
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification des accès :', error);
      router.push('/');
      return false;
    }
  };


  export const verifierAccesContenuProf = async (idu, contenuId) => {

    const router = useRouter();
    
    try {
      const response = await axios.get(`http://localhost:3001/contenus/all/prof/${idu}`);
      const contenus = response.data;

      
      return contenus.some((contenu) => { 
        return contenu.id == contenuId;
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification des accès :', error);
      router.push('/');
      return false;
    }
  };