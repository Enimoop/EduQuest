import axios from 'axios';  
export function getSubFromToken(tokenRef) {
    // Si tokenRef est une référence Vue, accédez à la propriété _value
    const tokenData = tokenRef._value;

    // Vérifie si la clé 'sub' existe dans le token
    if ('sub' in tokenData) {
        // Récupère la valeur de la clé 'sub'
        const subValue = tokenData['sub'];
        return subValue;
    } else {
        return null; // Si la clé 'sub' n'existe pas dans le token
    }
}

export async function returnUserType(id) {
    try {
      const response = await axios.get(`http://localhost:3001/profils/type/${id}`);
      return response.data.type;
    } catch (error) {
      console.error('Error fetching profil:', error);
      return null;
    }
  }

