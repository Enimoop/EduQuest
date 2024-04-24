
export function createSession(user) {
    const userData = {
      id: user.id,
      mail: user.mail,
      type: user.type
    };
    localStorage.setItem('user', JSON.stringify(userData));
  }



export function checkSession() {
    if (typeof localStorage !== 'undefined') {
        const user = localStorage.getItem('user');
        return !!user; // Si user est défini, retourne true, sinon retourne false
    }
    return false;
}

export function logout() {
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('user'); // Supprime les informations de session de localStorage
    }
}