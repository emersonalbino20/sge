class User{
    #nome
    #senha 
    constructor(nome, senha){
        this.#nome = nome
        this.#senha = senha
    }

    getNome() {
        return this.#nome
    }
    setNome(newNome) {
        this.#nome = newNome
    }
    getSenha() {
        return this.#senha
    }
    setSenha(newSenha) {
        this.#senha = newSenha
    }
}
export default User;